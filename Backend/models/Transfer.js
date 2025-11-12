import mongoose from "mongoose";

const transferSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // The current user performing the action
  filename: { type: String, required: true },
  size: { type: Number, required: true },
  roomId: { type: String, required: true },
  status : { type: String, enum: ["success","failed"], default: "success"},
  direction: { type: String, enum: ["sent", "received"], required: true }, // "sent" or "received"
  peerDetails: { type: String }, // optional (socket ID, peer name, etc.)
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Transfer", transferSchema);
