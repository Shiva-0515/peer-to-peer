import React from "react";
import { Upload, File, Send, X, CheckCircle } from "lucide-react";
import ProgressBar from "./ProgressBar";

export default function Sender({
  files,
  // handleFileChange,
  handleRemove,
  sendFile,
  uploadProgress,
  connectionEstablished,
  fileSent,
  getInputProps,
  fileInputRef,
  handleClick,
}) {
  return (
    <div className="space-y-6">
      <div
        className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center cursor-pointer hover:bg-blue-100 transition"
        onClick={handleClick}
      >
        <Upload className="h-12 w-12 mx-auto mb-4 text-blue-500" />
        <p className="text-gray-700 mb-1">Click or Drop File Here</p>
        <p className="text-sm text-gray-500">Max size: 1 GB</p>
        <input {...getInputProps()} ref={fileInputRef} type="file" className="hidden" />
      </div>

      {files.length > 0 && (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
          <div className="flex items-center flex-grow">
            <File className="h-8 w-8 text-blue-500 mr-3" />
            <div className="flex-grow">
              <p className="font-medium text-gray-800 text-sm truncate">{files[0].name}</p>
              <p className="text-xs text-gray-500">
                {(files[0].size / (1024 * 1024)).toFixed(2)} MB
              </p>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <ProgressBar progress={uploadProgress} />
              )}

              <p className="text-xs text-gray-600 mt-1">
                {fileSent ? (
                  <span className="text-green-600 font-medium">Sent!</span>
                ) : uploadProgress > 0 && uploadProgress < 100 ? (
                  `Uploading... ${uploadProgress}%`
                ) : connectionEstablished ? (
                  "Ready to send"
                ) : (
                  "Waiting for peer..."
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center ml-4">
            {fileSent ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <>
                <button
                  onClick={sendFile}
                  disabled={!connectionEstablished || fileSent}
                  className={`p-2 rounded-full ${
                    connectionEstablished
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  <Send className="h-5 w-5" />
                </button>
                <button
                  onClick={handleRemove}
                  className="ml-2 p-1.5 rounded-full text-gray-400 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
