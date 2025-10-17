// Import your schemas here
import type { Connection } from "mongoose";
import Post from "../models/Post";
import dotenv from "dotenv";
dotenv.config();

// Simulate a PDF buffer for articleFile
const samplePdfBuffer = Buffer.from("%PDF-1.4\n%...", "utf-8"); // Dummy PDF header as a placeholder

const dummy = {
  name: "lorem ipsum",
  email: "lorem@ipsum.com",
  submissionType: "pitch",
  ideaDescription: "lorem ipsum",
  motivation: "lorem ipsum",
  draftFile: "lorem ipsum",
  category: "academic",
  missionResonance: "lorem ipsum",
  missionRelation: "lorem ipsum",
  articleFile: samplePdfBuffer, // PDF buffer!
  signature: "lorem ipsum",
  questions: "lorem ipsum",
};

export async function up(connection: Connection): Promise<void> {
  const post = connection.model("Post", Post.schema);
  await post.create(dummy);
}

export async function down(connection: Connection): Promise<void> {
  const post = connection.model("Post", Post.schema);
  await post.deleteOne({
    email: dummy.email,
    name: dummy.name,
    signature: dummy.signature,
  });
}
