
// import React, { useState, useEffect } from 'react';
// import {
//   Send,        // Used for logo and send icon
//   History,     // Header button
//   LogOut,      // Header button
//   UploadCloud, // File upload area
//   Users        // "Share With" title
// } from 'lucide-react';

// // === BACKEND PLACEHOLDER ===
// // Replace this with your actual backend API's base URL
// const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
// // ===========================


// /**
//  * Main App Component
//  */
// export default function P2PFileShareUI() {
//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-900">
//       <Header />
//       <main className="p-6">
//         <div className="flex flex-col lg:flex-row gap-6">
//           <FileUploadPanel />
//           <SharePanel />
//         </div>
//       </main>
//     </div>
//   );
// }

// /**
//  * Header Component (No changes)
//  */
// function Header() {
//   return (
//     <header className="flex items-center justify-between p-4 bg-white shadow-sm border-b border-gray-200">
//       {/* Left Side: Logo, Title, Welcome, Status */}
//       <div className="flex items-center gap-4">
//         <div className="flex items-center gap-2">
//           <div className="bg-blue-600 text-white p-2 rounded-lg">
//             <Send size={20} />
//           </div>
//           <h1 className="text-xl font-bold text-gray-800">P2P File Share</h1>
//         </div>
//         <span className="text-sm text-gray-500 hidden md:block">Welcome, abc</span>
//         <span className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
//           Connected
//         </span>
//       </div>

//       {/* Right Side: History & Logout Buttons */}
//       <div className="flex items-center gap-6">
//         <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">
//           <History size={18} />
//           <span>History</span>
//         </button>
//         <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">
//           <LogOut size={18} />
//           <span>Logout</span>
//         </button>
//       </div>
//     </header>
//   );
// }

// /**
//  * File Upload Panel (No changes)
//  */
// function FileUploadPanel() {
//   return (
//     <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//       <div className="flex items-center gap-2 mb-6">
//         <UploadCloud size={20} className="text-gray-700" />
//         <h2 className="text-lg font-semibold text-gray-800">Select File to Share</h2>
//       </div>
//       <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-colors">
//         <UploadCloud size={48} className="text-gray-400 mb-4" />
//         <p className="text-gray-500">
//           Drag and drop a file here, or{' '}
//           <span className="font-medium text-blue-600">click to browse</span>
//         </p>
//         <p className="text-xs text-gray-400 mt-2">Any file size supported</p>
//       </div>
//     </div>
//   );
// }

// /**
//  * Share Panel (Right Sidebar)
//  * --- MODIFIED FOR DYNAMIC DATA AND FUNCTIONS ---
//  */
// function SharePanel() {
//   // State to manage the UI
//   const [activeTab, setActiveTab] = useState('rooms'); // 'rooms' or 'friends'
//   const [currentRoom, setCurrentRoom] = useState(null); // e.g., { id: '100' }
//   const [usersInRoom, setUsersInRoom] = useState([]); // e.g., [{ id: 'u1', name: 'xyz', status: 'In Room' }]
//   const [friendsList, setFriendsList] = useState([]); // e.g., [{ id: 'f1', name: 'friend1', status: 'Online' }]
//   const [isLoading, setIsLoading] = useState(true);
  
//   // Fetch initial data (room status, friends) on component mount
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       setIsLoading(true);
//       try {
//         // --- TODO: REPLACE WITH YOUR ACTUAL API CALLS ---
//         // Example: Fetching room and friend data simultaneously
//         // const [roomResponse, friendsResponse] = await Promise.all([
//         //   fetch(`${API_BASE_URL}/user/status`),
//         //   fetch(`${API_BASE_URL}/user/friends`)
//         // ]);
        
//         // const roomData = await roomResponse.json();
//         // const friendsData = await friendsResponse.json();
        
//         // Simulating a successful API call after 1 second
//         await new Promise(resolve => setTimeout(resolve, 1000));
        
//         // Simulated data
//         const simulatedRoomData = {
//           currentRoom: { id: '100' },
//           usersInRoom: [{ id: 'u1', name: 'xyz', status: 'In Room' }]
//         };
//         const simulatedFriendsData = {
//           friends: []
//         };
//         // --- END OF SIMULATION ---

//         // Update state with fetched data
//         if (simulatedRoomData.currentRoom) {
//           setCurrentRoom(simulatedRoomData.currentRoom);
//           setUsersInRoom(simulatedRoomData.usersInRoom);
//         }
//         setFriendsList(simulatedFriendsData.friends);

//       } catch (error) {
//         console.error("Failed to fetch initial data:", error);
//         // Handle error state in UI if needed
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     fetchInitialData();
//   }, []); // Empty dependency array means this runs once on mount

//   // Function to handle leaving a room
//   const handleLeaveRoom = async () => {
//     if (!currentRoom) return;

//     console.log(`Leaving room ${currentRoom.id}...`);
//     // Optimistic UI update: clear room state immediately
//     const oldRoom = currentRoom;
//     const oldUsers = usersInRoom;
//     setCurrentRoom(null);
//     setUsersInRoom([]);

//     try {
//       // --- TODO: REPLACE WITH YOUR ACTUAL API CALL ---
//       const response = await fetch(`${API_BASE_URL}/rooms/leave`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ roomId: oldRoom.id }),
//       });

//       if (!response.ok) {
//         // If API call fails, revert the state
//         console.error("Failed to leave room");
//         setCurrentRoom(oldRoom);
//         setUsersInRoom(oldUsers);
//         // You could show an error toast/message here
//       }
//       // If successful, state is already updated
//       console.log("Successfully left room");

//     } catch (error) {
//       console.error("Error leaving room:", error);
//       // Revert state on network error
//       setCurrentRoom(oldRoom);
//       setUsersInRoom(oldUsers);
//     }
//   };

//   return (
//     <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//       {/* Panel Title */}
//       <div className="flex items-center gap-2 mb-4">
//         <Users size={20} className="text-gray-700" />
//         <h2 className="text-lg font-semibold text-gray-800">Share With</h2>
//       </div>

//       {/* Tabs */}
//       <div className="flex border-b border-gray-200">
//         <button
//           onClick={() => setActiveTab('friends')}
//           className={`py-2 px-4 text-sm font-medium ${
//             activeTab === 'friends'
//               ? 'text-blue-600 border-b-2 border-blue-600'
//               : 'text-gray-500 hover:text-gray-700'
//           }`}
//         >
//           Friends ({friendsList.length})
//         </button>
//         <button
//           onClick={() => setActiveTab('rooms')}
//           className={`py-2 px-4 text-sm font-medium ${
//             activeTab === 'rooms'
//               ? 'text-blue-600 border-b-2 border-blue-600'
//               : 'text-gray-500 hover:text-gray-700'
//           }`}
//         >
//           Rooms
//         </button>
//       </div>

//       {/* Tab Content */}
//       <div className="py-4">
//         {isLoading ? (
//           <div className="text-center text-gray-500">Loading...</div>
//         ) : (
//           <>
//             {/* Rooms Tab Content */}
//             {activeTab === 'rooms' && (
//               <div>
//                 {currentRoom ? (
//                   <>
//                     <div className="flex items-center justify-between mb-4">
//                       <span className="text-sm text-gray-500">Current Room</span>
//                       <span className="text-sm font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-md">
//                         {currentRoom.id}
//                       </span>
//                     </div>
                    
//                     <button
//                       onClick={handleLeaveRoom}
//                       className="w-full py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-6"
//                     >
//                       Leave Room
//                     </button>

//                     <h3 className="text-sm font-medium text-gray-600 mb-3">
//                       Users in Room ({usersInRoom.length})
//                     </h3>
//                     <ul>
//                       {usersInRoom.length > 0 ? (
//                         usersInRoom.map((user) => (
//                           <UserItem key={user.id} user={user} />
//                         ))
//                       ) : (
//                         <li className="text-sm text-gray-400 text-center">
//                           You are the only one here.
//                         </li>
//                       )}
//                     </ul>
//                   </>
//                 ) : (
//                   <div className="text-center text-gray-500 p-4">
//                     You are not in a room.
//                     {/* You could add a "Join/Create Room" form here */}
//                   </div>
//                 )}
//               </div>
//             )}
            
//             {/* Friends Tab Content */}
//             {activeTab === 'friends' && (
//               <div>
//                 {friendsList.length > 0 ? (
//                   <ul>
//                     {friendsList.map((friend) => (
//                       <UserItem key={friend.id} user={friend} />
//                     ))}
//                   </ul>
//                 ) : (
//                   <div className="text-center text-gray-500 p-4">
//                     Your friends list is empty.
//                   </div>
//                 )}
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// /**
//  * User Item Component
//  * A reusable component to display a user/friend.
//  */
// function UserItem({ user }) {
//   return (
//     <li className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
//       <div className="flex items-center gap-3">
//         {/* Avatar */}
//         <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 text-gray-600 font-semibold text-sm uppercase">
//           {user.name[0]}
//         </div>
//         {/* User Info */}
//         <div>
//           <p className="font-medium text-sm text-gray-800">{user.name}</p>
//           <p className={`text-xs ${
//             user.status === 'In Room' ? 'text-green-600' : 'text-gray-500'
//           }`}>
//             {user.status}
//           </p>
//         </div>
//       </div>
//       {/* Send Icon Button (you can add onClick here to send file) */}
//       <button className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors">
//         <Send size={18} />
//       </button>
//     </li>
//   );
// }


// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import { Send, History, LogOut, UploadCloud, Users } from "lucide-react";
// import io from "socket.io-client";
// // import { socket } from "./socket";
// // import { useState, useEffect, useRef } from "react";


// // === CONFIG ===
// const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
// const socket = io(API_BASE_URL, { transports: ["websocket"] });
// // ===============

// export default function P2PFileShareUI() {
//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-900">
//       <Header />
//       <main className="p-6">
//         <div className="flex flex-col lg:flex-row gap-6">
//           <FileUploadPanel />
//           <SharePanel />
//         </div>
//       </main>
//     </div>
//   );
// }

// function Header() {
//   return (
//     <header className="flex items-center justify-between p-4 bg-white shadow-sm border-b border-gray-200">
//       <div className="flex items-center gap-4">
//         <div className="flex items-center gap-2">
//           <div className="bg-blue-600 text-white p-2 rounded-lg">
//             <Send size={20} />
//           </div>
//           <h1 className="text-xl font-bold text-gray-800">P2P File Share</h1>
//         </div>
//         <span className="text-sm text-gray-500 hidden md:block">Welcome, User</span>
//         <span className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
//           Connected
//         </span>
//       </div>

//       <div className="flex items-center gap-6">
//         <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">
//           <History size={18} />
//           <span>History</span>
//         </button>
//         <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">
//           <LogOut size={18} />
//           <span>Logout</span>
//         </button>
//       </div>
//     </header>
//   );
// }

// function FileUploadPanel() {
//   const [file, setFile] = useState(null);

//   const handleFileChange = (e) => setFile(e.target.files[0]);

//   return (
//     <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//       <div className="flex items-center gap-2 mb-6">
//         <UploadCloud size={20} className="text-gray-700" />
//         <h2 className="text-lg font-semibold text-gray-800">Select File to Share</h2>
//       </div>
//       <label className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-colors">
//         <UploadCloud size={48} className="text-gray-400 mb-4" />
//         <p className="text-gray-500">
//           Drag and drop a file here, or{" "}
//           <span className="font-medium text-blue-600">click to browse</span>
//         </p>
//         <p className="text-xs text-gray-400 mt-2">Any file size supported</p>
//         <input type="file" onChange={handleFileChange} className="hidden" />
//       </label>
//       {file && (
//         <div className="mt-4 text-sm text-gray-600">
//           Selected File: <strong>{file.name}</strong>
//         </div>
//       )}
//     </div>
//   );
// }

// function SharePanel() {
//   const [activeTab, setActiveTab] = useState("rooms");
//   const [currentRoom, setCurrentRoom] = useState(null);
//   const [roomIdInput, setRoomIdInput] = useState("");
//   const [usersInRoom, setUsersInRoom] = useState([]);
//   const [friendsList, setFriendsList] = useState([]);

//   const peerConnection = useRef(null);
//   const dataChannel = useRef(null);

//   // ✅ Setup socket listeners
//   useEffect(() => {
//     socket.on("connect", () => console.log("🟢 Connected:", socket.id));

//     socket.on("room-users", (users) => {
//       setUsersInRoom(
//         users.map((id) => ({
//           id,
//           name: id === socket.id ? "You" : id.slice(0, 5),
//           status: "In Room",
//         }))
//       );
//     });

//     socket.on("offer", async ({ offer }) => {
//       console.log("📨 Received offer");
//       const pc = createPeerConnection(currentRoom?.id);

//       await pc.setRemoteDescription(new RTCSessionDescription(offer));

//       const answer = await pc.createAnswer();
//       await pc.setLocalDescription(answer);

//       socket.emit("answer", { roomId: currentRoom?.id, answer });
//     });

//     socket.on("answer", async ({ answer }) => {
//       console.log("📨 Received answer");
//       if (peerConnection.current) {
//         await peerConnection.current.setRemoteDescription(
//           new RTCSessionDescription(answer)
//         );
//       }
//     });

//     socket.on("ice-candidate", async ({ candidate }) => {
//       if (peerConnection.current) {
//         try {
//           await peerConnection.current.addIceCandidate(
//             new RTCIceCandidate(candidate)
//           );
//         } catch (err) {
//           console.error("ICE candidate error:", err);
//         }
//       }
//     });

//     return () => {
//       socket.off("connect");
//       socket.off("room-users");
//       socket.off("offer");
//       socket.off("answer");
//       socket.off("ice-candidate");
//     };
//   }, [currentRoom]);

//   // ✅ Create peer connection
//   const createPeerConnection = (roomId) => {
//     const pc = new RTCPeerConnection();
//     peerConnection.current = pc;

//     pc.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit("ice-candidate", { roomId, candidate: event.candidate });
//       }
//     };

//     // Data channel setup
//     pc.ondatachannel = (event) => {
//       dataChannel.current = event.channel;
//       dataChannel.current.onmessage = (e) =>
//         console.log("📥 Received:", e.data);
//     };

//     dataChannel.current = pc.createDataChannel("file");
//     dataChannel.current.onopen = () => console.log("📡 Data channel open");
//     dataChannel.current.onmessage = (e) => console.log("📥 Received:", e.data);

//     return pc;
//   };

//   // ✅ Create or join room
//   const handleJoinOrCreate = async () => {
//     if (!roomIdInput.trim()) return alert("Enter Room ID");
//     const enteredId = roomIdInput.trim();

//     socket.emit("join-room", enteredId);
//     setCurrentRoom({ id: enteredId });

//     // Wait a bit to make sure signaling joined
//     setTimeout(async () => {
//       const pc = createPeerConnection(enteredId);
//       const offer = await pc.createOffer();
//       await pc.setLocalDescription(offer);
//       socket.emit("offer", { roomId: enteredId, offer });
//     }, 1000);
//   };

//   // ✅ Leave room
//   const handleLeaveRoom = () => {
//     if (currentRoom) {
//       socket.emit("leave-room", currentRoom.id);
//       setCurrentRoom(null);
//       setUsersInRoom([]);
//       setRoomIdInput("");
//     }
//   };

//   useEffect(() => {
//     setFriendsList([
//       { id: "f1", name: "Alice", status: "Online" },
//       { id: "f2", name: "Bob", status: "Offline" },
//     ]);
//   }, []);

//   return (
//     <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//       <div className="flex items-center gap-2 mb-4">
//         <Users size={20} className="text-gray-700" />
//         <h2 className="text-lg font-semibold text-gray-800">Share With</h2>
//       </div>

//       <div className="flex border-b border-gray-200">
//         <button
//           onClick={() => setActiveTab("friends")}
//           className={`py-2 px-4 text-sm font-medium ${
//             activeTab === "friends"
//               ? "text-blue-600 border-b-2 border-blue-600"
//               : "text-gray-500 hover:text-gray-700"
//           }`}
//         >
//           Friends ({friendsList.length})
//         </button>
//         <button
//           onClick={() => setActiveTab("rooms")}
//           className={`py-2 px-4 text-sm font-medium ${
//             activeTab === "rooms"
//               ? "text-blue-600 border-b-2 border-blue-600"
//               : "text-gray-500 hover:text-gray-700"
//           }`}
//         >
//           Rooms
//         </button>
//       </div>

//       <div className="py-4">
//         {activeTab === "rooms" && (
//           <>
//             {!currentRoom ? (
//               <div className="space-y-4">
//                 <input
//                   type="text"
//                   placeholder="Enter Room ID"
//                   value={roomIdInput}
//                   onChange={(e) => setRoomIdInput(e.target.value)}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <button
//                   onClick={handleJoinOrCreate}
//                   className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   Join / Create
//                 </button>
//               </div>
//             ) : (
//               <>
//                 <div className="flex items-center justify-between mb-4">
//                   <span className="text-sm text-gray-500">Current Room</span>
//                   <span className="text-sm font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-md">
//                     {currentRoom.id}
//                   </span>
//                 </div>

//                 <button
//                   onClick={handleLeaveRoom}
//                   className="w-full py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-6"
//                 >
//                   Leave Room
//                 </button>

//                 <h3 className="text-sm font-medium text-gray-600 mb-3">
//                   Users in Room ({usersInRoom.length})
//                 </h3>
//                 <ul>
//                   {usersInRoom.map((user) => (
//                     <UserItem key={user.id} user={user} />
//                   ))}
//                 </ul>
//               </>
//             )}
//           </>
//         )}

//         {activeTab === "friends" && (
//           <ul>
//             {friendsList.map((friend) => (
//               <UserItem key={friend.id} user={friend} />
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Send, History, LogOut, UploadCloud, Users, X } from "lucide-react";
import io from "socket.io-client";

// === CONFIG ===
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const socket = io(API_BASE_URL, { transports: ["websocket"] });
// ===============

export default function P2PFileShareUI() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <main className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <FileUploadPanel />
          <SharePanel />
        </div>
      </main>
    </div>
  );
}

function Header() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <Send size={20} />
          </div>
          <h1 className="text-xl font-bold text-gray-800">P2P File Share</h1>
        </div>
        <span className="text-sm text-gray-500 hidden md:block">Welcome, User</span>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
          isConnected 
            ? "bg-green-100 text-green-700" 
            : "bg-red-100 text-red-700"
        }`}>
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </div>

      <div className="flex items-center gap-6">
        <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">
          <History size={18} />
          <span className="hidden sm:inline">History</span>
        </button>
        <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">
          <LogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

function FileUploadPanel() {
  const [file, setFile] = useState(null);
  const [connectionEstablished, setConnectionEstablished] = useState(false);
  const [fileSent, setFileSent] = useState(false);
  const [receivedFiles, setReceivedFiles] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);

  const dataChannel = useRef(null);
  const incomingFileBuffer = useRef([]);
  const incomingFileName = useRef(null);
  const incomingFileSize = useRef(0);
  const receivedSize = useRef(0);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileSent(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setFileSent(false);
  };

  const sendFile = useCallback(async () => {
    if (!file || !dataChannel.current || dataChannel.current.readyState !== "open") return;

    const chunkSize = 16 * 1024;
    const buffer = await file.arrayBuffer();
    const totalChunks = Math.ceil(buffer.byteLength / chunkSize);

    dataChannel.current.send(
      JSON.stringify({ type: "metadata", name: file.name, size: buffer.byteLength })
    );

    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(buffer.byteLength, start + chunkSize);
      const chunk = buffer.slice(start, end);
      dataChannel.current.send(chunk);
    }

    console.log("✅ File sent successfully");
    setFileSent(true);

    setTimeout(() => {
      setFileSent(false);
      setFile(null);
    }, 3000);
  }, [file]);

  // Listen for data channel from SharePanel
  useEffect(() => {
    const handleDataChannel = (event) => {
      const { channel, room, connectionStatus } = event.detail;
      dataChannel.current = channel;
      setCurrentRoom(room);
      setConnectionEstablished(connectionStatus);
    };

    window.addEventListener("dataChannelReady", handleDataChannel);
    
    return () => {
      window.removeEventListener("dataChannelReady", handleDataChannel);
    };
  }, []);

  // Setup data channel listeners
  useEffect(() => {
    if (!dataChannel.current) return;

    const channel = dataChannel.current;
    channel.binaryType = "arraybuffer";

    const handleMessage = (event) => {
      if (typeof event.data === "string") {
        try {
          const message = JSON.parse(event.data);
          if (message.type === "metadata") {
            incomingFileName.current = message.name;
            incomingFileSize.current = message.size;
            incomingFileBuffer.current = [];
            receivedSize.current = 0;
          }
        } catch (err) {
          console.error("Invalid JSON:", err);
        }
      } else {
        incomingFileBuffer.current.push(new Uint8Array(event.data));
        receivedSize.current += event.data.byteLength;

        if (receivedSize.current === incomingFileSize.current) {
          const receivedBlob = new Blob(incomingFileBuffer.current);
          const url = URL.createObjectURL(receivedBlob);
          setReceivedFiles((prev) => [
            ...prev,
            { name: incomingFileName.current || "unknown", url },
          ]);
          console.log("📥 File received and assembled");
        }
      }
    };

    channel.addEventListener("message", handleMessage);

    return () => {
      channel.removeEventListener("message", handleMessage);
    };
  }, [dataChannel.current]);

  return (
    <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <UploadCloud size={20} className="text-gray-700" />
        <h2 className="text-lg font-semibold text-gray-800">Select File to Share</h2>
        {currentRoom && (
          <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            Room: {currentRoom}
          </span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
      />

      {!file ? (
        <label 
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-colors"
        >
          <UploadCloud size={48} className="text-gray-400 mb-4" />
          <p className="text-gray-500">
            Drag and drop a file here, or{" "}
            <span className="font-medium text-blue-600">click to browse</span>
          </p>
          <p className="text-xs text-gray-400 mt-2">Any file size supported</p>
        </label>
      ) : (
        <div className="border border-gray-200 rounded-lg p-4 relative">
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="mb-4">
            <p className="text-gray-700 font-medium truncate">{file.name}</p>
            <p className="text-sm text-gray-500 mt-1">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
            <p className="text-sm mt-2 text-gray-500">
              {connectionEstablished ? "✅ Ready to send" : "⏳ Waiting for peer..."}
            </p>
          </div>

          <button
            onClick={sendFile}
            disabled={!connectionEstablished || fileSent}
            className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
              !connectionEstablished || fileSent
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {fileSent ? "✔️ Sent" : connectionEstablished ? "Send File" : "Waiting for Peer..."}
          </button>
        </div>
      )}

      {/* Received Files */}
      {receivedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Received Files ({receivedFiles.length})
          </h3>
          <div className="space-y-2">
            {receivedFiles.map((receivedFile, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-gray-50 border border-gray-200 p-3 rounded-lg"
              >
                <span className="truncate max-w-[70%] text-sm text-gray-700">
                  {receivedFile.name}
                </span>
                <a
                  href={receivedFile.url}
                  download={receivedFile.name}
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SharePanel() {
  const [activeTab, setActiveTab] = useState("rooms");
  const [currentRoom, setCurrentRoom] = useState(null);
  const [roomIdInput, setRoomIdInput] = useState("");
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [friendsList] = useState([
    { id: "f1", name: "Alice", status: "Online" },
    { id: "f2", name: "Bob", status: "Offline" },
  ]);

  const peerConnection = useRef(null);
  const dataChannel = useRef(null);

  // Setup data channel listeners
  const setupDataChannelListeners = (channel) => {
    channel.binaryType = "arraybuffer";

    channel.onopen = () => {
      console.log("📡 Data channel open");
      // Notify FileUploadPanel
      window.dispatchEvent(new CustomEvent("dataChannelReady", {
        detail: { 
          channel, 
          room: currentRoom?.id,
          connectionStatus: true 
        }
      }));
    };

    channel.onclose = () => {
      console.log("📡 Data channel closed");
      window.dispatchEvent(new CustomEvent("dataChannelReady", {
        detail: { 
          channel: null, 
          room: null,
          connectionStatus: false 
        }
      }));
    };
  };

  // Create peer connection
  const createPeerConnection = (roomId) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" }
      ],
    });

    peerConnection.current = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { roomId, candidate: event.candidate });
      }
    };

    // Handle incoming data channel
    pc.ondatachannel = (event) => {
      dataChannel.current = event.channel;
      setupDataChannelListeners(dataChannel.current);
    };

    pc.oniceconnectionstatechange = () => {
      console.log("🌐 ICE state:", pc.iceConnectionState);
    };

    // Create outgoing data channel
    dataChannel.current = pc.createDataChannel("file");
    setupDataChannelListeners(dataChannel.current);

    return pc;
  };

  // Setup socket listeners
  useEffect(() => {
    socket.on("room-users", (users) => {
      setUsersInRoom(
        users.map((id) => ({
          id,
          name: id === socket.id ? "You" : id.slice(0, 8),
          status: "In Room",
        }))
      );
    });

    socket.on("user-joined", async () => {
      console.log("👤 User joined room");
      if (peerConnection.current && currentRoom) {
        try {
          const offer = await peerConnection.current.createOffer();
          await peerConnection.current.setLocalDescription(offer);
          socket.emit("offer", { roomId: currentRoom.id, offer });
        } catch (err) {
          console.error("Error creating offer:", err);
        }
      }
    });

    socket.on("offer", async ({ offer }) => {
      console.log("📨 Received offer");
      if (!currentRoom) return;

      const pc = createPeerConnection(currentRoom.id);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answer", { roomId: currentRoom.id, answer });
    });

    socket.on("answer", async ({ answer }) => {
      console.log("📨 Received answer");
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      }
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      if (peerConnection.current) {
        try {
          await peerConnection.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        } catch (err) {
          console.error("ICE candidate error:", err);
        }
      }
    });

    return () => {
      socket.off("room-users");
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, [currentRoom]);

  // Join or create room
  const handleJoinOrCreate = async () => {
    if (!roomIdInput.trim()) return alert("Enter Room ID");
    const enteredId = roomIdInput.trim();

    socket.emit("join-room", enteredId);
    setCurrentRoom({ id: enteredId });

    // Create peer connection
    createPeerConnection(enteredId);
  };

  // Leave room
  const handleLeaveRoom = () => {
    if (currentRoom) {
      socket.emit("leave-room", currentRoom.id);
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
      if (dataChannel.current) {
        dataChannel.current.close();
        dataChannel.current = null;
      }
      setCurrentRoom(null);
      setUsersInRoom([]);
      setRoomIdInput("");
    }
  };

  return (
    <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Users size={20} className="text-gray-700" />
        <h2 className="text-lg font-semibold text-gray-800">Share With</h2>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("friends")}
          className={`py-2 px-4 text-sm font-medium transition-colors ${
            activeTab === "friends"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Friends ({friendsList.length})
        </button>
        <button
          onClick={() => setActiveTab("rooms")}
          className={`py-2 px-4 text-sm font-medium transition-colors ${
            activeTab === "rooms"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Rooms
        </button>
      </div>

      <div className="py-4">
        {activeTab === "rooms" && (
          <>
            {!currentRoom ? (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter Room ID"
                  value={roomIdInput}
                  onChange={(e) => setRoomIdInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleJoinOrCreate()}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleJoinOrCreate}
                  className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Join / Create Room
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-600">Current Room</span>
                  <span className="text-sm font-bold text-blue-700">
                    {currentRoom.id}
                  </span>
                </div>

                <button
                  onClick={handleLeaveRoom}
                  className="w-full py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-6"
                >
                  Leave Room
                </button>

                <h3 className="text-sm font-medium text-gray-600 mb-3">
                  Users in Room ({usersInRoom.length})
                </h3>
                <ul className="space-y-2">
                  {usersInRoom.map((user) => (
                    <UserItem key={user.id} user={user} />
                  ))}
                </ul>
              </>
            )}
          </>
        )}

        {activeTab === "friends" && (
          <ul className="space-y-2">
            {friendsList.map((friend) => (
              <UserItem key={friend.id} user={friend} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function UserItem({ user }) {
  return (
    <li className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
          {user.name[0]}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">{user.name}</p>
          <p className={`text-xs ${
            user.status === "Online" || user.status === "In Room"
              ? "text-green-600"
              : "text-gray-400"
          }`}>
            {user.status}
          </p>
        </div>
      </div>
      {user.status === "Online" && (
        <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors">
          Share
        </button>
      )}
    </li>
  );
}
