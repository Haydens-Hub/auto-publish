"use client";
import { useState } from "react";

interface DownloadArticleProps {
  id: string;
  filetype: string;
}
// Component to handle downloading article or draft files
export function DownloadArticle({ id, filetype }: DownloadArticleProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  //helper function to download the file
  const downloadFile = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch the file from the API
      const res = await fetch(`/api/Posts/${id}/${filetype}`);
      if (!res.ok) {
        throw new Error(`Download failed: ${res.statusText}`);
      }
      //create blob, and start download with a.click();
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // name the downloaded file based on filetype
      a.download = filetype === "draftFile" ? "draft-file" : "article-file";
      document.body.appendChild(a);
      a.click();
      //clean up
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Set the display label based on filetype
  const buttonLabel = filetype === "draftFile" ? "Download Draft File" : "Download Article File";

  return (
    <button
      className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0"
      onClick={downloadFile}
      disabled={loading}
    >
      <span className="text-blue-600 hover:underline">
        {buttonLabel}
      </span>
      {loading && " (Loading...)"}
      {error && <span className="text-red-500 ml-2">{error}</span>}
    </button>
  );
}
