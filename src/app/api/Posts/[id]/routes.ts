import {NextResponse} from "next/server";
import {ConnectToDB,DeletePostById} from "../../../../../lib/dbConn";
import Post from "../../../../../models/Post";



export async function DELETE(request: Request, { params }: { params: { id: string } })
{
    const {id}=params;
    try{
    await ConnectToDB();
    const deletedpost=await Post.findByIdAndDelete(id);
    if (!deletedpost) {
        return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(
        {message: "Post deleted successfully",data:deletedpost},{status:200});
    }catch(err){
        return NextResponse.json({error:'Failed to delete post'},{status:500});
    }

    }