import Post from "../../models/Post";
import { NextResponse } from "next/server";
import {ConnectToDB, CloseConnection} from "../../lib/dbConn";
//router for Posts

export async function GET() {
    await ConnectToDB();
    const posts = await Post.find();
    return NextResponse.json({ posts });

}