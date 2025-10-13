import { FormEvent, ReactNode, FunctionComponent } from "react";

interface FormProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  children: ReactNode;
}

export const SubmissionLayout: FunctionComponent<FormProps> = ({
  onSubmit,
  children,
  onCancel,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="max-w-3xl p-12 mx-12 flex text-lg md:text-lg flex-col rounded-2xl text-[#3F493D] bg-[#EFEBEB] w-full shadow-2xl shadow-[#E6CFB8]"
    >
      <div className="space-y-12">{children}</div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm/6 cursor-pointer font-semibold text-gray-900"
          onClick={onCancel}
        >
          Back
        </button>
        <button
          type="submit"
          className="rounded-md cursor-pointer bg-[#DF3F29] px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
        >
          Next
        </button>
      </div>
    </form>
  );
};
