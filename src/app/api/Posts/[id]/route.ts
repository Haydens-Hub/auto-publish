import {NextRequest} from "next/server";
import {ConnectToDB} from "../../../../../lib/dbConn";
import Post from "../../../../../models/Post";
import mongoose from "mongoose";


export async function DELETE(request: Request, { params }: { params: { id: string } })
{
    const {id}=await params;
    await ConnectToDB();
    try{
    const deletedpost=await Post.findByIdAndDelete(new mongoose.Types.ObjectId(id));
    if (!deletedpost) {
        return new Response(JSON.stringify({success:false}),{status:404});
    }
    return new Response(JSON.stringify({success:true, data: deletedpost}),{status:200});
    }catch(err){
        return new Response(JSON.stringify({success:false}),{status:500});
    }

    }



    