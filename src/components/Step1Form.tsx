"use client";

import { useFormData } from "@/context/FormContext";
import Link from "next/link";
import { Step1Schema } from "@/lib/formSchema";
import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { SubmissionLayout } from "./SubmissionLayout";
import FormInput from "./FormInput";
import { submissionCats, titles } from "@/constants/formConstants";

export const Step1Form = () => {
  const router = useRouter();
  const { data, updateField } = useFormData();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate Step 1 fields only
      Step1Schema.parse({
        name: data.name,
        email: data.email,
        submissionType: data.submissionType,
      });
      setErrors({});
      // Proceed to next step
      console.log("Reaching function!");
      router.push("/form-submission/step2");
    } catch (err) {
      console.error(err);
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
          <div className="flex flex-col gap-8 text-lg mb">
            <p>
              Hayden’s Hub is an organization focused on social prescribing,
              community building, and collective care for youth with
              neurodevelopmental disabilities (NDDs).
            </p>
            <p>
              The Hayden’s Hub Journal is our digital publication space. It
              exists to amplify the voices of youth, caregivers, researchers,
              artists, and advocates. Through academic essays, personal
              narratives, poetry, and more, the platform explores themes like
              neurodiversity, mental health, caregiving, accessibility, and
              social prescribing.
            </p>
            <p>
              Whether it&apos;s a literature review on social prescribing, a
              photo essay from a mutual aid group, or a poem about navigating
              life as a caregiver— we invite contributors to think critically,
              feel deeply, and imagine otherwise.
            </p>
            <Link
              className="text-blue-600 underline"
              href="https://docs.google.com/document/d/1X3bqkViAucD2TG4gOeIHJ-RjENp5OH9BM34fYZMuF9Q/edit?tab=t.0"
            >
              Our submission guidelines can be found here!
            </Link>
          </div>
        </div>

        {/* Step 1 Inputs */}
        <div className="flex flex-col justify-start items-start gap-2 mt-8 w-full max-w-2xl mx-auto">
          {/* Name */}
          <FormInput
            type="text"
            placeholder="Name"
            formDataAttr="name"
            title={titles.name}
          />

          {/* Email */}
          <FormInput
            type="email"
            placeholder="Email"
            formDataAttr="email"
            title={titles.email}
          />

          {/* Submission Type */}
          <FormInput
            type="radio"
            formDataAttr="submissionType"
            title="What category is your submission?"
            options={submissionCats}
          />
        </div>
      </div>
    </SubmissionLayout>
  );
};
