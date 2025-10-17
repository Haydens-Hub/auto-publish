import mongoose from "mongoose";
//Schema for Posts

export interface Posts extends mongoose.Document {
  name: string;
  email: string;
  date: Date;
  submissionType: string;
  ideaDescription: string;
  motivation: string;
  draftFile: any;
  category: string;
  missionResonance: string;
  missionRelation: string;
  articleFile: any;
  signature: string;
  questions: string;
}

const PostSchema = new mongoose.Schema<Posts>({
  name: { type: String, required: [true, "Name is required"] },
  email: { type: String },
  date: { type: Date, default: Date.now },
  submissionType: {
    type: String,
    enum: ["pitch", "draft"],
    required: [true, "Submission type is required"],
  },
  ideaDescription: {
    type: String,
    required: [true, "Idea description is required"],
  },
  motivation: { type: String, required: [true, "Motivation is required"] },
  draftFile: { type: mongoose.Schema.Types.Mixed }, // Optional by default
  category: {
    type: String,
    enum: ["academic", "youth", "creative", "advocacy", "community"],
    required: [true, "Category is required"],
  },
  missionResonance: {
    type: String,
    required: [true, "Mission resonance is required"],
  },
  missionRelation: {
    type: String,
    required: [true, "Mission relation is required"],
  },
  articleFile: { type: mongoose.Schema.Types.Mixed, required: true },
  signature: { type: String, required: [true, "Signature is required"] },
  questions: { type: String }, // Optional
});

//to create a model without any duplicate error
const Post = mongoose.models.Post || mongoose.model<Posts>("Post", PostSchema);
export default Post;
