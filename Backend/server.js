// // import express from "express";
// // import dotenv from "dotenv";
// // import cors from "cors";
// // import connectDB from "./config/db.js";
// // import authRoutes from "./routes/authRoute.js";

// // dotenv.config();
// // connectDB();

// // const app = express();

// // app.use(cors());
// // app.use(express.json());

// // app.use("/api/auth", authRoutes);

// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// // import express from "express";
// // import dotenv from "dotenv";
// // import cors from "cors";
// // import http from "http";
// // import { Server } from "socket.io";
// // import connectDB from "./config/db.js";
// // import authRoutes from "./routes/authRoute.js";
// // import Room from "./models/Room.js";
// // import Transfer from "./models/Transfer.js";
// // import User from "./models/User.js";

// // dotenv.config();
// // connectDB();

// // const app = express();
// // app.use(cors());
// // app.use(express.json());
// // app.use("/api/auth", authRoutes);

// // Basic REST endpoints for room / history / friends
// // app.post("/api/rooms", async (req, res) => {
// //   const { roomId, creator } = req.body;
// //   if (!roomId) return res.status(400).json({ message: "roomId required" });
// //   try {
// //     const room = new Room({ roomId, participants: creator ? [creator] : [] });
// //     await room.save();
// //     res.status(201).json(room);
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // });

// // app.get("/api/history/:username", async (req, res) => {
// //   const { username } = req.params;
// //   try {
// //     const transfers = await Transfer.find({
// //       $or: [{ sender: username }, { receiver: username }]
// //     }).sort({ timestamp: -1 });
// //     res.json(transfers);
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // });

// // // friend: add anonymous friend
// // app.post("/api/users/:username/friends", async (req, res) => {
// //   const { username } = req.params;
// //   const { name, identifier } = req.body; // identifier could be friend id or username
// //   try {
// //     const user = await User.findOne({ username });
// //     if (!user) return res.status(404).json({ message: "User not found" });
// //     user.friends.push({ name, identifier });
// //     await user.save();
// //     res.json(user.friends);
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // });

// // // create HTTP server + socket.io
// // const server = http.createServer(app);
// // const io = new Server(server, {
// //   cors: { origin: "*", methods: ["GET", "POST"] }
// // });

// // // We'll manage rooms via socket.io rooms. Each roomId maps to socket room.
// // io.on("connection", (socket) => {
// //   console.log("Socket connected:", socket.id);

// //   // join room
// //   socket.on("join-room", async ({ roomId, username }) => {
// //     socket.join(roomId);
// //     console.log(`${username} joined ${roomId}`);
// //     // add participant to Room model
// //     try {
// //       await Room.updateOne({ roomId }, { $addToSet: { participants: username } }, { upsert: true });
// //     } catch (err) { console.error(err); }
// //     // broadcast presence
// //     socket.to(roomId).emit("peer-joined", { username });
// //   });

// //   // leave room
// //   socket.on("leave-room", async ({ roomId, username }) => {
// //     socket.leave(roomId);
// //     console.log(`${username} left ${roomId}`);
// //     try {
// //       await Room.updateOne({ roomId }, { $pull: { participants: username } });
// //     } catch (err) { console.error(err); }
// //     socket.to(roomId).emit("peer-left", { username });
// //   });

// //   // offer -> send to other sockets in room
// //   socket.on("webrtc-offer", ({ roomId, offer, from }) => {
// //     socket.to(roomId).emit("webrtc-offer", { offer, from });
// //   });

// //   // answer
// //   socket.on("webrtc-answer", ({ roomId, answer, from }) => {
// //     socket.to(roomId).emit("webrtc-answer", { answer, from });
// //   });

// //   // ice candidate
// //   socket.on("webrtc-ice", ({ roomId, candidate, from }) => {
// //     socket.to(roomId).emit("webrtc-ice", { candidate, from });
// //   });

// //   // record transfer (called by sender after success)
// //   socket.on("record-transfer", async (payload) => {
// //     // payload: { sender, receiver, filename, size, roomId }
// //     try {
// //       const t = new Transfer(payload);
// //       await t.save();
// //       // optionally notify users
// //       io.to(payload.roomId).emit("transfer-recorded", t);
// //     } catch (err) {
// //       console.error("save transfer error", err);
// //     }
// //   });

// //   socket.on("disconnect", () => {
// //     console.log("Socket disconnected:", socket.id);
// //   });
// // });

// // const PORT = process.env.PORT || 5000;
// // server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// import express from "express";
// import http from "http";
// import dotenv from "dotenv";
// import cors from "cors";
// import connectDB from "./config/db.js";
// import authRoutes from "./routes/authRoute.js";
// import { setupSocket } from "./socketServer.js";

// dotenv.config();
// connectDB();

// const app = express();
// const server = http.createServer(app);
// setupSocket(server);

// app.use(cors());
// app.use(express.json());
// app.use("/api/auth", authRoutes);

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


// import express from "express";
// import http from "http";
// import dotenv from "dotenv";
// import cors from "cors";
// import connectDB from "./config/db.js";
// import authRoutes from "./routes/authRoute.js";
// import { setupSocket } from "./socketServer.js";

// dotenv.config();
// connectDB();

// const app = express();
// const server = http.createServer(app);
// setupSocket(server); // initialize WebSocket + WebRTC signaling

// app.use(cors());
// app.use(express.json());
// app.use("/api/auth", authRoutes);

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const rooms = {};

io.on("connection", (socket) => {
  console.log("New client:", socket.id);

  socket.on("join", (roomId) => {
    if (!rooms[roomId]) rooms[roomId] = [];

    // Remove disconnected peers
    rooms[roomId] = rooms[roomId].filter((id) => io.sockets.sockets.get(id));

    const isRoomEmpty = rooms[roomId].length === 0;
    rooms[roomId].push(socket.id);
    socket.join(roomId);

    socket.emit("joined", { initiator: isRoomEmpty });
    socket.to(roomId).emit("peer-joined", { id: socket.id });

    console.log(`User ${socket.id} joined ${roomId}, initiator: ${isRoomEmpty}`);
  });

  socket.on("offer", ({ roomId, offer }) => {
    console.log("📡 Offer sent from", socket.id);
    socket.to(roomId).emit("offer", { offer });
  });

  socket.on("answer", ({ roomId, answer }) => {
    console.log("📡 Answer sent from", socket.id);
    socket.to(roomId).emit("answer", { answer });
  });

  socket.on("ice-candidate", ({ roomId, candidate }) => {
    socket.to(roomId).emit("ice-candidate", { candidate });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    for (const [roomId, members] of Object.entries(rooms)) {
      rooms[roomId] = members.filter((id) => id !== socket.id);
      if (rooms[roomId].length === 0) delete rooms[roomId];
    }
  });
});

server.listen(5000, () => console.log("✅ Signaling server running on port 5000"));
