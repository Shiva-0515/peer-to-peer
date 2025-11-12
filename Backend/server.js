// server.js
import express from "express";
import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import authRoutes from "./routes/authRoute.js";
import transferRoutes from "./routes/transferRoutes.js";
import cors from "cors";
import connectDB from "./config/db.js";
import jwt from "jsonwebtoken";

const app = express();

dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/transfers", transferRoutes);
// app.listen(5000 , console.log(`🚀 REST API Server running on port 5001`));
// Config
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || '*';

// Create standalone Socket.IO server
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST']
  }
});

// === Socket.IO Events ===
// io.on('connection', (socket) => {
//   console.log(`⚡ User connected: ${socket.id}`);

//   // Join Room
//   socket.on('join-room', (roomId) => {
//     socket.join(roomId);
//     console.log(`👥 ${socket.id} joined room: ${roomId}`);
//     socket.to(roomId).emit('user-joined', socket.id);
//   });

//   // WebRTC Signaling
//   socket.on('offer', ({ roomId, offer }) => {
//     socket.to(roomId).emit('offer', offer);
//   });

//   socket.on('answer', ({ roomId, answer }) => {
//     socket.to(roomId).emit('answer', answer);
//   });

//   socket.on('ice-candidate', ({ roomId, candidate }) => {
//     socket.to(roomId).emit('ice-candidate', candidate);
//   });

//   // File metadata broadcast (if used)
//   socket.on('file-shared', ({ roomId, fileInfo }) => {
//     io.to(roomId).emit('file-received', fileInfo);
//     console.log(`📁 File shared in room: ${roomId}`);
//   });

//   socket.on('disconnect', () => {
//     console.log(`❌ ${socket.id} disconnected`);
//   });
// });
io.on("connection", (socket) => {
  console.log(`⚡ User connected: ${socket.id}`);

  // ✅ Join Room (with username support)
  socket.on("join-room", ({ roomId, name , token }) => {
    socket.join(roomId);
    socket.roomId = roomId;
    socket.userName = name;

    if (!token) {
      console.warn(`🚫 No token provided by ${socket.id}`);
      socket.emit("unauthorized", "Missing authentication token");
      return socket.disconnect(true);
    }


    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userName = name || "Anonymous";
      socket.roomId = roomId;

      console.log(`👥 ${socket.userName} (${socket.userId}) joined room: ${roomId}`);

      socket.join(roomId);
      socket.to(roomId).emit("user-joined", { id: socket.id, name: socket.userName });
      updatePeerList(roomId);
    } catch (err) {
      console.error("❌ Invalid token:", err.message);
      socket.emit("unauthorized", "Invalid or expired token");
      socket.disconnect(true);
    }
  });

  // ✅ WebRTC Signaling Events
  socket.on("offer", ({ roomId, offer }) => {
    socket.to(roomId).emit("offer", offer);
  });

  socket.on("answer", ({ roomId, answer }) => {
    socket.to(roomId).emit("answer", answer);
  });

  socket.on("ice-candidate", ({ roomId, candidate }) => {
    socket.to(roomId).emit("ice-candidate", candidate);
  });

  socket.on("progress-update", ({ roomId, progress }) => {
    // Broadcast progress to everyone else in the same room
    socket.to(roomId).emit("progress-update", { progress });
  });
  // ✅ File metadata broadcast (optional)
  socket.on("file-shared", ({ roomId, fileInfo }) => {
    io.to(roomId).emit("file-received", fileInfo);
    console.log(`📁 File shared in room: ${roomId}`);
  });

  // ✅ Handle disconnect
  socket.on("disconnect", () => {
    console.log(`❌ ${socket.userName || socket.id} disconnected`);
    const roomId = socket.roomId;
    if (roomId) updatePeerList(roomId);
  });

  // ✅ Helper: update peer list in a room
  function updatePeerList(roomId) {
    const room = io.sockets.adapter.rooms.get(roomId);
    if (!room) return;

    const peers = Array.from(room).map((id) => {
      const s = io.sockets.sockets.get(id);
      return { id, name: s?.userName || "Anonymous" };
    });

    io.to(roomId).emit("peer-list", peers);
  }
});


// Start the Socket Server
server.listen(PORT, () => {
  console.log(`🔥 Socket.IO Server running on port ${PORT}`);
});

