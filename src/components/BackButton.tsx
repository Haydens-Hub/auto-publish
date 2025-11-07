"use client";

import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/overview")}
      className="text-sm/6 cursor-pointer font-semibold text-gray-900"
    >
      Back
    </button>
  );
}
