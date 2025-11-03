import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("Received request to /api/contentful/publish");

    const body = await req.json();
    console.log("Request body:", body);

    const spaceId = process.env.CONTENTFUL_SPACE_ID!;
    const envId = process.env.CONTENTFUL_ENVIRONMENT || "master";
    const token = process.env.CONTENTFUL_CMA_TOKEN!;
    console.log("Using Space:", spaceId, "Env:", envId);

    const baseUrl = `https://api.contentful.com/spaces/${spaceId}/environments/${envId}`;
    let entryId = body.entryId;
    let entry;

    // Create draft if no entryId
    if (!entryId) {
      console.log("No entryId — creating draft entry...");
      const createRes = await fetch(`${baseUrl}/entries`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/vnd.contentful.management.v1+json",
          "X-Contentful-Content-Type": "Submission",
        },
        body: JSON.stringify({
          fields: {
            name: { "en-US": body.name },
            email: { "en-US": body.email },
            submissionType: { "en-US": body.submissionType },
            ideaDescription: { "en-US": body.ideaDescription },
            motivation: { "en-US": body.motivation },
            draftFile: { "en-US": body.draftFile },
            category: { "en-US": body.category },
            missionResonance: { "en-US": body.missionResonance },
            missionRelation: { "en-US": body.missionRelation },
            articleFile: { "en-US": body.articleFile },
            signature: { "en-US": body.signature },
            questions: { "en-US": body.questions },
          },
        }),
      });

      console.log("Create response status:", createRes.status);
      if (!createRes.ok) {
        const errText = await createRes.text();
        console.error("Entry creation failed:", errText);
        throw new Error(`Entry creation failed: ${errText}`);
      }

      entry = await createRes.json();
      entryId = entry.sys.id;
      console.log(`Draft entry created with ID: ${entryId}`);
    } else {
      console.log("Fetching existing entry:", entryId);
      const entryRes = await fetch(`${baseUrl}/entries/${entryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetch response status:", entryRes.status);
      if (!entryRes.ok) {
        const errText = await entryRes.text();
        console.error("Entry fetch failed:", errText);
        throw new Error(`Entry fetch failed: ${errText}`);
      }

      entry = await entryRes.json();
    }

    console.log("Publishing entry:", entryId);
    const publishRes = await fetch(`${baseUrl}/entries/${entryId}/published`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
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
  } catch (err: any) {
    console.error("Publish error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
