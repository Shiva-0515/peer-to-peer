// import { useState, useRef, useEffect } from "react";
// import io from "socket.io-client";

// const socket = io("http://localhost:5000");

// export default function P2PMini() {
//   const [roomId, setRoomId] = useState("");
//   const [connected, setConnected] = useState(false);
//   const [ready, setReady] = useState(false);
//   const [isInitiator, setIsInitiator] = useState(false);

//   const pc = useRef(null);
//   const dataChannel = useRef(null);
//   const hasOffer = useRef(false); // avoid double SDP creation

//   const createPeerConnection = (initiator) => {
//     pc.current = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });

//     pc.current.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit("ice-candidate", { roomId, candidate: event.candidate });
//       }
//     };

//     pc.current.onconnectionstatechange = () => {
//       console.log("🔗 Connection state:", pc.current.connectionState);
//       if (pc.current.connectionState === "connected") setConnected(true);
//     };

//     if (initiator) {
//       dataChannel.current = pc.current.createDataChannel("chat");
//       setupDataChannel();
//     } else {
//       pc.current.ondatachannel = (event) => {
//         dataChannel.current = event.channel;
//         setupDataChannel();
//       };
//     }
//   };

//   const setupDataChannel = () => {
//     const dc = dataChannel.current;
//     dc.onopen = () => {
//       console.log("✅ Data channel open");
//       setReady(true);
//     };
//     dc.onclose = () => console.log("❌ Data channel closed");
//     dc.onerror = (err) => console.error("⚠️ Data channel error:", err);
//     dc.onmessage = (event) => {
//       console.log("📩 Received:", event.data);
//     };
//   };

//   const joinRoom = () => {
//     if (!roomId.trim()) return alert("Enter a room ID");
//     socket.emit("join", roomId);
//   };

//   useEffect(() => {
//     socket.on("joined", async ({ initiator }) => {
//       console.log("Joined room, initiator:", initiator);
//       setIsInitiator(initiator);
//       createPeerConnection(initiator);

//       // Only initiator creates and sends offer
//       if (initiator && !hasOffer.current) {
//         hasOffer.current = true;
//         const offer = await pc.current.createOffer();
//         await pc.current.setLocalDescription(offer);
//         socket.emit("offer", { roomId, offer });
//       }
//     });

//     socket.on("peer-joined", () => {
//       console.log("👥 Another peer joined the room");
//     });

//     socket.on("offer", async ({ offer }) => {
//       console.log("📨 Received offer");
//       if (!pc.current) createPeerConnection(false);
//       await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
//       const answer = await pc.current.createAnswer();
//       await pc.current.setLocalDescription(answer);
//       socket.emit("answer", { roomId, answer });
//     });

//     socket.on("answer", async ({ answer }) => {
//       console.log("📨 Received answer");
//       if (!pc.current) return;
//       if (!pc.current.currentRemoteDescription) {
//         await pc.current.setRemoteDescription(new RTCSessionDescription(answer));
//       }
//     });

//     socket.on("ice-candidate", async ({ candidate }) => {
//       if (candidate && pc.current) {
//         try {
//           await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
//         } catch (err) {
//           console.error("❄️ ICE error:", err);
//         }
//       }
//     });

//     return () => {
//       socket.off("joined");
//       socket.off("peer-joined");
//       socket.off("offer");
//       socket.off("answer");
//       socket.off("ice-candidate");
//     };
//   }, [roomId]);

//   const sendMessage = () => {
//     if (dataChannel.current?.readyState === "open") {
//       const msg = "Hello from " + (isInitiator ? "initiator" : "receiver");
//       dataChannel.current.send(msg);
//       console.log("📤 Sent:", msg);
//     } else {
//       alert("Channel not open yet!");
//     }
//   };

//   return (
//     <div style={{ padding: 30 }}>
//       <h2>Mini WebRTC Room</h2>
//       <input
//         placeholder="Enter room ID"
//         value={roomId}
//         onChange={(e) => setRoomId(e.target.value)}
//       />
//       <button onClick={joinRoom}>Join</button>

//       {connected && ready ? (
//         <button onClick={sendMessage}>Send Hello</button>
//       ) : (
//         <p>{connected ? "🔄 Waiting for data channel..." : "🕓 Waiting for peer..."}</p>
//       )}
//     </div>
//   );
// }

import { useState, useRef, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function P2PMini() {
  const [roomId, setRoomId] = useState("");
  const [connected, setConnected] = useState(false);
  const [ready, setReady] = useState(false);
  const [isInitiator, setIsInitiator] = useState(false);

  const pc = useRef(null);
  const dataChannel = useRef(null);

  const createPeerConnection = (initiator) => {
    pc.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { roomId, candidate: event.candidate });
      }
    };

    pc.current.oniceconnectionstatechange = () => {
      console.log("ICE State:", pc.current.iceConnectionState);
      if (pc.current.iceConnectionState === "connected") {
        setConnected(true);
      }
    };

    if (initiator) {
      dataChannel.current = pc.current.createDataChannel("chat");
      setupDataChannel();
    } else {
      pc.current.ondatachannel = (event) => {
        console.log("📡 Data channel received on receiver side");
        dataChannel.current = event.channel;
        setupDataChannel();
      };
    }
  };

  const setupDataChannel = () => {
    const dc = dataChannel.current;
    dc.onopen = () => {
      console.log("✅ Data channel open");
      setReady(true);
    };
    dc.onclose = () => console.log("❌ Data channel closed");
    dc.onerror = (err) => console.error("⚠️ Data channel error:", err);
    dc.onmessage = (event) => console.log("📩 Message:", event.data);
  };

  const joinRoom = () => {
    if (!roomId.trim()) return alert("Enter room ID");
    socket.emit("join", roomId);
  };

  useEffect(() => {
    socket.on("joined", async ({ initiator }) => {
      console.log("Joined room, initiator:", initiator);
      setIsInitiator(initiator);
      createPeerConnection(initiator);

      if (initiator) {
        const offer = await pc.current.createOffer();
        await pc.current.setLocalDescription(offer);
        socket.emit("offer", { roomId, offer });
      }
    });

    socket.on("offer", async ({ offer }) => {
      console.log("📨 Received offer");
      if (!pc.current) createPeerConnection(false);
      await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.current.createAnswer();
      await pc.current.setLocalDescription(answer);
      socket.emit("answer", { roomId, answer });
    });

    socket.on("answer", async ({ answer }) => {
      console.log("📨 Received answer");
      await pc.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      if (candidate && pc.current) {
        try {
          await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error("❄️ ICE error:", err);
        }
      }
    });

    return () => {
      socket.off("joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, [roomId]);

  const sendMessage = () => {
    if (dataChannel.current?.readyState === "open") {
      dataChannel.current.send("Hello from " + (isInitiator ? "initiator" : "receiver"));
    } else {
      alert("Channel not open yet!");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Mini WebRTC Room</h2>
      <input
        placeholder="Enter room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={joinRoom}>Join</button>

      {ready ? (
        <>
          <p>✅ Connected & Ready</p>
          <button onClick={sendMessage}>Send Hello</button>
        </>
      ) : connected ? (
        <p>🔄 Waiting for data channel...</p>
      ) : (
        <p>🕓 Waiting for peer...</p>
      )}
    </div>
  );
}
