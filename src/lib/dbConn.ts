import mongoose from "mongoose";
import dotenv from "dotenv";
import Post from "@/models/Post";
dotenv.config();
//the global mongoose variable to cache
declare global {
  var mongoose: any; // This must be a `var` and not a `let / const`
}

//to store the cached mongoose variable
let cached = global.mongoose;
//initialize the cached mongoose variable if needed
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

//script to connect to MongoDB
export const ConnectToDB = async () => {
  //check for empty DB string
  if (!process.env.DB_CONNECTION_STRING) {
    throw new Error("DB_CONNECTION_STRING is not defined");
  }
  //check if the connection is already established
  if (cached.conn) {
    return cached.conn;
  }
  //if the promise for the connection hasnt been created, then create it
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.DB_CONNECTION_STRING!);
    return mongoose;
  }
  //if the promise for the connection has been created, then wait for it
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
};

//script to close the connection
export const CloseConnection = async () => {
  try {
    await mongoose.connection.close();
    console.log("connection closed");
  } catch (err) {
    console.log(err);
  }
};

export const getPostById = async (id: string) => {
  await ConnectToDB();
  const post = await Post.findById(id);
  // returns the post while turning the date into a String
  //if the post cannot be found, then return null
  return post
    ? {
        ...post.toObject(),
        date:
          post.date instanceof Date
            ? post.date.toISOString()
            : String(post.date),
      }
    : null;
};
