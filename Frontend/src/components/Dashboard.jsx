// Dashboard.jsx
"use client";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { History, LogOut, RefreshCw, Copy, Check, UserPlus } from "lucide-react";
import {useFileShare} from "./UseFileShare.jsx";
import Sender from "./Sender";
import Receiver from "./Receiver";
import { socket } from "../socket";
import { toast } from "react-hot-toast";
import { Logout } from "./Logout.jsx";

export default function Dashboard() {
  // const [isSender, setIsSender] = useState(false);
  const navigate = useNavigate();
  const UserName = localStorage.getItem("UserName") || "Anonymous";
  const token = localStorage.getItem("token");

  const {
    files,
    receivedFiles,
    peers,
    connectionEstablished,
    uploadProgress,
    roomId,
    setRoomId,
    handleFileChange,
    handleRemove,
    sendFile,
    generateRandomRoom,
    incomingFile,
    fileSent,
    joinRoom
  } = useFileShare(UserName, token);

  const fileInputRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const handleClick = () => fileInputRef.current?.click();

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
  });

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900" {...getRootProps()}>
      {/* HEADER */}
      <header className="border-b border-gray-200 bg-blue-50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
              <div>
               <h1 className="font-bold text-lg text-blue-700">P2P File Share</h1>
               <p className="text-xs font-semibold text-gray-500">
                 User: <span className="text-blue-600">
                   {UserName || "Unknown"}
                 </span>
                </p>
               <p className="text-xs font-semibold text-gray-500">
                 Room: <span className="text-blue-600">
                   {roomId || "Not connected"}
                 </span>
               </p>
             </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/history")}
              className="flex items-center gap-2 border border-blue-200 px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 transition text-blue-700"
            >
              <History className="h-4 w-4" /> History
            </button>

            <button
              onClick={ async () => {
                // navigate("/");
                // localStorage.removeItem("token");
                // localStorage.removeItem("UserName");
                const result = await Logout();
                if (result) navigate("/");
              }}
              className="flex items-center gap-2 border border-blue-200 px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 transition text-blue-700"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Sender
            files={files}
            handleFileChange={handleFileChange}
            handleRemove={handleRemove}
            sendFile={sendFile}
            uploadProgress={uploadProgress}
            connectionEstablished={connectionEstablished}
            fileSent={fileSent}
            getInputProps={getInputProps}
            fileInputRef={fileInputRef}
            handleClick={handleClick}
          />
          <Receiver
            incomingFile={incomingFile}
            receivedFiles={receivedFiles}
          />
        </div>

        {/* PEERS SECTION */}
        <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-blue-700">
            <UserPlus className="h-5 w-5 text-blue-500" /> Peers in Room
          </h2>

          {/* Room ID */}
          <div className="flex items-center gap-2 mb-3">
            <input
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="flex-1 text-center text-lg font-bold text-blue-700 border border-blue-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={copyRoomId}
              className="border border-blue-300 p-2 rounded-lg hover:bg-blue-100"
            >
              {copied ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <Copy className="h-5 w-5 text-blue-600" />
              )}
            </button>
          </div>

          {/* Generate & Join */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                const newRoom = generateRandomRoom();
                socket.emit("join-room", { roomId:newRoom, name: UserName, token });
                console.log("🔗 Joined room:", newRoom);
              }}
              className="flex-1 border border-blue-300 bg-blue-50 text-blue-700 rounded-lg py-2 hover:bg-blue-100 transition flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-4 w-4" /> Generate
            </button>

            <button
              onClick={() => {
                if (roomId.trim() !== "") {
                  joinRoom();
                  console.log("🔗 Joined room:", roomId);
                } else {
                  toast.error("Please enter a valid room ID", {
                    style: {
                    width: 'auto',
                    border: '1px solid #1447E6',
                    padding: '16px',
                    color: '#1447E6',
                  },
                  iconTheme: {
                    primary: '#1447E6',
                    secondary: '#FFFAEE',
                  },
                  duration: 2500,
              });
                }
              }}
              className="flex-1 border border-blue-300 bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600 transition"
            >
              Join Room
            </button>
          </div>

          {/* Peer List */}
          {peers.length > 0 ? (
            peers
              .filter((peer) => peer.name !== UserName)
              .map((peer, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-blue-50 mb-3 border border-blue-100"
                >
                  <div>
                    <p className="font-medium text-sm text-gray-800">
                      {peer.name || peer.id}
                    </p>
                    <p
                      className={`text-xs ${
                        peer.connected ? "text-green-600" : "text-red-400"
                      }`}
                    >
                      {peer.connected ? "Connected" : "Disconnected"}
                    </p>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-gray-500 text-sm">No peers connected yet...</p>
          )}
        </div>
      </div>
    </div>
  );
}
