"use client";

import React from "react";
import { useRouter } from "next/navigation";

export function DeletePostButton({ id }: { id: string }) {
  const router = useRouter();

  const removePost = async () => {
    const res = await fetch(
      `/api/Posts/${id}`,
      { method: "DELETE" },
    );
    if (res.ok) {
      console.log("Post deleted successfully");
      router.push("/overview");
    }
  };

  return (
    <button
      onClick={removePost}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
    >
      Delete
    </button>
  );
}
