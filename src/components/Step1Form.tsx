"use client"

import { useFormData } from "@/context/FormContext"
import Link from "next/link"
import { Step1Schema } from "@/lib/formSchema"
import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";

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
      console.log("Reachig function!")
      router.push('/form-submission/step2')

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
    <form onSubmit={handleSubmit} className="p-12 mx-12 flex flex-col rounded-2xl bg-[#EFEBEB] shadow-2xl shadow-[#E6CFB8] w-full">
        <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">

                <div className="flex flex-col justify-left items-center gap-6">
                    <h1 className="text-4xl text-[#60bae0] font-extrabold">Hayden&apos;s Journal- Submissions</h1>
                    <p className="font-semibold text-[#3F493D]">Hayden’s Hub is an organization focused on social prescribing, community building, and collective care for youth with neurodevelopmental disabilities (NDDs).</p>
                    <p className="font-semibold text-[#3F493D]">The Hayden’s Hub Journal is our digital publication space. It exists to amplify the voices of youth, caregivers, researchers, artists, and advocates. Through academic essays, personal narratives, poetry, and more, the platform explores themes like neurodiversity, mental health, caregiving, accessibility, and social prescribing.</p>
                    <p className="font-semibold text-[#3F493D]">Whether it&apos;s a literature review on social prescribing, a photo essay from a mutual aid group, or a poem about navigating life as a caregiver— we invite contributors to think critically, feel deeply, and imagine otherwise.</p>
                    <Link 
                    className="text-blue-600 underline"
                    href='https://docs.google.com/document/d/1X3bqkViAucD2TG4gOeIHJ-RjENp5OH9BM34fYZMuF9Q/edit?tab=t.0'>
                        Our submission guidelines can be found here!
                    </Link>
                </div>

                {/* Step 1 Inputs */}
                <div className="flex flex-col justify-start items-start gap-2 mt-8 w-full max-w-2xl mx-auto">
                    {/* Name */}
                    <label className="flex flex-row font-semibold">Name<p className="text-red-500">*</p></label>
                    <input
                    type="text"
                    placeholder="Name"
                    value={data.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="rounded-md border-t-2 border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 w-full px-3 py-2"
                    />

                    {/* Email */}
                    <label className="flex flex-row font-semibold mt-8">Email<p className="text-red-500">*</p></label>
                    <input
                    type="email"
                    placeholder="Email"
                    value={data.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="rounded-md border-t-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 w-full px-3 py-2"
                    />

                    {/* Submission Type */}
                    <div className="flex flex-col gap-2 mt-8">
                    <label className="flex flex-row font-semibold">Submission Type<p className="text-red-500">*</p></label>
                    <label className="flex items-center gap-2">
                        <input
                        type="radio"
                        name="submissionType"
                        value="pitch"
                        checked={data.submissionType === "pitch"}
                        onChange={() => updateField("submissionType", "pitch")}
                        />
                        I would like to submit a pitch for an idea
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                        type="radio"
                        name="submissionType"
                        value="draft"
                        checked={data.submissionType === "draft"}
                        onChange={() => updateField("submissionType", "draft")}
                        />
                        I would like to submit my completed draft
                    </label>
                </div>
                
                </div>

            </div>
        </div> 

        <div className="mt-6 flex items-center justify-end gap-x-6">
            <button type="button" className="text-sm/6 font-semibold text-gray-900">
            Cancel
            </button>
            <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
            Next
            </button>
        </div>
    </form>
  )
}
