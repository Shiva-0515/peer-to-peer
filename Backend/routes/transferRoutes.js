import express from "express";
import Transfer from "../models/Transfer.js";

const router = express.Router();

// ✅ Log a transfer (sent or received)
router.post("/", async (req, res) => {
  try {
    const { userId, filename, size, roomId,status, direction, peerDetails } = req.body;

    if (!userId || !filename || !size|| !status || !roomId || !direction) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const transfer = new Transfer({
      userId,
      filename,
      size,
      roomId,
      status,
      direction,
      peerDetails: peerDetails || null,
    });

    await transfer.save();
    res.status(201).json({ message: "Transfer recorded", transfer });
  } catch (err) {
    console.error("❌ Error saving transfer:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 📋 Get all transfers for a user (both sent and received)
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const transfers = await Transfer.find({ userId }).sort({ timestamp: -1 });
    res.status(200).json(transfers);
  } catch (err) {
    console.error("❌ Error fetching transfers:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 📊 Get summary of sent vs received
router.get("/summary/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all transfers by that user
    const transfers = await Transfer.find({ userId }).sort({ timestamp: -1 });

    if (!transfers.length) {
      return res.status(404).json({ message: "No transfers found for this user." });
    }

    // Compute stats
    const sentTransfers = transfers.filter(t => t.direction === "sent");
    const receivedTransfers = transfers.filter(t => t.direction === "received");

    const totalSizeSent = sentTransfers.reduce((sum, t) => sum + (t.size || 0), 0);
    const totalSizeReceived = receivedTransfers.reduce((sum, t) => sum + (t.size || 0), 0);

    // Construct summary
    const summary = {
      totalTransfers: transfers.length,
      sent: sentTransfers.length,
      received: receivedTransfers.length,
      totalSizeSent,
      totalSizeReceived
    };

    // Send both summary + full transactions
    res.status(200).json({
      userId,
      summary,
      transactions: transfers.map(t => ({
        _id: t._id,
        filename: t.filename,
        size: t.size,
        roomId: t.roomId,
        status: t.status,
        direction: t.direction,
        peerDetails: t.peerDetails || "N/A",
        timestamp: t.timestamp,
      })),
    });
  } catch (err) {
    console.error("❌ Error fetching summary:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
