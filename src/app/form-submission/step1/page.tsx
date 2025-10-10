"use client";

import { Step1Form } from "@/components/Step1Form";
import Image from "next/image";

const page = () => {
  return (
    <div className="bg-[#5D8DCD] w-full min-h-screen px-8 md:px-40 py-8 flex flex-col gap-6 items-center justify-center">
      <Image
        src="/images/child_with_colors.jpg"
        alt="Child playing with colors"
        width={900}
        height={70}
        className="rounded-2xl"
      />
      <Step1Form />
    </div>
  );
};

export default page;
