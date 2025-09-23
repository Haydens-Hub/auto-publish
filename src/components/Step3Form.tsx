"use client";

import { useFormData } from "@/context/FormContext";
import { Step3Schema } from "@/lib/formSchema";
import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { SubmissionLayout } from "./SubmissionLayout";
import Link from "next/link";

export const Step3Form = () => {
  const router = useRouter();
  const { data, updateField } = useFormData();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate Step 1 fields only
      Step3Schema.parse({
        ideaDescription: data.ideaDescription,
        motivation: data.motivation,
        submissionType: data.submissionType,
      });
      setErrors({});
      // Proceed to next step
      router.push("/form-submission/step3");
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <SubmissionLayout onSubmit={handleSubmit} onCancel={() => {}}>
      <div className="border-b border-gray-900/10 pb-12">
        <div className="flex flex-col justify-center items-center gap-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Hayden&apos;s Journal- Submissions
          </h2>
        </div>

        {/* Step 3 Inputs */}
        <div className="flex flex-col justify-start items-start gap-2 mt-8 w-full max-w-2xl mx-auto">
          <div className="border-t-8 flex w-full justify-center items-center shadow-md border-red-500 rounded-lg py-2 px-3">
            <p className="font-semibold text-[#3F493D]">
              Learn more about our submission process <Link href='https://docs.google.com/document/d/1X3bqkViAucD2TG4gOeIHJ-RjENp5OH9BM34fYZMuF9Q/edit?tab=t.0' className="text-blue-600 underline">here</Link>
            </p>
          </div>

          {/* Idea Description */}
          
          <div className="flex flex-col gap-2 mt-8">
            <label className="flex flex-row font-semibold mt-10">
                What category is your submission?<p className="text-red-500">*</p>
            </label>
            <p>
                Learn more about our submission categories <Link href='https://docs.google.com/document/d/1X3bqkViAucD2TG4gOeIHJ-RjENp5OH9BM34fYZMuF9Q/edit?tab=t.0' className="text-blue-600 underline">here</Link>
            </p>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="category"
                value="academic"
                checked={data.category === "academic"}
                onChange={() => updateField("category", "academic")}
              />
              Academic Article
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="category"
                value="youth"
                checked={data.category === "youth"}
                onChange={() => updateField("category", "youth")}
              />
              Youth voices
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="category"
                value="creative"
                checked={data.category === "creative"}
                onChange={() => updateField("category", "creative")}
              />
              Creative
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="category"
                value="advocacy"
                checked={data.category === "advocacy"}
                onChange={() => updateField("category", "advocacy")}
              />
              Advocacy
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="category"
                value="community"
                checked={data.category === "community"}
                onChange={() => updateField("category", "community")}
              />
              Community Spotlight
            </label>
          </div>

          {/* Motivation */}
          <label className="flex flex-row font-medium mt-8">
           Why does the mission of Hayden&apos;s Hub resonate with you? Tell us about yourself and your motivation to share your work. <p className="text-red-500">*</p>
          </label>
          <input
            type="text"
            placeholder="Your answer"
            value={data.missionResonance}
            onChange={(e) => updateField("missionResonance", e.target.value)}
            className="rounded-md border-t-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 w-full px-3 py-2"
          />
          
          <label className="flex flex-row font-medium mt-8">
           Briefly explain how your article relates to the Hayden&apos;s Hub mission.<p className="text-red-500">*</p>
          </label>
          <input
            type="text"
            placeholder="Your answer"
            value={data.missionRelation}
            onChange={(e) => updateField("missionRelation", e.target.value)}
            className="rounded-md border-t-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 w-full px-3 py-2"
          />

          {/* Draft File */}
          <div className="flex flex-col gap-2 mt-8">
            <label className="flex flex-col font-semibold">
              Attach your article draft
              <p className="text-sm font-medium text-gray-400 pl-1 mt-3">Up to 5 files supported, Max 100 MB per file</p>
            </label>
            <input
              type="file"
              onChange={(e) => updateField("articleFile", e.target.value)}
              className="block w-full text-sm cursor-pointer text-gray-600
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-lg file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-[#5D8DCD] file:text-white
                                    hover:file:bg-[#466c9e]
                                    border border-gray-300 rounded-lg shadow-sm
                                    focus:outline-none focus:ring-2 focus:ring-[#5D8DCD] focus:[#5D8DCD]"
            />
          </div>
          <label className="flex flex-row font-medium mt-8">
            By signing your name along with the date, you are hereby agreeing to the &apos;Hayden&apos;s Journal- Privacy & Disclosure Agreement&apos;.</label>
          <input
            type="text"
            placeholder="Your answer"
            value={data.signature}
            onChange={(e) => updateField("signature", e.target.value)}
            className="rounded-md border-t-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 w-full px-3 py-2"
          />

          <label className="flex flex-row font-medium mt-8">
            Do you have any questions or concerns?</label>
          <input
            type="text"
            placeholder="Your answer"
            value={data.questions}
            onChange={(e) => updateField("questions", e.target.value)}
            className="rounded-md border-t-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 w-full px-3 py-2"
          />

          <div className="flex flex-col gap-4 mt-8 text-md mb">
            <p>
                Thank you for submitting!
            </p>
            <p className="text-sm">
                We will connect with you shortly. Please contact <a href='mailto:research.haydenshub@gmail.com' className="text-blue-600 underline">research.haydenshub@gmail.com</a> for any questions. 
            </p>
          </div>
        </div>
      </div>
    </SubmissionLayout>
  );
};
