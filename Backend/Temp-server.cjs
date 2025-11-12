// server/index.js
const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Vite dev server
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Serve nothing — React handles UI
app.use(cors());

// Signaling logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Forward WebRTC signaling messages
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("webrtc-offer", (data) => {
    socket.to(data.roomId).emit("webrtc-offer", data.offer);
  });

  socket.on("webrtc-answer", (data) => {
    socket.to(data.roomId).emit("webrtc-answer", data.answer);
  });

  socket.on("ice-candidate", (data) => {
    socket.to(data.roomId).emit("ice-candidate", data.candidate);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Signaling server running on http://localhost:${PORT}`);
});