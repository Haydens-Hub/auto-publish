import { ConnectToDB, getPostById } from "@/lib/dbConn";
import pdf2md from "@opendocsg/pdf2md";
import { NextRequest, NextResponse } from "next/server";
import { richTextFromMarkdown } from "@contentful/rich-text-from-markdown";

const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID!;
const CONTENTFUL_ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || "master";
const CONTENTFUL_CMA_TOKEN = process.env.CONTENTFUL_CMA_TOKEN!;
const BASE_URL = `https://api.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIRONMENT}`;

//TODO: pass necessary fields directly instead of fetching entire post from database. when publishing the database will already be loaded, so it's just better to handle it that way.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  //get data
  await ConnectToDB();
  const { id } = await params;
  const post = await getPostById(id);
  const pdfBuffer = post.articleFile;
  console.log(pdfBuffer.data?.length);
  const markdownText = await pdf2md(pdfBuffer.data.buffer);
  const richText = await richTextFromMarkdown(markdownText);

  console.log("No entryId, creating draft entry...");
  const createRes = await fetch(`${BASE_URL}/entries`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CONTENTFUL_CMA_TOKEN}`,
      "Content-Type": "application/vnd.contentful.management.v1+json",
      "X-Contentful-Content-Type": "post",
    },
    body: JSON.stringify({
      fields: {
        title: { "en-US": pdfBuffer.filename },
        publishedDate: { "en-US": new Date().toISOString() },
        mainContent: { "en-US": richText },
        categoryType: { "en-US": post.category },
      },
    }),
  });

  console.log("Create response status:", createRes.status);
  if (!createRes.ok) {
    const errText = await createRes.text();
    console.error("Entry creation failed:", errText);
    throw new Error(`Entry creation failed: ${errText}`);
  }
  const entry = await createRes.json();
  const entryId = entry.sys.id;
  console.log(`Draft entry created with ID: ${entryId}`);

  console.log("Publishing entry:", entryId);
  const publishRes = await fetch(`${BASE_URL}/entries/${entryId}/published`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${CONTENTFUL_CMA_TOKEN}`,
      "Content-Type": "application/vnd.contentful.management.v1+json",
      "X-Contentful-Version": entry.sys.version.toString(),
    },
    body: JSON.stringify(entry),
  });

  console.log("Publish response status:", publishRes.status);
  if (!publishRes.ok) {
    const errText = await publishRes.text();
    console.error("Publish failed:", errText);
    throw new Error(`Publish failed: ${errText}`);
  }

  const published = await publishRes.json();
  console.log("Published successfully:", published.sys.id);

  return NextResponse.json({
    success: true,
    entryId,
    message: "Entry created and published successfully",
    entry: published,
  });
}
