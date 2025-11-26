// useFileShare.js
import { useState, useRef, useEffect, useCallback } from "react";
import { socket } from "../socket";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";

// export const useFileShare = (UserName, token) => {
export const useFileShare = (UserName) => {
  const [files, setFiles] = useState([]);
  const [receivedFiles, setReceivedFiles] = useState([]);
  const [connectionEstablished, setConnectionEstablished] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [fileSent, setFileSent] = useState(false);
  const [peers, setPeers] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [receiveProgress, setReceiveProgress] = useState(0);

  const peerConnection = useRef(null);
  const dataChannel = useRef(null);
  const incomingFileBuffer = useRef([]);
  const incomingFileName = useRef(null);
  const incomingFileSize = useRef(0);
  const incomingFileSender = useRef(null);
  const receivedSize = useRef(0);
  const [incomingFile, setIncomingFile] = useState(null);

  const saveTransferLog = async ({ direction, status, file, roomId, peerDetails }) => {
    const decoded = jwtDecode(localStorage.getItem("token"));
    const API = import.meta.env.VITE_BACKEND_URL;
    try {
      await axios.post(`${API}/api/transfers`, {
        userId: decoded.id,
        filename: file.name,
        size: file.size,
        roomId,
        direction,
        status,
        peerName: peerDetails?.name || null,
      });
      console.log(`📜 Transfer log saved (${direction}, ${status})`);
      toast.success(`📜 Transfer log saved (${direction}, ${status})`, {
        style: {
          width: "auto",
          border: "1px solid #1447E6",
          padding: "16px",
          color: "#1447E6",
        },
        iconTheme: {
          primary: "#1447E6",
          secondary: "#FFFAEE",
        },
        duration: 2500,
      });
    } catch (err) {
      toast.error("Error saving transfer log: " + (err.response?.data || err.message), {
        style: {
          width: "auto",
          border: "1px solid #1447E6",
          padding: "16px",
          color: "#1447E6",
        },
        iconTheme: {
          primary: "#1447E6",
          secondary: "#FFFAEE",
        },
        duration: 2500,
      });
    }
  };

  const handleFileChange = useCallback((newFiles) => {
    setFiles(newFiles);
    setFileSent(false);
  }, []);

  const handleRemove = useCallback(() => {
    setFiles([]);
    setFileSent(false);
  }, []);

  const generateRandomRoom = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?";
    let newRoomId = "";
    for (let i = 0; i < 25; i++) {
      newRoomId += chars.charAt(Math.floor(Math.random() * chars.length));
      if ((i + 1) % 5 === 0 && i !== 24) newRoomId += "-";
    }
    setRoomId(newRoomId);
    return newRoomId;
  };

  const sendFile = useCallback(async () => {
    const file = files[0];
    if (!file || !dataChannel.current || dataChannel.current.readyState !== "open") return;

    try {
      const chunkSize = 16 * 1024;
      const buffer = await file.arrayBuffer();
      const totalChunks = Math.ceil(buffer.byteLength / chunkSize);

      dataChannel.current.send(
        JSON.stringify({
          type: "file-start",
          name: file.name,
          sender: UserName,
        })
      );
      dataChannel.current.send(
        JSON.stringify({
          type: "metadata",
          name: file.name,
          size: buffer.byteLength,
          sender: UserName,
        })
      );

      let sentBytes = 0;

      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(buffer.byteLength, start + chunkSize);
        const chunk = buffer.slice(start, end);

        while (dataChannel.current.bufferedAmount > 8 * 1024 * 1024) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        try {
          dataChannel.current.send(chunk);
        } catch (err) {
          console.error("❌ Send error, retrying:", err.message);
          await new Promise((resolve) => setTimeout(resolve, 500));
          i--;
          continue;
        }

        sentBytes += chunk.byteLength;
        const progress = Math.floor((sentBytes / buffer.byteLength) * 100);
        setUploadProgress(progress);
        socket.emit("progress-update", { roomId, progress });
      }

      setUploadProgress(100);
      setFileSent(true);

      const otherPeer = peers.find((p) => p.name !== UserName) || null;

      await saveTransferLog({
        direction: "sent",
        status: "success",
        file,
        roomId,
        peerDetails: otherPeer ? { name: otherPeer.name } : { name: "Unknown" },
      });
    } catch (err) {
      console.error("❌ Error sending file:", err);
      const otherPeer = peers.find((p) => p.name !== UserName) || null;
      await saveTransferLog({
        direction: "sent",
        status: "failed",
        file,
        roomId,
        peerDetails: otherPeer ? { name: otherPeer.name } : { name: "Unknown" },
      });
    }
  }, [files, roomId, peers, UserName]);

  const setupDataChannelListeners = (channel) => {
    channel.binaryType = "arraybuffer";
    channel.onopen = () => {
      console.log("📡 Data channel open");
      setConnectionEstablished(true);
      setPeers((prev) => prev.map((p) => ({ ...p, connected: true })));
    };

    channel.onmessage = (event) => {
      if (typeof event.data === "string") {
        try {
          const message = JSON.parse(event.data);

          // show loader immediately
          if (message.type === "file-start") {
            incomingFileName.current = message.name;
            incomingFileSender.current = message.sender;

            // expose to UI
            setIncomingFile(message.name);

            return;
          }

          if (message.type === "progress") {
            setReceiveProgress(message.progress);
            return;
          }
          if (message.type === "metadata") {
            incomingFileName.current = message.name;
            incomingFileSize.current = message.size;
            incomingFileBuffer.current = [];
            receivedSize.current = 0;
            incomingFileSender.current = message.sender || "Unknown";
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
          setReceivedFiles((prev) => [...prev, { name: incomingFileName.current, url }]);
          console.log("📥 File received and assembled");
          setIncomingFile(null);
          saveTransferLog({
            direction: "received",
            status: "success",
            file: { name: incomingFileName.current, size: incomingFileSize.current },
            roomId,
            peerDetails: { name: incomingFileSender.current || (peers[0]?.name ?? "Unknown") },
          });
        }
      }
    };
  };

  // 🔹 NEW: join-room + handle room-full / unauthorized
  useEffect(() => {
    if (!roomId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to join a room.",
        {
        style: {
            border: '1px solid #1447E6',
            padding: '16px',
            color: '#1447E6',
          },
          iconTheme: {
            primary: '#1447E6',
            secondary: '#FFFAEE',
          },
      }
      );
      return;
    }

    // Tell backend we want to join
    socket.emit("join-room", { roomId, name: UserName, token });

    const handleRoomFull = (msg) => {
      console.warn("Room full:", msg);
      toast.error(msg || "Room is full. Only 2 users are allowed in this room.",
        {
        style: {
            border: '1px solid #1447E6',
            padding: '16px',
            color: '#1447E6',
          },
          iconTheme: {
            primary: '#1447E6',
            secondary: '#FFFAEE',
          },
      }
      );

      setConnectionEstablished(false);
      setPeers([]);
      setUploadProgress(0);
      setReceiveProgress(0);
      setRoomId("");

      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
    };

    const handleUnauthorized = (msg) => {
      console.warn("Unauthorized:", msg);
      toast.error(msg || "You are not authorized. Please log in again.");

      setConnectionEstablished(false);
      setPeers([]);
      setUploadProgress(0);
      setReceiveProgress(0);
      setRoomId("");

      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }

      // optional: force logout
      // localStorage.removeItem("token");
    };

    socket.on("room-full", handleRoomFull);
    socket.on("unauthorized", handleUnauthorized);

    return () => {
      socket.off("room-full", handleRoomFull);
      socket.off("unauthorized", handleUnauthorized);
    };
  }, [roomId, UserName]);

  // Existing WebRTC + signaling setup
  useEffect(() => {
    if (!roomId) return;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    peerConnection.current = pc;

    const createDataChannel = () => {
      dataChannel.current = pc.createDataChannel("file");
      setupDataChannelListeners(dataChannel.current);
    };

    pc.ondatachannel = (event) => {
      dataChannel.current = event.channel;
      setupDataChannelListeners(dataChannel.current);
    };

    pc.onicecandidate = (event) => {
      if (event.candidate)
        socket.emit("ice-candidate", { roomId, candidate: event.candidate });
    };

    socket.on("user-joined", () => {
      createDataChannel();
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .then(() => socket.emit("offer", { roomId, offer: pc.localDescription }));
    });

    socket.on("offer", async (offer) => {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", { roomId, answer });
    });

    socket.on("answer", async (answer) => {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    // FIX: Normalize ICE data shape
    socket.on("ice-candidate", async (data) => {
      try {
        let candidateObj = data.candidate || data;
        if (typeof candidateObj === "string") {
          candidateObj = { candidate: candidateObj };
        }

        if (!candidateObj.candidate) {
          console.warn("⚠️ Ignoring invalid ICE candidate:", candidateObj);
          return;
        }

        await pc.addIceCandidate(
          new RTCIceCandidate({
            candidate: candidateObj.candidate,
            sdpMid: candidateObj.sdpMid || "0",
            sdpMLineIndex: candidateObj.sdpMLineIndex || 0,
          })
        );

        console.log("✅ Added ICE candidate:", candidateObj.candidate);
      } catch (err) {
        console.error("❌ Error adding ICE candidate:", err);
      }
    });

    socket.on("peer-list", (list) => {
      setPeers(
        list.map((peer) => ({
          id: peer.id,
          name: peer.name,
          connected: false,
        }))
      );
    });

    socket.on("progress-update", ({ progress }) => {
      setReceiveProgress(progress);
    });

    return () => {
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("peer-list");
      socket.off("progress-update");
      pc.close();
    };
  }, [roomId]);

  return {
    files,
    receivedFiles,
    peers,
    connectionEstablished,
    uploadProgress,
    roomId,
    setRoomId,
    handleFileChange,
    handleRemove,
    sendFile,
    generateRandomRoom,
    fileSent,
    incomingFile,
    receiveProgress,
  };
};
