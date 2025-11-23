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
import { Header } from "./Header";

export const Step1Form = () => {
  const router = useRouter();
  const { data } = useFormData();
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
        <Header>
          <p>
            Hayden’s Hub is an organization focused on social prescribing,
            community building, and collective care for youth with
            neurodevelopmental disabilities (NDDs).
          </p>
          <p>
            The Hayden’s Hub Journal is our digital publication space. It exists
            to amplify the voices of youth, caregivers, researchers, artists,
            and advocates. Through academic essays, personal narratives, poetry,
            and more, the platform explores themes like neurodiversity, mental
            health, caregiving, accessibility, and social prescribing.
          </p>
          <p>
            Whether it&apos;s a literature review on social prescribing, a photo
            essay from a mutual aid group, or a poem about navigating life as a
            caregiver— we invite contributors to think critically, feel deeply,
            and imagine otherwise.
          </p>
          <Link
            className="text-blue-600 underline"
            href="https://docs.google.com/document/d/1X3bqkViAucD2TG4gOeIHJ-RjENp5OH9BM34fYZMuF9Q/edit?tab=t.0"
          >
            Our submission guidelines can be found here!
          </Link>
        </Header>

        {/* Step 1 Inputs */}
        <div className="flex flex-col justify-start items-start gap-2 mt-8 w-full max-w-2xl mx-auto">
          {/* Name */}
          <FormInput
            type="text"
            placeholder="Name"
            formDataAttr="name"
            required
            title={titles.name}
            error={errors.name}
          />

          {/* Email */}
          <FormInput
            type="email"
            placeholder="Email"
            formDataAttr="email"
            required
            title={titles.email}
            error={errors.email}
          />
          {/* Submission Type */}
          <FormInput
            type="radio"
            formDataAttr="submissionType"
            title="What category is your submission?"
            required
            options={submissionCats}
            error={errors.submissionType}
          />
        </div>
      </div>
    </SubmissionLayout>
  );
};
