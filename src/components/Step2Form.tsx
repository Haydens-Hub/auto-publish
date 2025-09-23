"use client";

import { useFormData } from "@/context/FormContext";
import { Step2Schema } from "@/lib/formSchema";
import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { SubmissionLayout } from "./SubmissionLayout";
import Link from "next/link";
import FormInput from "./FormInput";
import { titles } from "@/constants/formConstants";

export const Step2Form = () => {
  const router = useRouter();
  const { data, updateField } = useFormData();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log(data);
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
    <SubmissionLayout
      onSubmit={handleSubmit}
      onCancel={() => {
        router.push("/form-submission/step1");
      }}
    >
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
          <FormInput
            type="text"
            placeholder="Your Answer"
            formDataAttr="ideaDescription"
            required
            title={titles.ideaDescription}
          />

          {/* Motivation */}
          <FormInput
            type="text"
            placeholder="Your Answer"
            formDataAttr="motivation"
            required
            title={titles.motivation}
          />

          {/* Draft File */}
          <FormInput
            type="file"
            formDataAttr="draftFile"
            title={titles.draftFile}
          />

          <div className="flex flex-col gap-4 mt-8 text-md mb">
            <p>
              Thank you for submitting your idea! A team member will connect
              with you and set up a meeting to further discuss.
            </p>
            <p className="text-sm">
              Feel free to email{" "}
              <a
                href="mailto:research.haydenshub@gmail.com"
                className="text-blue-600 underline"
              >
                research.haydenshub@gmail.com
              </a>{" "}
              for any questions or concerns.
            </p>
          </div>
        </div>
      </div>
    </SubmissionLayout>
  );
};
