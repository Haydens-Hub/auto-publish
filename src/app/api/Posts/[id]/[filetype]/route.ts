import { NextRequest, NextResponse } from "next/server";
import { ConnectToDB } from "@/lib/dbConn";
import Post from "@/models/Post";
import { buffer } from "stream/consumers";
import {auth} from "@/auth"
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; filetype: string }> }
)
 {  //authentication
    const session = await auth();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }


  try {
    const { id, filetype } = await params;
    await ConnectToDB();
    const post = await Post.findById(id);
    if (!post) {
      return new NextResponse("Post not found", { status: 404 });
    }

    // Decide which file property to use
    const file = filetype === "articleFile" ? post.articleFile : post.draftFile;
    if (!file) {
      return new NextResponse(
        `${filetype === "articleFile" ? "Article" : "Draft"} file not found`,
        { status: 404 }
      );
    }
    //get the file
    const fileData = file.data;
    const fileName = file.filename || `${filetype}-download`;
    const contentType = file.contentType || "application/octet-stream";

    // Buffer normalization
    let fileBuffer: Buffer;
    if (Buffer.isBuffer(fileData)) {
      fileBuffer = fileData;
    } else if (fileData instanceof ArrayBuffer) {
      fileBuffer = Buffer.from(fileData);
    } else if (typeof fileData === "object" && fileData.buffer) {
      fileBuffer = Buffer.from(fileData.buffer);
    } else {
      fileBuffer = Buffer.from(fileData);
    }

    // Set headers for download
    const headers = new Headers();
    headers.set("Content-Disposition", `attachment; filename=\"${fileName}\"`);
    headers.set("Content-Type", contentType);
    headers.set("Content-Length", fileBuffer.length.toString());
    headers.set("Cache-Control", "no-cache");

    // Send the file as response
    const bufferResponse = new Uint8Array(fileBuffer);
    return new NextResponse(bufferResponse, {
      status: 200,
      headers: headers,
    });
      
  } catch (e) {
    console.error("Error downloading article file:", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
