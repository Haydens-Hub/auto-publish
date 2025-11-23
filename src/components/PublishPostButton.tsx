"use client";

import React, { useState } from "react";

export function PublishPostButton({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const removePost = async () => {
    setIsLoading(true)

    const res = await fetch(`/api/Posts/${id}/publish`, { method: "POST" });
    if (res.ok) {
      console.log("Post successfully created!")
    }
    setIsLoading(false)
  };

  return (
    <button
      onClick={removePost}
      disabled={isLoading}
      className="rounded-md cursor-pointer bg-[#5D8DCD] px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Create Post
    </button>
  );
}
