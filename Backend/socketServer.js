import { Server } from "socket.io";
import Room from "./models/Room.js";
import Transfer from "./models/Transfer.js";

export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 New client connected:", socket.id);

    // Join room
    socket.on("join-room", async (roomId) => {
      socket.join(roomId);
      console.log(`✅ ${socket.id} joined room ${roomId}`);

      // Add participant in DB
      await Room.updateOne(
        { roomId },
        { $addToSet: { participants: socket.id } },
        { upsert: true }
      );

      const room = await Room.findOne({ roomId });
      io.to(roomId).emit("room-users", room.participants);

      socket.to(roomId).emit("user-joined");
    });

    // Leave room
    socket.on("leave-room", async (roomId) => {
      socket.leave(roomId);
      console.log(`❌ ${socket.id} left room ${roomId}`);

      await Room.updateOne(
        { roomId },
        { $pull: { participants: socket.id } }
      );

      const room = await Room.findOne({ roomId });
      io.to(roomId).emit("room-users", room ? room.participants : []);
    });

    // WebRTC Signaling
    socket.on("offer", ({ roomId, offer }) => {
      socket.to(roomId).emit("offer", { offer });
    });

    socket.on("answer", ({ roomId, answer }) => {
      socket.to(roomId).emit("answer", { answer });
    });

    socket.on("ice-candidate", ({ roomId, candidate }) => {
      socket.to(roomId).emit("ice-candidate", { candidate });
    });

    // Record successful file transfer
    socket.on("record-transfer", async (payload) => {
      try {
        const transfer = new Transfer({
          sender: payload.sender,
          receiver: payload.receiver,
          filename: payload.filename,
          size: payload.size,
          roomId: payload.roomId,
        });
        await transfer.save();
        io.to(payload.roomId).emit("transfer-recorded", transfer);
        console.log(`💾 Recorded transfer: ${payload.filename}`);
      } catch (err) {
        console.error("❌ Transfer save error:", err);
      }
    });

    socket.on("disconnect", async () => {
      console.log("⚡ Socket disconnected:", socket.id);

      // Remove from all rooms
      await Room.updateMany(
        { participants: socket.id },
        { $pull: { participants: socket.id } }
      );

      // Notify remaining users
      const updatedRooms = await Room.find({ "participants.0": { $exists: true } });
      updatedRooms.forEach((room) => {
        io.to(room.roomId).emit("room-users", room.participants);
      });
    });
  });
};
