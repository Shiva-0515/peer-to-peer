// // P2PFileShareUI.jsx
// "use client";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { useDropzone } from "react-dropzone";
// import { Send, Upload, History, LogOut, UserPlus, Copy, RefreshCw, Check } from "lucide-react";
// import { File, CheckCircle, X, Inbox } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { socket } from "../socket.js";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";

// const saveTransferLog = async ({ direction, status, file, roomId, peerDetails }) => {
  
//   const decoded = jwtDecode(localStorage.getItem("token"));
//   try {
//     await axios.post("http://localhost:5000/api/transfers", {
//       userId: decoded.id,
//       filename: file.name,
//       size: file.size,
//       roomId,
//       direction,
//       status,
//       peerDetails: peerDetails || null,
//     });
//     console.log(`📜 Transfer log saved (${direction}, ${status})`);
//   } catch (err) {
//     console.error("❌ Error saving transfer log:", err.response?.data || err.message);
//   }
// };

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const UserName = localStorage.getItem("UserName") || "Anonymous";
//   const token = localStorage.getItem("token");
//   const [files, setFiles] = useState([]);
//   const [receivedFiles, setReceivedFiles] = useState([]);
//   const [connectionEstablished, setConnectionEstablished] = useState(false);
//   const [roomId, setRoomId] = useState("");
//   const [fileSent, setFileSent] = useState(false);
//   const [peers, setPeers] = useState([]);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [copied, setCopied] = useState(false);

//   const peerConnection = useRef(null);
//   const dataChannel = useRef(null);
//   const incomingFileBuffer = useRef([]);
//   const incomingFileName = useRef(null);
//   const incomingFileSize = useRef(0);
//   const receivedSize = useRef(0);
//   const fileInputRef = useRef(null);

//   const handleFileChange = useCallback((newFiles) => {
//     setFiles(newFiles);
//     setFileSent(false);
//   }, []);

//   const handleRemove = useCallback(() => {
//     setFiles([]);
//     setFileSent(false);
//   }, []);

//   const handleClick = useCallback(() => {
//     fileInputRef.current?.click();
//   }, []);

//   const generateRandomRoom = () => {
//   const chars =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?";
//   let newRoomId = "";

//   for (let i = 0; i < 25; i++) {
//     newRoomId += chars.charAt(Math.floor(Math.random() * chars.length));
//     if ((i + 1) % 5 === 0 && i !== 24) newRoomId += "-";
//   }

//   setRoomId(newRoomId);
// };


//   const copyRoomId = () => {
//     if (!roomId) return;
//     navigator.clipboard.writeText(roomId);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 1500);
//   };

  
//   const sendFile = useCallback(async () => {
//     const file = files[0];
//     if (!file || !dataChannel.current || dataChannel.current.readyState !== "open") return;

//     try {
//       const chunkSize = 16 * 1024; // 16 KB
//       const buffer = await file.arrayBuffer();
//       const totalChunks = Math.ceil(buffer.byteLength / chunkSize);

//       dataChannel.current.send(
//         JSON.stringify({ type: "metadata", name: file.name, size: buffer.byteLength })
//       );

//       let sentBytes = 0;

//       // for (let i = 0; i < totalChunks; i++) {
//       //   const start = i * chunkSize;
//       //   const end = Math.min(buffer.byteLength, start + chunkSize);
//       //   const chunk = buffer.slice(start, end);

//       //   while (dataChannel.current.bufferedAmount > 16 * 1024 * 1024) {
//       //     await new Promise((resolve) => setTimeout(resolve, 100));
//       //   }

//       //   dataChannel.current.send(chunk);
//       //   sentBytes += chunk.byteLength;
//       //   const progress = Math.floor((sentBytes / buffer.byteLength) * 100);
//       //   setUploadProgress(progress);
//       // }
//       for (let i = 0; i < totalChunks; i++) {
//   const start = i * chunkSize;
//   const end = Math.min(buffer.byteLength, start + chunkSize);
//   const chunk = buffer.slice(start, end);

//   // Wait if the buffer is too full
//         while (dataChannel.current.bufferedAmount > 8 * 1024 * 1024) {
//           await new Promise((resolve) => setTimeout(resolve, 100));
//         }

//         try {
//           dataChannel.current.send(chunk);
//         } catch (err) {
//           console.error("❌ Send error, retrying:", err.message);
//           await new Promise((resolve) => setTimeout(resolve, 500));
//           i--; // retry the same chunk
//           continue;
//         }

//         sentBytes += chunk.byteLength;
//         const progress = Math.floor((sentBytes / buffer.byteLength) * 100);
//         setUploadProgress(progress);
//       }


//       console.log("✅ File sent successfully");
//       setUploadProgress(100);
//       setFileSent(true);

//       await saveTransferLog({
//         direction: "sent",
//         status: "success",
//         file,
//         roomId,
//         peerDetails: peers.length > 0 ? peers[0].id : null,
//       });
//     } catch (err) {
//       console.error("❌ Error sending file:", err);
//       await saveTransferLog({
//         direction: "sent",
//         status: "failed",
//         file,
//         roomId,
//         peerDetails: peers.length > 0 ? peers[0].id : null,
//       });
//     }
//   }, [files, roomId, peers]);

//   const setupDataChannelListeners = (channel) => {
//     channel.binaryType = "arraybuffer";
//     channel.onopen = () => {
//       console.log("📡 Data channel open");
//       setConnectionEstablished(true);

//       setPeers((prev) =>
//       prev.map((p) =>
//       ({...p, connected: true})
//       )
//     );
//     };

//     channel.onmessage = (event) => {
//       if (typeof event.data === "string") {
//         try {
//           const message = JSON.parse(event.data);
//           if (message.type === "metadata") {
//             incomingFileName.current = message.name;
//             incomingFileSize.current = message.size;
//             incomingFileBuffer.current = [];
//             receivedSize.current = 0;
//           }
//         } catch (err) {
//           console.error("Invalid JSON:", err);
//         }
//       } else {
//         incomingFileBuffer.current.push(new Uint8Array(event.data));
//         receivedSize.current += event.data.byteLength;

//         if (receivedSize.current === incomingFileSize.current) {
//           const receivedBlob = new Blob(incomingFileBuffer.current);
//           const url = URL.createObjectURL(receivedBlob);
//           setReceivedFiles((prev) => [
//             ...prev,
//             { name: incomingFileName.current || "unknown", url },
//           ]);
//           console.log("📥 File received and assembled");

//           saveTransferLog({
//             direction: "received",
//             status: "success",
//             file: { name: incomingFileName.current, size: incomingFileSize.current },
//             roomId,
//             peerDetails: peers.length > 0 ? peers[0].id : null,
//           });
//         }
//       }
//     };
//   };

//   useEffect(() => {
//     if (!roomId) return;

//     const pc = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });
//     peerConnection.current = pc;

//     const createDataChannel = () => {
//       dataChannel.current = pc.createDataChannel("file");
//       setupDataChannelListeners(dataChannel.current);
//     };

//     pc.ondatachannel = (event) => {
//       dataChannel.current = event.channel;
//       setupDataChannelListeners(dataChannel.current);
//     };

//     pc.onicecandidate = (event) => {
//       if (event.candidate)
//         socket.emit("ice-candidate", { roomId, candidate: event.candidate });
//     };

//     // socket.emit("join-room", { roomId , name : UserName});

//     socket.on("user-joined", () => {
//       createDataChannel();
//       pc.createOffer()
//         .then((offer) => pc.setLocalDescription(offer))
//         .then(() => socket.emit("offer", { roomId, offer: pc.localDescription }));
//     });

//     socket.on("offer", async (offer) => {
//       await pc.setRemoteDescription(new RTCSessionDescription(offer));
//       const answer = await pc.createAnswer();
//       await pc.setLocalDescription(answer);
//       socket.emit("answer", { roomId, answer });
//     });

//     socket.on("answer", async (answer) => {
//       await pc.setRemoteDescription(new RTCSessionDescription(answer));
//     });

//     socket.on("ice-candidate", async (data) => {
//       try {
//         let candidate = data.candidate || data;
//         if (typeof candidate === "string") {
//           candidate = { candidate, sdpMid: "0", sdpMLineIndex: 0 };
//         }

//         if (candidate.candidate) {
//           await pc.addIceCandidate(new RTCIceCandidate(candidate));
//           console.log("✅ Added ICE candidate:", candidate.candidate);
//         } else {
//           console.warn("⚠️ Ignoring malformed candidate:", candidate);
//         }
//       } catch (err) {
//         console.error("❌ Error adding ICE candidate:", err);
//       }
//     });

//    socket.on("peer-list", (list) => {
//       setPeers(
//         list.map((peer) => ({
//           id: peer.id,
//           name: peer.name,
//           connected: false, // default until data channel opens
//         }))
//       );
//     });

//     return () => {
//       socket.off("user-joined");
//       socket.off("offer");
//       socket.off("answer");
//       socket.off("ice-candidate");
//       socket.off("peer-list");
//       pc.close();
//     };
//   }, [roomId]);

//   const { getRootProps, getInputProps } = useDropzone({
//     multiple: false,
//     noClick: true,
//     onDrop: handleFileChange,
//   });

//   return (
//     <div className="min-h-screen bg-white text-gray-900" {...getRootProps()}>
//       {/* Header */}
//       <header className="border-b border-gray-200 bg-blue-50 sticky top-0 z-10 shadow-sm">
//         <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center">
//               <Send className="h-5 w-5 text-white" />
//             </div>
//             <div>
//               <h1 className="font-bold text-lg text-blue-700">P2P File Share</h1>
//               <p className="text-xs text-gray-500">
//                 Room: <span className="text-blue-600">
//                   {roomId || "Not connected"}
//                 </span>
//               </p>
//             </div>
//           </div>
//           <div className="flex gap-3">
//             <button
//               className="flex items-center gap-2 border border-blue-200 px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 transition text-blue-700"
//               onClick={() => navigate("/history")}
//             >
//               <History className="h-4 w-4" /> History
//             </button>
//             <button
//               className="flex items-center gap-2 border border-blue-200 px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 transition text-blue-700"
//               onClick={() => {
//                 navigate("/")
//                 localStorage.removeItem("token");
//                 localStorage.removeItem("userName");
//               }}
//             >
//               <LogOut className="h-4 w-4" /> Logout
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Main */}
//       <div className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-3 gap-6">
//         {/* Upload Section */}
//         <div className="lg:col-span-2 space-y-6">
//           <div
//             className="bg-blue-50 border border-blue-200 rounded-2xl p-8 shadow-sm text-center cursor-pointer hover:bg-blue-100 transition"
//             onClick={handleClick}
//           >
//             <Upload className="h-12 w-12 mx-auto mb-4 text-blue-500" />
//             <p className="text-gray-700 mb-1">Click or Drop File Here</p>
//             <p className="text-sm text-gray-500">Max size: 1 GB</p>
//             <input
//               {...getInputProps()}
//               ref={fileInputRef}
//               type="file"
//               className="hidden"
//               onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
//             />
//           </div>

//           {/* File Details */}
//           {files.length > 0 && (
//         <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
//           <div className="flex items-center flex-grow min-w-0">
//             <File className="h-8 w-8 text-blue-500 mr-3 shrink-0" />

//             <div className="flex-grow min-w-0">
//               <p
//                 className="font-medium text-gray-800 text-sm truncate"
//                 title={files[0].name}
//               >
//                 {files[0].name}
//               </p>
//               <p className="text-xs text-gray-500">
//                 {(files[0].size / (1024 * 1024)).toFixed(2)} MB
//               </p>

//               {/* Progress */}
//               {uploadProgress > 0 && uploadProgress < 100 && (
//                 <div className="w-full bg-blue-100 rounded-full h-2 mt-1.5">
//                   <div
//                     className="bg-blue-500 h-2 rounded-full transition-all duration-150"
//                     style={{ width: `${uploadProgress}%` }}
//                   ></div>
//                 </div>
//               )}

//               <p className="text-xs text-gray-600 mt-1">
//                 {fileSent ? (
//                   <span className="text-green-600 font-medium">Sent!</span>
//                 ) : uploadProgress > 0 && uploadProgress < 100 ? (
//                   `Uploading... ${uploadProgress}%`
//                 ) : connectionEstablished ? (
//                   "Ready to send"
//                 ) : (
//                   "Waiting for peer..."
//                 )}
//               </p>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex items-center ml-4">
//             {fileSent ? (
//               <CheckCircle className="h-6 w-6 text-green-500" />
//             ) : (
//               <>
//                 <button
//                   onClick={() =>
//                     connectionEstablished && !fileSent && sendFile()
//                   }
//                   disabled={!connectionEstablished || fileSent}
//                   className={`p-2 rounded-full transition-colors ${
//                     connectionEstablished
//                       ? "bg-blue-600 text-white hover:bg-blue-700"
//                       : "bg-gray-200 text-gray-400 cursor-not-allowed"
//                   }`}
//                 >
//                   <Send className="h-5 w-5" />
//                 </button>

//                 <button
//                   onClick={handleRemove}
//                   className="ml-2 p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
//                 >
//                   <X className="h-5 w-5" />
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//          {/* Received Files */}
//      {receivedFiles.length > 0 && (
//         <div className="bg-white border rounded-xl p-4 shadow-sm mt-4">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//             <Inbox className="h-6 w-6 mr-2 text-green-600" />
//             Received Files
//           </h3>

//           <div className="space-y-2">
//             {receivedFiles.map((file, i) => (
//               <div
//                 key={i}
//                 className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-lg"
//               >
//                 <div className="flex items-center min-w-0">
//                   <File className="h-6 w-6 text-green-600 mr-3 shrink-0" />
//                   <span
//                     className="text-gray-700 text-sm truncate"
//                     title={file.name}
//                   >
//                     {file.name}
//                   </span>
//                 </div>

//                 <a
//                   href={file.url}
//                   download={file.name}
//                   className="text-blue-600 hover:underline text-sm font-medium ml-4"
//                 >
//                   Download
//                 </a>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//         </div>

//         {/* Peers Section */}
//         <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
//           <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-blue-700">
//             <UserPlus className="h-5 w-5 text-blue-500" />
//             Peers in Room
//           </h2>

//           <div className="flex items-center gap-2 mb-3">
//             <input
//               value={roomId}
//               onChange={(e) => setRoomId(e.target.value)}
//               className="flex-1 text-center text-lg font-bold text-blue-700 border border-blue-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//             <button
//               onClick={copyRoomId}
//               className="border border-blue-300 p-2 rounded-lg hover:bg-blue-100"
//               title="Copy Room ID"
//             >
//               {copied ? (
//                 <Check className="h-5 w-5 text-green-600" />
//               ) : (
//                 <Copy className="h-5 w-5 text-blue-600" />
//               )}
//             </button>
//           </div>

//           <div className="flex gap-2 mb-6">
//             <button
//               onClick={() => generateRandomRoom()}
//               className="flex-1 border border-blue-300 bg-blue-50 text-blue-700 rounded-lg py-2 hover:bg-blue-100 transition flex items-center justify-center gap-2"
//             >
//               <RefreshCw className="h-4 w-4" /> Generate
//             </button>
//             <button
//               onClick={() => {
//                 if (roomId.trim() !== "") {
//                   socket.emit("join-room", {roomId , name: UserName , token});
//                   console.log("🔗 Joined room:", roomId);
//                 } else {
//                   alert("Please enter a valid room number");
//                 }
//               }}
//               className="flex-1 border border-blue-300 bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600 transition"
//             >
//               Join Room
//             </button>
//           </div>

//           {peers.length > 0 ? (
//             peers
//             .filter((peer) => peer.name !== UserName)
//             .map((peer, i) => (
//               <div
//                 key={i}
//                 className="flex items-center justify-between p-3 rounded-lg bg-blue-50 mb-3 border border-blue-100"
//               >
//                 <div>
//                   <p className="font-medium text-sm text-gray-800">
//                     {peer.name || peer.id}
//                   </p>
//                   <p
//                     className={`text-xs ${
//                       peer.connected ? "text-green-600" : "text-red-400"
//                     }`}
//                   >
//                     {peer.connected ? "Connected" : "Disconnected"}
//                   </p>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500 text-sm">No peers connected yet...</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



// // Dashboard.jsx
// "use client";
// import React, { useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDropzone } from "react-dropzone";
// import { History, LogOut, RefreshCw, Copy, Check, UserPlus } from "lucide-react";
// import {useFileShare} from "./UseFileShare.jsx";
// import Sender from "./Sender";
// import Receiver from "./Receiver";
// import { socket } from "../socket";

// export default function Dashboard() {
//   const [isSender, setIsSender] = useState(false);
//   const navigate = useNavigate();
//   const UserName = localStorage.getItem("UserName") || "Anonymous";
//   const token = localStorage.getItem("token");

//   const {
//     files,
//     receivedFiles,
//     peers,
//     connectionEstablished,
//     uploadProgress,
//     roomId,
//     setRoomId,
//     handleFileChange,
//     handleRemove,
//     sendFile,
//     generateRandomRoom,
//     fileSent,
//     receiveProgress,
//   } = useFileShare(UserName, token);

//   const fileInputRef = useRef(null);
//   const [copied, setCopied] = useState(false);

//   const handleClick = () => fileInputRef.current?.click();

//   const { getRootProps, getInputProps } = useDropzone({
//     multiple: false,
//     noClick: true,
//     onDrop: handleFileChange,
//   });

//   const copyRoomId = () => {
//     navigator.clipboard.writeText(roomId);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 1500);
//   };

//   return (
//     <div className="min-h-screen bg-white text-gray-900" {...getRootProps()}>
//       {/* HEADER */}
//       <header className="border-b border-gray-200 bg-blue-50 sticky top-0 z-10 shadow-sm">
//         <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
//           <h1 className="font-bold text-lg text-blue-700">P2P File Share</h1>

//           <div className="flex gap-3">
//             <button
//               onClick={() => navigate("/history")}
//               className="flex items-center gap-2 border border-blue-200 px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 transition text-blue-700"
//             >
//               <History className="h-4 w-4" /> History
//             </button>

//             <button
//               onClick={() => {
//                 navigate("/");
//                 localStorage.removeItem("token");
//                 localStorage.removeItem("UserName");
//               }}
//               className="flex items-center gap-2 border border-blue-200 px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 transition text-blue-700"
//             >
//               <LogOut className="h-4 w-4" /> Logout
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* MAIN */}
//       <div className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2">
//           <Sender
//             files={files}
//             handleFileChange={handleFileChange}
//             handleRemove={handleRemove}
//             sendFile={sendFile}
//             uploadProgress={uploadProgress}
//             connectionEstablished={connectionEstablished}
//             fileSent={fileSent}
//             getInputProps={getInputProps}
//             fileInputRef={fileInputRef}
//             handleClick={handleClick}
//           />
//           <Receiver
//             receivedFiles={receivedFiles}
//           />


//         </div>

//         {/* PEERS SECTION */}
//         <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
//           <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-blue-700">
//             <UserPlus className="h-5 w-5 text-blue-500" /> Peers in Room
//           </h2>

//           {/* Room ID */}
//           <div className="flex items-center gap-2 mb-3">
//             <input
//               value={roomId}
//               onChange={(e) => setRoomId(e.target.value)}
//               className="flex-1 text-center text-lg font-bold text-blue-700 border border-blue-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//             <button
//               onClick={copyRoomId}
//               className="border border-blue-300 p-2 rounded-lg hover:bg-blue-100"
//             >
//               {copied ? (
//                 <Check className="h-5 w-5 text-green-600" />
//               ) : (
//                 <Copy className="h-5 w-5 text-blue-600" />
//               )}
//             </button>
//           </div>

//           {/* Generate & Join */}
//           <div className="flex gap-2 mb-6">
//             <button
//               onClick={() => generateRandomRoom()}
//               className="flex-1 border border-blue-300 bg-blue-50 text-blue-700 rounded-lg py-2 hover:bg-blue-100 transition flex items-center justify-center gap-2"
//             >
//               <RefreshCw className="h-4 w-4" /> Generate
//             </button>

//             <button
//               onClick={() => {
//                 if (roomId.trim() !== "") {
//                   socket.emit("join-room", { roomId, name: UserName, token });
//                   console.log("🔗 Joined room:", roomId);
//                 } else {
//                   alert("Please enter a valid room ID");
//                 }
//               }}
//               className="flex-1 border border-blue-300 bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600 transition"
//             >
//               Join Room
//             </button>
//           </div>

//           {/* Peer List */}
//           {peers.length > 0 ? (
//             peers
//               .filter((peer) => peer.name !== UserName)
//               .map((peer, i) => (
//                 <div
//                   key={i}
//                   className="flex items-center justify-between p-3 rounded-lg bg-blue-50 mb-3 border border-blue-100"
//                 >
//                   <div>
//                     <p className="font-medium text-sm text-gray-800">
//                       {peer.name || peer.id}
//                     </p>
//                     <p
//                       className={`text-xs ${
//                         peer.connected ? "text-green-600" : "text-red-400"
//                       }`}
//                     >
//                       {peer.connected ? "Connected" : "Disconnected"}
//                     </p>
//                   </div>
//                 </div>
//               ))
//           ) : (
//             <p className="text-gray-500 text-sm">No peers connected yet...</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";
// import React, { useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDropzone } from "react-dropzone";
// import { History, LogOut, RefreshCw, Copy, Check, UserPlus } from "lucide-react";
// import { useFileShare } from "./UseFileShare.jsx";
// import Sender from "./Sender";
// import Receiver from "./Receiver";
// import { socket } from "../socket";

// export default function Dashboard() {
//   const [isSender, setIsSender] = useState(false); // ✅ determines sender/receiver view
//   const navigate = useNavigate();
//   const UserName = localStorage.getItem("UserName") || "Anonymous";
//   const token = localStorage.getItem("token");

//   const {
//     files,
//     receivedFiles,
//     peers,
//     connectionEstablished,
//     uploadProgress,
//     roomId,
//     setRoomId,
//     handleFileChange,
//     handleRemove,
//     sendFile,
//     generateRandomRoom,
//     fileSent,
//     receiveProgress, // ✅ synced from socket
//   } = useFileShare(UserName, token);

//   const fileInputRef = useRef(null);
//   const [copied, setCopied] = useState(false);

//   // ✅ when a user selects a file, mark as sender
//   const handleFileSelect = (newFiles) => {
//     handleFileChange(newFiles);
//     setIsSender(true);
//   };

//   const handleClick = () => fileInputRef.current?.click();

//   // ✅ keep drag-and-drop functionality
//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     multiple: false,
//     noClick: true,
//     onDrop: handleFileSelect,
//   });

//   const copyRoomId = () => {
//     navigator.clipboard.writeText(roomId);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 1500);
//   };

//   return (
//     // <div className="min-h-screen bg-white text-gray-900" {...getRootProps()}>
//     <div className="min-h-screen bg-white text-gray-900">
//       {/* HEADER */}
//       <header className="border-b border-gray-200 bg-blue-50 sticky top-0 z-10 shadow-sm">
//         <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
//           <h1 className="font-bold text-lg text-blue-700">P2P File Share</h1>

//           <div className="flex gap-3">
//             <button
//               onClick={() => navigate("/history")}
//               className="flex items-center gap-2 border border-blue-200 px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 transition text-blue-700"
//             >
//               <History className="h-4 w-4" /> History
//             </button>

//             <button
//               onClick={() => {
//                 navigate("/");
//                 localStorage.removeItem("token");
//                 localStorage.removeItem("UserName");
//               }}
//               className="flex items-center gap-2 border border-blue-200 px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 transition text-blue-700"
//             >
//               <LogOut className="h-4 w-4" /> Logout
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* MAIN */}
//       <div className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-3 gap-6">
//         {/* LEFT SECTION: Sender/Receiver */}
//         <div className="lg:col-span-2 space-y-6">
//           {isSender ? (
//             <Sender
//               files={files}
//               handleFileChange={handleFileSelect}
//               handleRemove={handleRemove}
//               sendFile={sendFile}
//               uploadProgress={uploadProgress}
//               connectionEstablished={connectionEstablished}
//               fileSent={fileSent}
//               getInputProps={getInputProps}
//               fileInputRef={fileInputRef}
//               handleClick={handleClick}
//               isDragActive={isDragActive}
//             />
//           ) : (
//             <Receiver
//               receivedFiles={receivedFiles}
//               uploadProgress={receiveProgress}
//             />
//           )}
//         </div>

//         {/* RIGHT SECTION: Peers + Room Controls */}
//         <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
//           <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-blue-700">
//             <UserPlus className="h-5 w-5 text-blue-500" /> Peers in Room
//           </h2>

//           {/* Room ID */}
//           <div className="flex items-center gap-2 mb-3">
//             <input
//               value={roomId}
//               onChange={(e) => setRoomId(e.target.value)}
//               className="flex-1 text-center text-lg font-bold text-blue-700 border border-blue-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//             <button
//               onClick={copyRoomId}
//               className="border border-blue-300 p-2 rounded-lg hover:bg-blue-100"
//             >
//               {copied ? (
//                 <Check className="h-5 w-5 text-green-600" />
//               ) : (
//                 <Copy className="h-5 w-5 text-blue-600" />
//               )}
//             </button>
//           </div>

//           {/* Generate & Join Buttons */}
//           <div className="flex gap-2 mb-6">
//             <button
//               onClick={() => generateRandomRoom()}
//               className="flex-1 border border-blue-300 bg-blue-50 text-blue-700 rounded-lg py-2 hover:bg-blue-100 transition flex items-center justify-center gap-2"
//             >
//               <RefreshCw className="h-4 w-4" /> Generate
//             </button>

//             <button
//               onClick={() => {
//                 if (roomId.trim() !== "") {
//                   socket.emit("join-room", { roomId, name: UserName, token });
//                   console.log("🔗 Joined room:", roomId);
//                 } else {
//                   alert("Please enter a valid room ID");
//                 }
//               }}
//               className="flex-1 border border-blue-300 bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600 transition"
//             >
//               Join Room
//             </button>
//           </div>

//           {/* Peer List */}
//           {peers.length > 0 ? (
//             peers
//               .filter((peer) => peer.name !== UserName)
//               .map((peer, i) => (
//                 <div
//                   key={i}
//                   className="flex items-center justify-between p-3 rounded-lg bg-blue-50 mb-3 border border-blue-100"
//                 >
//                   <div>
//                     <p className="font-medium text-sm text-gray-800">
//                       {peer.name || peer.id}
//                     </p>
//                     <p
//                       className={`text-xs ${
//                         peer.connected ? "text-green-600" : "text-red-400"
//                       }`}
//                     >
//                       {peer.connected ? "Connected" : "Disconnected"}
//                     </p>
//                   </div>
//                 </div>
//               ))
//           ) : (
//             <p className="text-gray-500 text-sm">No peers connected yet...</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { History, LogOut, RefreshCw, Copy, Check, UserPlus } from "lucide-react";
import { useFileShare } from "./UseFileShare.jsx";
import Sender from "./Sender";
import { socket } from "../socket";

export default function Dashboard() {
  const [isSender, setIsSender] = useState(false);
  const navigate = useNavigate();
  const UserName = localStorage.getItem("UserName") || "Anonymous";
  const token = localStorage.getItem("token");

  const {
    files,
    receivedFiles,
    peers,
    connectionEstablished,
    uploadProgress,
    receiveProgress,
    roomId,
    setRoomId,
    handleFileChange,
    handleRemove,
    sendFile,
    generateRandomRoom,
    fileSent,
  } = useFileShare(UserName, token);

  const fileInputRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const handleFileSelect = (newFiles) => {
    handleFileChange(newFiles);
    setIsSender(true);
  };

  const handleClick = () => fileInputRef.current?.click();

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* HEADER */}
      <header className="border-b border-gray-200 bg-blue-50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-bold text-lg text-blue-700">P2P File Share</h1>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/history")}
              className="flex items-center gap-2 border border-blue-200 px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 transition text-blue-700"
            >
              <History className="h-4 w-4" /> History
            </button>

            <button
              onClick={() => {
                navigate("/");
                localStorage.removeItem("token");
                localStorage.removeItem("UserName");
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
        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-6">
          <Sender
            files={isSender ? files : receivedFiles.map(f => ({ name: f.name, size: f.size }))}
            handleFileChange={handleFileSelect}
            handleRemove={handleRemove}
            sendFile={isSender ? sendFile : null}
            uploadProgress={isSender ? uploadProgress : receiveProgress}
            connectionEstablished={connectionEstablished}
            fileSent={fileSent}
            fileInputRef={fileInputRef}
            handleClick={handleClick}
            isSender={isSender}
          />
        </div>

        {/* RIGHT SECTION: Peers + Controls */}
        <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-blue-700">
            <UserPlus className="h-5 w-5 text-blue-500" /> Peers in Room
          </h2>

          {/* Room ID + Controls */}
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

          <div className="flex gap-2 mb-6">
            <button
              onClick={generateRandomRoom}
              className="flex-1 border border-blue-300 bg-blue-50 text-blue-700 rounded-lg py-2 hover:bg-blue-100 transition flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-4 w-4" /> Generate
            </button>

            <button
              onClick={() => {
                if (roomId.trim()) {
                  socket.emit("join-room", { roomId, name: UserName, token });
                  console.log("🔗 Joined room:", roomId);
                } else {
                  alert("Please enter a valid room ID");
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

