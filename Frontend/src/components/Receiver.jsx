import React, { useEffect, useState } from "react";
import { Inbox, File, Download, Lock, ShieldCheck, Zap } from "lucide-react";
import toast from "react-hot-toast";
import { confirmToast } from "./ConfirmToast";

const SECURITY_QUOTES = [
  { text: "Your file is encrypted end-to-end 🔐", icon: Lock },
  { text: "No servers involved — truly peer-to-peer 🌐", icon: ShieldCheck },
  { text: "Ensuring a secure and private transfer… 🔒", icon: Lock },
  { text: "Speeding through encrypted channels ⚡", icon: Zap },
  { text: "We never store your files — not even for a second 🚫💾", icon: ShieldCheck },
];

export default function Receiver({ receivedFiles, incomingFile }) {

  
//   const handleDownload = async (file) => {
//   const confirmDownload = window.confirm(`Do you want to download "${file.name}"?`);

//   if (!confirmDownload) return;

//   try {
//     // Create a temporary link element (programmatic download)
//     const link = document.createElement("a");
//     link.href = file.url;
//     link.download = file.name;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);

//     // Show alert after a short delay (ensures browser starts download)
//     setTimeout(() => {
//       alert(`Download completed: ${file.name}`);
//     }, 800);
    
//   } catch (err) {
//     alert("❌ Something went wrong while downloading. Try again.");
//     console.error(err);
//   }
// };

  const handleDownload = async (file) => {
  const confirm = await confirmToast(`Download "${file.name}"?`);

  if (!confirm) {
    toast("Download canceled", {
      icon: "❌",
      style: { border: "1px solid #1447E6", color: "#1447E6" },
    });
    return;
  }

  try {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    link.remove();

    toast.success(`Download started: ${file.name}`, {
      style: { border: "1px solid #1447E6", color: "#1447E6" },
    });

  } catch (err) {
    toast.error("❌ Failed to download. Try again.", {
      style: { border: "1px solid #1447E6", color: "#1447E6" },
    });
    console.error(err);
  }
};

  const [quoteIndex, setQuoteIndex] = useState(0);

  // rotate quotes every 2 seconds
  useEffect(() => {
    if (!incomingFile) return;

    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % SECURITY_QUOTES.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [incomingFile]);

  return (
    <div className="space-y-4 mt-4">

      {/* 🔵 Animated loader when filename received */}
      {incomingFile && (
        <div className="bg-white border border-yellow-600 rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <Inbox className="h-6 w-6 mr-2 text-yellow-400" />
            Receiving File…
          </h3>

          <div className="flex items-center gap-3">
            <File className="h-6 w-6 text-yellow-600" />
            <span className="text-gray-700 text-sm truncate">{incomingFile}</span>
          </div>

          {/* 🔥 Animated bouncing dots */}
          <div className="flex items-center gap-2 mt-4">
            <div className="h-2 w-2 bg-yellow-300 rounded-full animate-bounce"></div>
            <div className="h-2 w-2 bg-yellow-300 rounded-full animate-bounce delay-150"></div>
            <div className="h-2 w-2 bg-yellow-300 rounded-full animate-bounce delay-300"></div>
          </div>

          {/* 🔥 Rotating security quotes */}
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-700 italic">
            {React.createElement(SECURITY_QUOTES[quoteIndex].icon, {
              className: "h-4 w-4 text-yellow-600",
            })}
            <span>{SECURITY_QUOTES[quoteIndex].text}</span>
          </div>
        </div>
      )}

      {/* 🟢 Show received files ONLY when the actual file blob arrives */}
      {receivedFiles.length > 0 && (
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Inbox className="h-6 w-6 mr-2 text-green-600" /> Received Files
          </h3>

          <div className="space-y-2">
            {receivedFiles.map((file, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <File className="h-6 w-6 text-green-600 mr-3" />
                  <span className="text-gray-700 text-sm truncate">{file.name}</span>
                </div>

                <button
                  onClick={() => handleDownload(file)}
                  className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-2"
                >
                  <Download className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
