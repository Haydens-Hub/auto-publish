import { useFormData } from "@/context/FormContext";
import React from "react";

type FormInputProps = {
  type: "text" | "email" | "file" | "radio";
  formDataAttr: string;
  title: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  error?: string;
};

const FormInput = ({
  type,
  formDataAttr,
  title,
  placeholder,
  options,
  required,
  error
}: FormInputProps) => {
  const { data, updateField } = useFormData();

  if (type == "text" || type == "email") {
    return (
      <div className="flex flex-col gap-2 my-6 w-full">
        <label className="flex flex-row text-lg font-semibold">
          {title}
          {required && <p className="text-red-500">*</p>}
        </label>
        <input
          type={type}
          placeholder={placeholder}
          value={data[formDataAttr as keyof typeof data] as string}
          onChange={(e) =>
            updateField(formDataAttr as keyof typeof data, e.target.value)
          }
          className="rounded-md border-t-2 border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 w-full px-3 py-2"
        />
        {error && <p className="text-red-500">{error}</p>}
      </div>
    );
  } else if (type == "file") {
    return (
      <div className="flex flex-col gap-2 mt-8">
        <label className="flex flex-row font-semibold">{title}</label>
        <input
          type="file"
          onChange={(e) =>
            updateField(formDataAttr as keyof typeof data, e.target.value)
          }
          className="block w-full text-sm cursor-pointer text-gray-600
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-lg file:border-0
                                file:text-sm file:font-semibold
                                file:bg-[#5D8DCD] file:text-white
                                hover:file:bg-[#466c9e]
                                border border-gray-300 rounded-lg shadow-sm
                                focus:outline-none focus:ring-2 focus:ring-[#5D8DCD] focus:[#5D8DCD]"
        />
        {error && <p className="text-red-500">This is a required question</p>}
      </div>
    );
  } else if (type === "radio" && options) {
    return (
      <div className="flex flex-col gap-2 mt-8">
        <label className="flex flex-row font-semibold">
          {title}
          {required && <p className="text-red-500">*</p>}
        </label>

        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2">
            <input
              type="radio"
              name={formDataAttr}
              value={opt.value}
              checked={data[formDataAttr as keyof typeof data] === opt.value}
              onChange={() =>
                updateField(formDataAttr as keyof typeof data, opt.value)
              }
            />
            {opt.label}
          </label>
        ))}
        {error && <p className="text-red-500">This is a required question</p>}
      </div>
    );
  }

  return <div></div>;
};

export default FormInput;
