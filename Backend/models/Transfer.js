import mongoose from "mongoose";

const transferSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  filename: String,
  size: Number,
  roomId: String,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Transfer", transferSchema);
