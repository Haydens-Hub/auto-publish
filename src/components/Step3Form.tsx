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
import ThankYou from "./ThankYou";

export const Step3Form = () => {
  const router = useRouter();
  const { data, resetForm } = useFormData();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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

      await fetch("/api/contentful/publish", {
        // Adjust endpoint as needed
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          submissionType: data.submissionType,
          ideaDescription: data.ideaDescription,
          motivation: data.motivation,
          draftFile: data.draftFile,
          category: data.category,
          missionResonance: data.missionResonance,
          missionRelation: data.missionRelation,
          articleFile: data.articleFile,
          signature: data.signature,
          questions: data.questions,
        }),
      });

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

  if (isSubmitted) {
    return <ThankYou />;
  }

  return (
    <SubmissionLayout
      onSubmit={handleSubmit}
      onCancel={() => {
        router.push("/form-submission/step2");
      }}
    >
      <div className="border-b border-gray-900/10 pb-12">
        <Header />

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
