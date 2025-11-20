"use client";

import React from "react";
import { useRouter } from "next/navigation";

export function PublishPostButton({ id }: { id: string }) {
  const router = useRouter();

  const removePost = async () => {
    const res = await fetch(`/api/Posts/${id}/publish`, { method: "POST" });
    if (res.ok) {
      console.log("Post published successfully");
    }
  };

  return (
    <button
      onClick={removePost}
      className="rounded-md cursor-pointer bg-[#5D8DCD] px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
    >
      Create Draft
    </button>
  );
}
