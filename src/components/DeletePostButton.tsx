"use client";

import React from "react";
import { useRouter } from "next/navigation";

export function DeletePostButton({ id }: { id: string }) {
  const router = useRouter();

  const removePost = async () => {
    const res = await fetch(`/api/Posts/${id}`, { method: "DELETE" });
    if (res.ok) {
      console.log("Post deleted successfully");
      router.push("/overview");
    }
  };

  return (
    <button
      onClick={removePost}
      className="rounded-md cursor-pointer bg-[#DF3F29] px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
    >
      Delete
    </button>
  );
}
