// Receiver.jsx
import React from "react";
import { Inbox, File ,Download } from "lucide-react";

export default function Receiver({ receivedFiles }) {
  if (receivedFiles.length === 0) return null;

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm mt-4">
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
            <a
              href={file.url}
              download={file.name}
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              <Download className="h-5 w-5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}


