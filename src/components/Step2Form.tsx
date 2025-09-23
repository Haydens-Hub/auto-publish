"use client";

import { useFormData } from "@/context/FormContext";
import { Step2Schema } from "@/lib/formSchema";
import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { SubmissionLayout } from "./SubmissionLayout";
import Link from "next/link";

export const Step2Form = () => {
  const router = useRouter();
  const { data, updateField } = useFormData();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate Step 1 fields only
      Step2Schema.parse({
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

        {/* Step 1 Inputs */}
        <div className="flex flex-col justify-start items-start gap-2 mt-8 w-full max-w-2xl mx-auto">
          <div className="border-t-8 shadow-md border-red-500 rounded-lg py-2 px-3">
            <p className="font-semibold text-[#3F493D]">
              Unsure of what to submit? No worries! Our team will review your
              pitch and meet with you to discuss possible directions you can go
              to submit.
            </p>
          </div>
          {/* Idea Description */}
          <label className="flex flex-row font-semibold mt-10">
            Tell us about your idea! What kind of article are you thinking of
            writing about?<p className="text-red-500">*</p>
          </label>
          <input
            type="text"
            placeholder="Idea Descripiton"
            value={data.ideaDescription}
            onChange={(e) => updateField("ideaDescription", e.target.value)}
            className="rounded-md border-t-2 border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 w-full px-3 py-2"
          />

          {/* Motivation */}
          <label className="flex flex-row font-medium mt-8">
            What is your motivation behind writing for Hayden&apos;s Journal?
            Tell us about your life experiences and how your connection to the
            Hayden&apos;s Hub mission. <p className="text-red-500">*</p>
          </label>
          <input
            type="text"
            placeholder="Motivation"
            value={data.motivation}
            onChange={(e) => updateField("motivation", e.target.value)}
            className="rounded-md border-t-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 w-full px-3 py-2"
          />

          {/* Draft File */}
          <div className="flex flex-col gap-2 mt-8">
            <label className="flex flex-row font-semibold">
              OPTIONAL: Submit your draft (partial, ideas, etc)
            </label>
            <input
              type="file"
              onChange={(e) => updateField("draftFile", e.target.value)}
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
          <div className="flex flex-col gap-4 mt-8 text-md mb">
            <p>
                Thank you for submitting your idea! A team member will connect with you and set up a meeting to further discuss. 
            </p>
            <p className="text-sm">
                Feel free to email <a href='mailto:research.haydenshub@gmail.com' className="text-blue-600 underline">research.haydenshub@gmail.com</a> for any questions or concerns. 
            </p>
          </div>
        </div>
      </div>
    </SubmissionLayout>
  );
};
