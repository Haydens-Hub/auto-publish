import mongoose from "mongoose";
import dotenv from "dotenv";
import Post from "../models/Post";
dotenv.config();

declare global {
  var mongoose: any; // This must be a `var` and not a `let / const`
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}



//script to connect to MongoDB
export const ConnectToDB= async()=>{
    if (!process.env.DB_CONNECTION_STRING) {
        throw new Error("DB_CONNECTION_STRING is not defined");
    }
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise){
        const opts={
            bufferCommands: false,};
        cached.promise=mongoose.connect(process.env.DB_CONNECTION_STRING!);
        return mongoose;
    }
    try{
        cached.conn=await cached.promise;}
        catch(e){
            cached.promise=null;
            throw e;
        }
    return cached.conn;



/*
    try{
    await mongoose.connect(process.env.DB_CONNECTION_STRING!);
    console.log("connection successful");
}catch(err){
    console.log(err);
}
    */
    
}

//script to close the connection
export const CloseConnection=async()=>{
    try{
        await mongoose.connection.close();
        console.log("connection closed");
    }catch(err){
        console.log(err);
    }
}


export const getPostById=async(id: string)=>{
        await ConnectToDB();
        const post = await Post.findById(id);
        // returns the post while turning the date into a String
        //if the post cannot be found, then return null
            return post ? {
        ...post.toObject(),
        date: post.date instanceof Date ? post.date.toISOString() : String(post.date)
    } : null;
    }
