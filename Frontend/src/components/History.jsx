import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL;

export default function History() {
  const token = localStorage.getItem("token");
  // const name = localStorage.getItem("UserName");
  const [items, setItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  if (bytes < 1024 * 1024 * 1024)
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
}

  // ✅ Decode user ID from token
  useEffect(() => {
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    } catch (err) {
      console.error("❌ Invalid token:", err);
    }
  }, [token]);

  // ✅ Fetch all transfers (with details) once per user
  useEffect(() => {
    if (!userId) return;

    const fetchHistory = async () => {
      try {
        // Updated backend route (fetches all transfers with summary)
        const res = await axios.get(`${API}/api/transfers/summary/user/${userId}`);
        setItems(res.data.transactions || []);
      } catch (err) {
        console.error("❌ Error fetching transfer history:", err);
      }
    };

    fetchHistory();
  }, [userId]);

  // ✅ Apply filter before rendering
  const filteredItems =
    filter === "all" ? items : items.filter((i) => i.direction === filter);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header Section */}
      {/* <h1 className="text-3xl font-semibold">Hello {name},</h1> */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Transfer History</h2>
        <div className="flex gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm outline-none"
          >
            <option value="all">All</option>
            <option value="sent">Sent</option>
            <option value="received">Received</option>
          </select>

          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            ⬅ Back to Dashboard
          </button>
        </div>
      </div>

      {/* Transfer List */}
      {filteredItems.length === 0 ? (
        <p className="text-gray-500">No transfers yet</p>
      ) : (
        filteredItems.map((i) => (
          <div key={i._id} className="p-3 border rounded mb-2">
            <div className="flex justify-between">
              <div>
                <div className="font-medium">{i.filename}</div>
                <div
                  className="text-xs text-gray-500 cursor-pointer"
                  onClick={() =>
                    setSelectedItem(selectedItem?._id === i._id ? null : i)
                  }
                >
                  {i.direction === "sent" ? "📤 Sent" : "📥 Received"} •{" "}
                  {new Date(i.timestamp).toLocaleString()}
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {formatFileSize(i.size)}
              </div>
            </div>

            {/* ✅ Toggle summary inline */}
            {selectedItem?._id === i._id && <ShowSummary item={i} />}
          </div>
        ))
      )}
    </div>
  );
}

// ✅ Summary Component — Now purely presentational
const ShowSummary = ({ item }) => {
  return (
    <div className="p-3 bg-gray-50 rounded-md mt-2 border border-gray-200 text-xs text-gray-700">
      <p className="font-semibold text-sm mb-1">
        {item.direction === "sent" ? "📤 Sent File" : "📥 Received File"}
      </p>
      <p>Filename: {item.filename}</p>
      <p>Size: {(item.size / 1024).toFixed(2)} KB</p>
      <p>Room ID: {item.roomId}</p>
      <p>Status: {item.status}</p>
      <p>Peer: {item.peerName || "Unknown"}</p>
      <p>Time: {new Date(item.timestamp).toLocaleString()}</p>
    </div>
  );
};

