// import { useState, useEffect } from "react";
// import { ArrowLeft, Search, Clock } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const History = () => {
//   const navigate = useNavigate();
//   const [history, setHistory] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filteredHistory, setFilteredHistory] = useState([]);

//   // Placeholder: fetch transfer history from backend
//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         // TODO: Replace this with backend API call
//         // const response = await fetch("/api/history");
//         // const data = await response.json();
//         const data = []; // placeholder
//         setHistory(data);
//         setFilteredHistory(data);
//       } catch (error) {
//         console.error("Error fetching history:", error);
//       }
//     };
//     fetchHistory();
//   }, []);

//   // Search logic
//   useEffect(() => {
//     if (searchQuery.trim() === "") {
//       setFilteredHistory(history);
//     } else {
//       setFilteredHistory(
//         history.filter((item) =>
//           item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           item.username.toLowerCase().includes(searchQuery.toLowerCase())
//         )
//       );
//     }
//   }, [searchQuery, history]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-200 via-white to-gray-100">
//       {/* Header */}
//       <header className="border-b bg-white/70 backdrop-blur-md sticky top-0 z-10 shadow-sm">
//         <div className="max-w-5xl mx-auto px-4 py-4">
//           <button
//             onClick={() => navigate("/dashboard")}
//             className="flex items-center text-gray-700 hover:text-black mb-4"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Dashboard
//           </button>
//           <div>
//             <h1 className="text-3xl font-bold mb-1">Transfer History</h1>
//             <p className="text-gray-500">
//               View all your sent and received files
//             </p>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <div className="max-w-5xl mx-auto px-4 py-8">
//         <div className="bg-white shadow-md rounded-xl p-6">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
//             <h2 className="text-xl font-semibold">Your Transfers</h2>
//             <div className="relative mt-4 sm:mt-0 w-full sm:w-64">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search by filename or username..."
//                 className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* History List or Empty State */}
//           {filteredHistory.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
//               <Clock className="h-16 w-16 text-gray-400 mb-4" />
//               <h3 className="text-lg font-semibold mb-2">
//                 No transfer history yet
//               </h3>
//               <p className="text-sm max-w-sm">
//                 Your sent and received files will appear here once you start sharing.
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {filteredHistory.map((item, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
//                 >
//                   <div>
//                     <p className="font-medium text-gray-800">{item.filename}</p>
//                     <p className="text-xs text-gray-500">
//                       Shared with {item.username} — {item.date}
//                     </p>
//                   </div>
//                   <span
//                     className={`px-3 py-1 text-xs font-semibold rounded-full ${
//                       item.type === "sent"
//                         ? "bg-blue-100 text-blue-600"
//                         : "bg-green-100 text-green-600"
//                     }`}
//                   >
//                     {item.type}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default History;


import React, { useEffect, useState } from "react";
import axios from "axios";
const API = import.meta.env.VITE_API;

export default function History(){
  const username = localStorage.getItem("username");
  const [items, setItems] = useState([]);
  useEffect(()=>{
    if(!username) return;
    axios.get(`${API}/api/history/${username}`).then(res=>setItems(res.data)).catch(()=>{});
  },[username]);
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Transfer History</h2>
      {items.length===0 ? <p className="text-gray-500">No transfers yet</p> : items.map(i=>(
        <div key={i._id} className="p-3 border rounded mb-2 flex justify-between">
          <div>
            <div className="font-medium">{i.filename}</div>
            <div className="text-xs text-gray-500">{i.sender} → {i.receiver} • {new Date(i.timestamp).toLocaleString()}</div>
          </div>
          <div className="text-sm text-gray-600">{(i.size/1024).toFixed(2)} KB</div>
        </div>
      ))}
    </div>
  );
}

