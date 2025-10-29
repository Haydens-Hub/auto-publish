
"use client";
import {useState} from "react";
interface DownloadArticleProps{
    id:string;
    filetype:string;
}


export function DownloadArticle({id,filetype}:DownloadArticleProps){
  const [loading, setLoading] = useState(false);
  const [error,setError]=useState<string | null>(null);

  
  /* <DownloadArticle id={post._id.toString()} filetype="articleFile" />*/
  
  const downloadFile=async()=>{
        setLoading(true);
        setError(null);
        try{
          const res=await fetch(`/api/Posts/${id}/${filetype}`)
          if (!res.ok){
            throw new Error(`Download failed: ${res.statusText}`);
          }

          const blob=await res.blob();

          const url=window.URL.createObjectURL(blob);
          const a=document.createElement("a");
          a.href=url;
          a.download="article-file";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }catch(error){
          setError((error as Error).message);
        }finally{
          setLoading(false);



        }

    }    


    return(
<button className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
  <a
    onClick={downloadFile}
    className="text-blue-600 hover:underline"
  >
    Download Article File
  </a>
</button>

    )
}