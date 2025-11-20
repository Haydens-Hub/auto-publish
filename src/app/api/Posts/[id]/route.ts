import { NextRequest, NextResponse } from "next/server";
import { ConnectToDB } from "@/lib/dbConn";
import Post from "@/models/Post";
import mongoose from "mongoose";
import { auth } from "@/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    const session = await auth();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
  //get ID and connect to DB
  const { id } = params;
  await ConnectToDB();
  try {
    //find and delete post by ID, then return response
    const deletedpost = await Post.findByIdAndDelete(
      new mongoose.Types.ObjectId(id)
    );
    if (!deletedpost) {
      return NextResponse.json({ success: false }, { status: 404 });
    }
    return NextResponse.json(
      { success: true, data: deletedpost },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
