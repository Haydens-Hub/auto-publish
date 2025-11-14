import { NextRequest, NextResponse } from "next/server";
import Post from "@/models/Post";
import { ConnectToDB } from "@/lib/dbConn";
import { fileToBuffer } from "@/lib/fileToBuffer";

export async function POST(request: NextRequest) {
  try {
    //get form data and convert files to buffers
    const data = await request.formData();
    const articlefile = data.get("articleFile") as File | null;
    const draftFile = data.get("draftFile") as File | null;
    const articleFileBuffer = articlefile
      ? await fileToBuffer(articlefile)
      : undefined;
    const draftFileBuffer = draftFile
      ? await fileToBuffer(draftFile)
      : undefined;

    await ConnectToDB();

    const name = data.get("name")?.toString() || "";
    const email = data.get("email")?.toString() || "";
    const submissionType = data.get("submissionType")?.toString() || "";
    const ideaDescription = data.get("ideaDescription")?.toString() || "";
    const motivation = data.get("motivation")?.toString() || "";
    const category = data.get("category")?.toString() || "";
    const missionResonance = data.get("missionResonance")?.toString() || "";
    const missionRelation = data.get("missionRelation")?.toString() || "";
    const signature = data.get("signature")?.toString() || "";
    const questions = data.get("questions")?.toString() || "";
    const date = new Date();
    //generate title from article file name if available
    const title: string = articleFileBuffer ? articleFileBuffer.filename.split(".").slice(0, -1).join(".") : "Article";
    const references: string = data.get("references")?.toString() || "";
    const abstract: string = data.get("abstract")?.toString() || "";
    const shortblurb: string = data.get("shortblurb")?.toString() || "";
    //create new post
    const post = new Post({
      name,
      email,
      date,
      submissionType,
      ideaDescription,
      motivation,
      category,
      missionResonance,
      missionRelation,
      signature,
      questions,
      articleFile: articleFileBuffer || null,
      draftFile: draftFileBuffer || null,
      title,
      references,
      abstract,
      shortblurb,
    });
    //save post
    await post.save();

    return NextResponse.json(
      { message: "Post created successfully" },
      { status: 201 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "Failed to create post" },
      { status: 500 }
    );
  }
}
