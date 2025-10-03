import mongoose from "mongoose";
//Schema for Posts
const PostSchema=new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  email: { type: String },
  date: { type: Date, default: Date.now },
  submissionType: {
    type: String,
    enum: ["pitch", "draft"],
    required: [true, "Submission type is required"]
  },
  ideaDescription: { type: String, required: [true, "Idea description is required"] },
  motivation: { type: String, required: [true, "Motivation is required"] },
  draftFile: { type: mongoose.Schema.Types.Mixed }, // Optional by default
  category: {
    type: String,
    enum: ["academic", "youth", "creative", "advocacy", "community"],
    required: [true, "Category is required"]
  },
  missionResonance: { type: String, required: [true, "Mission resonance is required"] },
  missionRelation: { type: String, required: [true, "Mission relation is required"] },
  articleFile: { type: mongoose.Schema.Types.Mixed, required: true },
  signature: { type: String, required: [true, "Signature is required"] },
  questions: { type: String } // Optional
});

//to create a model without any duplicate error
const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);
export default Post