"use client";

import { useFormData } from "@/context/FormContext";
import { Step3Schema } from "@/lib/formSchema";
import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { SubmissionLayout } from "./SubmissionLayout";
import Link from "next/link";
import { categories, titles } from "@/constants/formConstants";
import FormInput from "./FormInput";
import { Header } from "./Header";

export const Step3Form = () => {
  const router = useRouter();
  const { data, updateField } = useFormData();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate Step 1 fields only
      console.log(data);
      Step3Schema.parse({
        ideaDescription: data.ideaDescription,
        motivation: data.motivation,
        submissionType: data.submissionType,
      });
      setErrors({});

      //TODO: Add backend logic to send the submission to admin panel
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
        router.push("/form-submission/step2");
      }}
    >
      <div className="border-b border-gray-900/10 pb-12">
        <Header/>

        {/* Step 3 Inputs */}
        <div className="flex flex-col justify-start items-start gap-2 mt-8 w-full max-w-2xl mx-auto">
          <div className="border-t-8 flex w-full justify-center items-center shadow-md border-red-500 rounded-lg py-2 px-3">
            <p className="font-semibold text-[#3F493D]">
              Learn more about our submission process{" "}
              <Link
                href="https://docs.google.com/document/d/1X3bqkViAucD2TG4gOeIHJ-RjENp5OH9BM34fYZMuF9Q/edit?tab=t.0"
                className="text-blue-600 underline"
              >
                here
              </Link>
            </p>
          </div>

          {/* Category */}

          <FormInput
            type="radio"
            formDataAttr="category"
            title="What category is your submission?"
            required
            options={categories}
          />

          {/* Idea Description */}
          <FormInput
            type="text"
            placeholder="Your Answer"
            formDataAttr="missionResonance"
            required
            title={titles.missionResonance}
          />

          {/* Mission Relation */}
          <FormInput
            type="text"
            placeholder="Your Answer"
            formDataAttr="missionRelation"
            required
            title={titles.missionRelation}
          />

          {/* Article File */}
          <FormInput
            type="file"
            placeholder="Your Answer"
            formDataAttr="articleFile"
            title={titles.articleFile}
          />

          {/* Signature */}
          <FormInput
            type="text"
            placeholder="Your Answer"
            formDataAttr="signature"
            required
            title={titles.signature}
          />

          {/* Questions */}
          <FormInput
            type="text"
            placeholder="Your Answer"
            formDataAttr="questions"
            title={titles.questions}
          />

          <div className="flex flex-col gap-4 mt-8 text-md mb">
            <p>Thank you for submitting!</p>
            <p className="text-sm">
              We will connect with you shortly. Please contact{" "}
              <a
                href="mailto:research.haydenshub@gmail.com"
                className="text-blue-600 underline"
              >
                research.haydenshub@gmail.com
              </a>{" "}
              for any questions.
            </p>
          </div>
        </div>
      </div>
    </SubmissionLayout>
  );
};
