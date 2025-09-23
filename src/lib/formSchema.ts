import * as z from "zod";

export const FormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email").optional(),
  submissionType: z.enum(["pitch", "draft"], "Submission type is required"),
  ideaDescription: z.string().min(1, "Idea description is required"),
  motivation: z.string().min(1, "Motivation is required"),
  draftFile: z.any().optional(), 
  category: z.enum(["academic", "youth", "creative", "advocacy", "community"], "Category is required"),
  missionResonance: z.string().min(1, "Mission resonance is required"),
  missionRelation: z.string().min(1, "Mission relation is required"),
  articleFile: z.any(), 
  signature: z.string().min(1, "Signature is required"),
  questions: z.string().optional(),
});

// Schema for Step 1 of the form
export const Step1Schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  submissionType: z.enum(["pitch", "draft"], "Submission type is required"),
});

export const Step2Schema = z.object({
  ideaDescription: z.string().min(1, "Idea description is required"),
  motivation: z.string().min(1, "Motivation is required"),
  draftFile: z.any().optional(), 
})

export const Step3Schema = z.object({
  category: z.enum(["academic", "youth", "creative", "advocacy", "community"], "Category is required"),
  missionResonance: z.string().min(1, "Mission resonance is required"),
  missionRelation: z.string().min(1, "Mission relation is required"),
  articleFile: z.any(), 
  signature: z.string().min(1, "Signature is required"),
  questions: z.string().optional(),
})


// create a TypeScript type from the schema
export type FormDataType = z.infer<typeof FormSchema>;
