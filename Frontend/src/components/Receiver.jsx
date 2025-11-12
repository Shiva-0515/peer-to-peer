// // Receiver.jsx
// import React from "react";
// import { Inbox, File } from "lucide-react";

// export default function Receiver({ receivedFiles }) {
//   if (receivedFiles.length === 0) return null;

//   return (
//     <div className="bg-white border rounded-xl p-4 shadow-sm mt-4">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//         <Inbox className="h-6 w-6 mr-2 text-green-600" /> Received Files
//       </h3>

//       <div className="space-y-2">
//         {receivedFiles.map((file, i) => (
//           <div
//             key={i}
//             className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-lg"
//           >
//             <div className="flex items-center">
//               <File className="h-6 w-6 text-green-600 mr-3" />
//               <span className="text-gray-700 text-sm truncate">{file.name}</span>
//             </div>
//             <a
//               href={file.url}
//               download={file.name}
//               className="text-blue-600 hover:underline text-sm font-medium"
//             >
//               Download
//             </a>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, Download, Inbox, Loader2 } from "lucide-react";
import ProgressBar from "./ProgressBar";

export default function Receiver({ receivedFiles }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: () => {},
  });

  // 🎯 Quotes shown while waiting
  const quotes = [
    "Connecting securely to sender...",
    "Waiting for file signal...",
    "Peer-to-peer tunnel initializing...",
    "Preparing to receive magic bits ✨",
    "Ensuring encrypted transfer...",
    "Almost there — your file will appear soon...",
    "Setting up secure handshake...",
    "Listening for incoming data packets...",
  ];

  const [quote, setQuote] = useState(quotes[0]);
  const [fakeProgress, setFakeProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  // 🔁 Rotate quotes every few seconds
  useEffect(() => {
    if (!loading) return;
    const quoteTimer = setInterval(() => {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 4000);
    return () => clearInterval(quoteTimer);
  }, [loading]);

  // 🌀 Fake progress bar animation
  useEffect(() => {
    if (!loading) return;
    const timer = setInterval(() => {
      setFakeProgress((prev) => {
        if (prev >= 95) return prev; // stay near completion until file arrives
        return prev + Math.random() * 5;
      });
    }, 800);
    return () => clearInterval(timer);
  }, [loading]);

  // 🧠 Detect file arrival
  useEffect(() => {
    if (receivedFiles && receivedFiles.length > 0) {
      setLoading(false);
      setFakeProgress(100);
    }
  }, [receivedFiles]);

  // 🧩 No file received yet — show fake loader
  if (loading || !receivedFiles || receivedFiles.length === 0) {
    return (
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition cursor-pointer ${
          isDragActive
            ? "border-blue-500 bg-blue-100"
            : "border-blue-200 bg-blue-50 hover:bg-blue-100"
        }`}
      >
        <Inbox className="h-12 w-12 mx-auto mb-4 text-blue-500 animate-pulse" />
        <p className="text-lg font-semibold text-blue-700 mb-2">
          Waiting for sender to transfer file...
        </p>
        <ProgressBar progress={Math.floor(fakeProgress)} />
        <Loader2 className="h-6 w-6 mx-auto mt-3 text-blue-500 animate-spin" />
        <p className="text-sm italic text-gray-600 mt-2">{quote}</p>
        <input {...getInputProps()} className="hidden" />
      </div>
    );
  }

  // ✅ Once file arrives — show received card
  const lastFile = receivedFiles[receivedFiles.length - 1];

  return (
    <div className="space-y-6">
      {/* Drop area still visible for consistency */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed rounded-2xl p-8 text-center border-blue-200 bg-blue-50 hover:bg-blue-100 transition"
      >
        <Upload className="h-12 w-12 mx-auto mb-4 text-blue-500" />
        <p className="text-gray-700 mb-1">
          Receiver ready — drop to send new file or view received file below.
        </p>
        <input {...getInputProps()} className="hidden" />
      </div>

      {/* Received File Card */}
      <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 shadow-sm">
        <div className="flex items-center flex-grow">
          <File className="h-8 w-8 text-green-600 mr-3" />
          <div className="flex-grow">
            <p className="font-medium text-gray-800 text-sm truncate">
              {lastFile.name}
            </p>
            <p className="text-xs text-gray-500">
              {lastFile.size
                ? (lastFile.size / (1024 * 1024)).toFixed(2)
                : "?"}{" "}
              MB
            </p>
            <p className="text-xs text-green-600 mt-1 font-medium">
              File received successfully!
            </p>
          </div>
        </div>

        {/* ✅ Download button */}
        <a
          href={lastFile.url}
          download={lastFile.name}
          className="p-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition"
          title="Download file"
        >
          <Download className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
}
