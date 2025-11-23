import { ConnectToDB, getPostById } from "@/lib/dbConn";
import pdf2md from "@opendocsg/pdf2md";
import { NextRequest, NextResponse } from "next/server";
import { richTextFromMarkdown } from "@contentful/rich-text-from-markdown";
import slug from 'slug';

const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID!;
const CONTENTFUL_ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || "master";
const CONTENTFUL_CMA_TOKEN = process.env.CONTENTFUL_CMA_TOKEN!;
const UPLOAD_URL = `https://upload.contentful.com/spaces/${CONTENTFUL_SPACE_ID}`;
const BASE_URL = `https://api.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIRONMENT}`;

interface SlugExistsResult {
  exists: boolean,
  entryId?: string,
  version?: number,
}

async function doesSlugAlreadyExist(contentType: string, slug: string): Promise<SlugExistsResult> {
  try {
    const searchRes = await fetch(
      `${BASE_URL}/entries?content_type=${contentType}&fields.slug=${slug}&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${CONTENTFUL_CMA_TOKEN}`,
        },
      }
    );

    if (!searchRes.ok) {
      const errText = await searchRes.text();
      throw new Error(`Slug check failed: ${errText}`);
    }

    const data = await searchRes.json();
    return {
      exists: data.items.length > 0,
      entryId: data.items[0]?.sys.id,
      version: data.items[0]?.sys.version,
    };
  } catch (error) {
    console.error("Error checking slug:", error);
    throw error;
  }
}

async function uploadPDFToContentful(fileBuffer: Buffer, fileName: string): Promise<string> {
  const uploadRes = await fetch(`${UPLOAD_URL}/uploads`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CONTENTFUL_CMA_TOKEN}`,
      "Content-Type": "application/octet-stream",
    },
    body: new Uint8Array(fileBuffer),
  });

  if (!uploadRes.ok) {
    const errText = await uploadRes.text();
    throw new Error(`Entry creation failed: ${errText}`);
  }

  const upload = await uploadRes.json();

  const createAssetRes = await fetch(`${BASE_URL}/assets`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CONTENTFUL_CMA_TOKEN}`,
    },
    body: JSON.stringify({
      fields: {
        title: { "en-US": fileName },
        file: {
          "en-US": {
            contentType: "application/pdf",
            fileName: fileName,
            uploadFrom: {
              sys: {
                type: "Link",
                linkType: "Upload",
                id: upload.sys.id,
              },
            },
          },
        },
      },
    }),
  });

  if (!createAssetRes.ok) {
    const errText = await createAssetRes.text();
    throw new Error(`Entry creation failed: ${errText}`);
  }

  const asset = await createAssetRes.json();
  const assetId = asset.sys.id;

  const processRes = await fetch(`${BASE_URL}/assets/${assetId}/files/en-US/process`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${CONTENTFUL_CMA_TOKEN}`,
      "X-Contentful-Version": asset.sys.version.toString(),
    },
  });

  if (!processRes.ok) {
    const errText = await processRes.text();
    throw new Error(`Entry creation failed: ${errText}`);
  }

  return assetId;
}

async function createAuthor(name: string, title?: string, about?: string, reflection?: string): Promise<string> {
  const slugifiedName = slug(name) + "-author";
  const slugExistsRes = await doesSlugAlreadyExist("author", slugifiedName);

  if (slugExistsRes.exists) {
    return slugExistsRes.entryId!;
  }

  const createRes = await fetch(`${BASE_URL}/entries`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CONTENTFUL_CMA_TOKEN}`,
      "Content-Type": "application/vnd.contentful.management.v1+json",
      "X-Contentful-Content-Type": "author",
    },
    body: JSON.stringify({
      fields: {
        authorName: { "en-US": name },
        authorTitle: { "en-US": title || "Advocate" },
        aboutAuthor: { "en-US": about || "No description." },
        reflectionOnWriting: { "en-US": reflection || "No reflection." },
        slug: { "en-US": slugifiedName },
      },
    }),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Entry creation failed: ${errText}`);
  }

  const entry = await createRes.json();
  return entry.sys.id;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await ConnectToDB();
  const { id } = await params;
  const post = await getPostById(id);
  let slugExistsRes: SlugExistsResult = { exists: false };
  if (!post) {
    return new NextResponse("Post not found", { status: 404 });
  }

  const postFields: Record<string, object> = {
    publishedDate: { "en-US": new Date().toISOString() },
    categoryType: { "en-US": post.category },
    shortBlurb: { "en-US": post.shortBlurb },
    abstract: { "en-US": post.abstract },
  };

  if (post.title) {
    const slugifiedTitle = slug(post.title);
    postFields.title = { "en-US": post.title };
    postFields.slug = { "en-US": slugifiedTitle };
    slugExistsRes = await doesSlugAlreadyExist("post", slugifiedTitle);
  }

  if (post.name) {
    const authorId = await createAuthor(post.name, post.authorTitle, post.about, post.reflection);
    postFields.author = {
      "en-US": {
        sys: {
          type: "Link",
          linkType: "Entry",
          id: authorId,
        },
      },
    };
  }

  if (post.articleFile) {
    const markdownText = await pdf2md(post.articleFile.data.buffer);
    const mainContentRichText = await richTextFromMarkdown(markdownText);
    postFields.mainContent = { "en-US": mainContentRichText };

    const assetId = await uploadPDFToContentful(post.articleFile.data.buffer, post.articleFile.filename);
    postFields.pdf = {
      "en-US": {
        sys: {
          type: "Link",
          linkType: "Asset",
          id: assetId,
        },
      },
    };
  }

  if (post.references) {
    const referencesRichText = await richTextFromMarkdown(post.references);
    postFields.references = { "en-US": referencesRichText };
  }

  let createRes;

  if (slugExistsRes.exists) {
    createRes = await fetch(`${BASE_URL}/entries/${slugExistsRes.entryId!}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${CONTENTFUL_CMA_TOKEN}`,
        "Content-Type": "application/vnd.contentful.management.v1+json",
        "X-Contentful-Version": slugExistsRes.version!.toString(),
      },
      body: JSON.stringify({
        fields: postFields,
      }),
    });
    console.log("Attempting PUT request to update based on entry id...");
  } else {
    createRes = await fetch(`${BASE_URL}/entries`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CONTENTFUL_CMA_TOKEN}`,
        "Content-Type": "application/vnd.contentful.management.v1+json",
        "X-Contentful-Content-Type": "post",
      },
      body: JSON.stringify({ fields: postFields })
    });
    console.log("Attempting POST request to create entry...");
  }

  console.log("Create post response status:", createRes.status);
  if (!createRes.ok) {
    const errText = await createRes.text();
    return NextResponse.json(
      { success: false, message: `Failed to create or update post: ${errText}` },
      { status: createRes.status }
    );
  }
  const entry = await createRes.json();
  const entryId = entry.sys.id;

  return NextResponse.json({
    success: true,
    entryId,
    message: "Entry created successfully",
  });
}
