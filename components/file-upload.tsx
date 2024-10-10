// "use client";
// import { X } from "lucide-react";
// import Image from "next/image";
// import {UploadDropzone} from "@/lib/uploadthing";
// import {ClientUploadedFileData} from "uploadthing/types";
// import {Simulate} from "react-dom/test-utils";
// import error = Simulate.error;

// interface FileUploadProps{
//     onChange:(url?:string)=>void;
//     value: string;
//     endpoint:"messageFile" | "serverImage";
// }
// export const FileUpload=({onChange,value,endpoint}:FileUploadProps)=>{

//     const fileType = value?.split(".").pop();
//     if (value && fileType !== "pdf"){
//         return (
//             <div className="relative h-20 w-20">
//                 <Image
//                     fill
//                     src={value}
//                     alt="Upload"
//                     className="rounded-full"
//                 />
//                 <button onClick={() => onChange("")}
//                 className="bg-rose-500 text-white p-1 rounded-full absolute top-o right-0 shadow-sm"
//                 type="button"
//                 >
//                     <X className="h-4 w-4"/>
//                 </button>
//             </div>
//         )
//     }

//     return(
//         <UploadDropzone endpoint={endpoint}  onClientUploadComplete={(res)=>{
//             onChange(res?.[0].url);
//         }}
//         onUploadError={(error:Error)=>{
//             console.log(error)
//         }}
//         >

//         </UploadDropzone>
//     )
// }

// "use client";
// import { useEffect, useState } from "react";
// import { X } from "lucide-react";
// import Image from "next/image";
// import { UploadDropzone } from "@/lib/uploadthing";
// import { ClientUploadedFileData } from "uploadthing/types";

// interface FileUploadProps {
//   onChange: (url?: string) => void;
//   value: string;
//   endpoint: "messageFile" | "serverImage";
// }

// export const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true); // Bu, bileşenin sadece istemci tarafında çalıştığından emin olmanızı sağlar.
//   }, []);

//   const fileType = value?.split(".").pop();
  
//   // SSR sırasında boş bir div döndür
//   if (!isClient) {
//     return <div></div>;
//   }

//   if (value && fileType !== "pdf") {
//     return (
//       <div className="relative h-20 w-20">
//         <Image
//           fill
//           src={value}
//           alt="Upload"
//           className="rounded-full"
//         />
//         <button
//           onClick={() => onChange("")}
//           className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
//           type="button"
//         >
//           <X className="h-4 w-4" />
//         </button>
//       </div>
//     );
//   }

//   return (
//     <UploadDropzone
//       endpoint={endpoint}
//       onClientUploadComplete={(res) => {
//         if (res && res.length > 0 && res[0].url) {
//           onChange(res[0].url);
//         } else {
//           onChange("");
//         }
//       }}
//       onUploadError={(error: Error) => {
//         console.log(error);
//       }}
//     />
//   );
// };



"use client";
import { useEffect, useState } from "react";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";
import { ClientUploadedFileData } from "uploadthing/types";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
}

export const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
  const [isClient, setIsClient] = useState(false);
  const [fileType, setFileType] = useState<string | undefined>(undefined);

  useEffect(() => {
    setIsClient(true); // Bu, bileşenin sadece istemci tarafında çalıştığından emin olmanızı sağlar.
  }, []);

  // Ek loglar
  console.log("Current value:", value); // value değişkeninin içeriğini yazdır
  console.log("Calculated fileType:", fileType); // fileType sonucunu yazdır

  // SSR sırasında boş bir div döndür
  if (!isClient) {
    return <div></div>;
  }

  // value değişkeni boşsa veya "pdf" değilse
  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image
          fill
          src={value}
          alt="Upload"
          className="rounded-full"
        />
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // PDF dosyası varsa render et
  if (value && fileType === "pdf") {
    console.log("PDF dosyası render ediliyor..."); // PDF render logu
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a href={value} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline">
          {value}
        </a>
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        if (res && res.length > 0 && res[0].url) {
          const uploadedFileName = res[0].name; // Yüklenen dosyanın adı
          const uploadedFileType = uploadedFileName.split(".").pop()?.toLowerCase(); // Dosya uzantısını al
          
          // MIME türünü belirlemek için dosya uzantısını kullan
          const mimeType = uploadedFileType === "pdf" ? "pdf" : "image"; // Uzantıya göre türü ayarla
          
          console.log("Yüklenen dosyanın tipi:", uploadedFileType); // Dosya tipi logu
          console.log("Yüklenen dosyanın URL'si:", res[0].url); // URL logu

          setFileType(mimeType); // Dosya türünü state'e ata
          onChange(res[0].url); // URL'yi state'e ata
        } else {
          onChange("");
        }
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
};
