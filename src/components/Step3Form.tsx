"use client";

import { useFormData } from "@/context/FormContext";
import { Step3Schema } from "@/lib/formSchema";
import { useState } from "react";
import { set, z } from "zod";
import { useRouter } from "next/navigation";
import { SubmissionLayout } from "./SubmissionLayout";
import Link from "next/link";
import { categories, titles } from "@/constants/formConstants";
import FormInput from "./FormInput";
import { Header } from "./Header";

export const Step3Form = () => {
  const router = useRouter();
  const { data, updateField, resetForm } = useFormData();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate Step 1 fields only
      console.log(data);
      Step3Schema.parse({
        category: data.category,
        missionResonance: data.missionResonance,
        missionRelation: data.missionRelation,
        articleFile: data.articleFile,
        signature: data.signature,
        questions: data.questions,
      });
      setErrors({});
      setIsSubmitted(true);

      // Redirect to home page after 3 seconds
      setTimeout(() => {
        router.push("/");
      }, 3000);

      resetForm();

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

  if (!isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-3">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="mb-6">
            <svg 
              className="w-16 h-16 text-green-500 mx-auto" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Thank You for Submitting!
          </h2>
          <p className="text-gray-600 mb-2">
            Your submission has been received and is under review.
          </p>
          <p className="text-gray-600 mb-6">
            We will connect with you shortly.
          </p>
          <div className="text-sm text-gray-500">
            <p>Redirecting to home page...</p>
          </div>
        </div>
      </div>
    );
  }

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
            error={errors.category}
          />

          {/* Idea Description */}
          <FormInput
            type="text"
            placeholder="Your Answer"
            formDataAttr="missionResonance"
            required
            title={titles.missionResonance}
            error={errors.missionResonance}
          />

          {/* Mission Relation */}
          <FormInput
            type="text"
            placeholder="Your Answer"
            formDataAttr="missionRelation"
            required
            title={titles.missionRelation}
            error={errors.missionRelation}
          />

          {/* Article File */}
          <FormInput
            type="file"
            placeholder="Your Answer"
            formDataAttr="articleFile"
            title={titles.articleFile}
            error={errors.articleFile}
          />

          {/* Signature */}
          <FormInput
            type="text"
            placeholder="Your Answer"
            formDataAttr="signature"
            required
            title={titles.signature}
            error={errors.signature}
          />

          {/* Questions */}
          <FormInput
            type="text"
            placeholder="Your Answer"
            formDataAttr="questions"
            title={titles.questions}
            error={errors.questions}
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
