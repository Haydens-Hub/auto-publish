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

async function uploadPDFToContentful(fileBuffer: Buffer, fileName: string) {
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  //get data
  await ConnectToDB();
  const { id } = await params;
  const post = await getPostById(id);
  const markdownText = await pdf2md(post.articleFile.data.buffer);
  const mainContentRichText = await richTextFromMarkdown(markdownText);
  const referencesRichText = await richTextFromMarkdown(post.references);

  const assetId = await uploadPDFToContentful(post.articleFile.data.buffer, post.articleFile.filename);

  const createRes = await fetch(`${BASE_URL}/entries`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CONTENTFUL_CMA_TOKEN}`,
      "Content-Type": "application/vnd.contentful.management.v1+json",
      "X-Contentful-Content-Type": "post",
    },
    body: JSON.stringify({
      fields: {
        title: { "en-US": post.title },
        publishedDate: { "en-US": new Date().toISOString() },
        mainContent: { "en-US": mainContentRichText },
        categoryType: { "en-US": post.category },
        shortBlurb: { "en-US": post.shortBlurb },
        abstract: { "en-US": post.abstract },
        references: { "en-US": referencesRichText },
        pdf: {
          "en-US": {
            sys: {
              type: "Link",
              linkType: "Asset",
              id: assetId,
            },
          },
        },
        slug: { "en-US": slug(post.title) },
      },
    }),
  });

  console.log("Create response status:", createRes.status);
  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Entry creation failed: ${errText}`);
  }
  const entry = await createRes.json();
  const entryId = entry.sys.id;
  console.log(`Draft entry created with ID: ${entryId}`);

  // console.log("Publishing entry:", entryId);
  // const publishRes = await fetch(`${BASE_URL}/entries/${entryId}/published`, {
  //   method: "PUT",
  //   headers: {
  //     Authorization: `Bearer ${CONTENTFUL_CMA_TOKEN}`,
  //     "Content-Type": "application/vnd.contentful.management.v1+json",
  //     "X-Contentful-Version": entry.sys.version.toString(),
  //   },
  //   body: JSON.stringify(entry),
  // });

  // console.log("Publish response status:", publishRes.status);
  // if (!publishRes.ok) {
  //   const errText = await publishRes.text();
  //   console.error("Publish failed:", errText);
  //   throw new Error(`Publish failed: ${errText}`);
  // }

  // const published = await publishRes.json();
  // console.log("Published successfully:", published.sys.id);

  return NextResponse.json({
    success: true,
    entryId,
    message: "Entry created successfully",
  });
}
