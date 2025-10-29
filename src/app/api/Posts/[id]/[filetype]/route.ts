import {  NextRequest, NextResponse } from "next/server";
import { ConnectToDB } from "@/lib/dbConn";
import Post from "@/models/Post";
import { buffer } from "stream/consumers";



export async function GET(
  request:NextRequest, {params}:{params:Promise<{id:string, filetype:string}>}
)
{
  try{
    const {id,filetype}=await params;
    await ConnectToDB();
    const post=await Post.findById(id);
    if (!post) {
      return new NextResponse('Post not found', { status: 404 });
    }

if (filetype=="articleFile")
{
      if (!post.articleFile) {
      return new NextResponse('Article file not found', { status: 404 });
    }
    console.log(post.articleFile);
    const fileData=post.articleFile.data;
    const fileName=post.articleFile.filename || 'article-download';
    const contentType=post.articleFile.contentType || 'application/octet-stream';

    let fileBuffer: Buffer;

        if (Buffer.isBuffer(fileData)) {
      fileBuffer = fileData;
    } else if (fileData instanceof ArrayBuffer) {
      fileBuffer = Buffer.from(fileData);
    } else if (typeof fileData === 'object' && fileData.buffer) {
      fileBuffer = Buffer.from(fileData.buffer);
    } else {
      fileBuffer = Buffer.from(fileData);
    }

    const headers = new Headers();
    headers.set('Content-Disposition', `attachment; filename="${fileName}"`);
    headers.set('Content-Type', contentType);
    headers.set('Content-Length', fileBuffer.length.toString());
    headers.set('Cache-Control', 'no-cache');
  

    const bufferResponse=new Uint8Array(fileBuffer);
      return new NextResponse(bufferResponse, {
      status: 200,
      headers: headers,
    });
}

else{
      if (!post.draftFile) {
      return new NextResponse('Draft file not found', { status: 404 });
    }
    console.log(post.draftFile);
    const fileData=post.draftFile.data;
    const fileName=post.draftFile.filename || 'draft-download';
    const contentType=post.draftFile.contentType || 'application/octet-stream';

    let fileBuffer: Buffer;

        if (Buffer.isBuffer(fileData)) {
      fileBuffer = fileData;
    } else if (fileData instanceof ArrayBuffer) {
      fileBuffer = Buffer.from(fileData);
    } else if (typeof fileData === 'object' && fileData.buffer) {
      fileBuffer = Buffer.from(fileData.buffer);
    } else {
      fileBuffer = Buffer.from(fileData);
    }

    const headers = new Headers();
    headers.set('Content-Disposition', `attachment; filename="${fileName}"`);
    headers.set('Content-Type', contentType);
    headers.set('Content-Length', fileBuffer.length.toString());
    headers.set('Cache-Control', 'no-cache');
  

    const bufferResponse=new Uint8Array(fileBuffer);
      return new NextResponse(bufferResponse, {
      status: 200,
      headers: headers,
    });
}


  }
  catch (e) {
        console.error('Error downloading article file:', e);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}