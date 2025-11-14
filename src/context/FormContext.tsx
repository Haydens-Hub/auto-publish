"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of your form data
type FormData = {
  name: string;
  email: string;
  submissionType: "pitch" | "draft" | ""; // radio/select
  ideaDescription: string;
  motivation: string;
  draftFile: File | null; // optional file upload
  category: "academic" | "youth" | "creative" | "advocacy" | "community" | "";
  missionResonance: string;
  missionRelation: string;
  articleFile: File | null;
  references: string;
  abstract: string;
  shortblurb: string;
  signature: string;
  questions: string;
};

// Define the context type
type FormContextType = {
  data: FormData;
  updateField: (field: keyof FormData, value: unknown) => void;
  resetForm: () => void;
};

// Create the context
const FormContext = createContext<FormContextType | undefined>(undefined);

// Provider component
export function FormProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<FormData>({
    name: "",
    email: "",
    submissionType: "",
    ideaDescription: "",
    motivation: "",
    draftFile: null,
    category: "",
    missionResonance: "",
    missionRelation: "",
    articleFile: null,
    references: "",
    abstract: "",
    shortblurb: "",
    signature: "",
    questions: "",
  });

  const updateField = (field: keyof FormData, value: unknown) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setData({
      name: "",
      email: "",
      submissionType: "",
      ideaDescription: "",
      motivation: "",
      draftFile: null,
      category: "",
      missionResonance: "",
      missionRelation: "",
      articleFile: null,
      references: "",
      abstract: "",
      shortblurb: "",
      signature: "",
      questions: "",
    });
  };

  return (
    <FormContext.Provider value={{ data, updateField, resetForm }}>
      {children}
    </FormContext.Provider>
  );
}

// Hook for consuming
export function useFormData() {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("useFormData must be used inside FormProvider");
  return ctx;
}
