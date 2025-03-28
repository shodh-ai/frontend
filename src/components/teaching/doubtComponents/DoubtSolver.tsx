// "use client";
// import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
// import { Visualisation, Element } from "../components/Visualisation";

// interface DoubtSolverProps {
//   topic: string;
//   doubt: string;
//   visualizationData: Visualisation;
//   microphoneStream: MediaStream | null;
//   onComplete: (nodes: string[], isComplete: boolean) => void;
// }

// const DoubtSolver = forwardRef(({ topic, doubt, visualizationData, microphoneStream, onComplete }: DoubtSolverProps, ref) => {
//   const [isConnected, setIsConnected] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
//   const dataChannelRef = useRef<RTCDataChannel | null>(null);
//   const audioElementRef = useRef<HTMLAudioElement | null>(null);
//   const mountedRef = useRef(true);

//   useEffect(() => {
//     mountedRef.current = true;
//     return () => {
//       mountedRef.current = false;
//       stopSession();
//     };
//   }, []);

//   const startSession = async (userDoubt: string) => {
//     try {
//       if (!topic || !userDoubt) throw new Error("Missing topic or doubt");

//       if (isConnected) {
//         sendTextMessage(userDoubt); // Send new doubt if already connected
//         return;
//       }

//       stopSession();
//       setIsConnected(false);

//       const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
//       peerConnectionRef.current = pc;

//       const audio = new Audio();
//       audioElementRef.current = audio;
//       audio.autoplay = true;

//       pc.ontrack = (e) => {
//         audio.srcObject = e.streams[0];
//         console.log("Received audio track from AI");
//       };

//       if (microphoneStream) {
//         const audioTracks = microphoneStream.getAudioTracks();
//         if (audioTracks.length > 0) pc.addTrack(audioTracks[0], microphoneStream);
//       }

//       const dc = pc.createDataChannel("oai-events");
//       dataChannelRef.current = dc;

//       dc.onopen = () => {
//         setIsConnected(true);
//         const prompt = `You are an AI assistant for a ${topic} visualization. User doubt: "${userDoubt}". Visualization data: ${JSON.stringify(
//           visualizationData
//         )}. Resolve the doubt and suggest node highlights if needed.`;
//         sendTextMessage(prompt);
//       };

//       dc.onmessage = (e) => {
//         const data = JSON.parse(e.data);
//         if (data.type === "response.audio_transcript.delta" && data.delta) {
//           const nodes = extractNodesFromText(data.delta);
//           if (nodes.length > 0) onComplete(nodes, false);
//         } else if (data.type === "response.done") {
//           onComplete([], false); // Don't end session, keep it alive
//         }
//       };

//       dc.onerror = (ev: RTCErrorEvent) => setError("Data channel error: " + ev.error.message);
//       dc.onclose = () => setIsConnected(false);

//       const offer = await pc.createOffer();
//       await pc.setLocalDescription(offer);

//       const apiKey = process.env.NEXT_PUBLIC_OPEN_AI_KEY;
//       const response = await fetch("https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17", {
//         method: "POST",
//         headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/sdp" },
//         body: offer.sdp,
//       });

//       if (!response.ok) throw new Error("Failed to negotiate SDP");
//       const sdpAnswer = await response.text();
//       await pc.setRemoteDescription({ type: "answer", sdp: sdpAnswer });
//     } catch (err) {
//       setError("Failed to start session: " + (err instanceof Error ? err.message : String(err)));
//       stopSession();
//     }
//   };

//   const stopSession = () => {
//     if (dataChannelRef.current) dataChannelRef.current.close();
//     if (peerConnectionRef.current) peerConnectionRef.current.close();
//     if (audioElementRef.current) {
//       audioElementRef.current.pause();
//       audioElementRef.current.srcObject = null;
//     }
//     setIsConnected(false);
//     dataChannelRef.current = null;
//     peerConnectionRef.current = null;
//     audioElementRef.current = null;
//   };

//   const sendTextMessage = (message: string) => {
//     if (dataChannelRef.current && dataChannelRef.current.readyState === "open") {
//       const event = {
//         type: "conversation.item.create",
//         event_id: crypto.randomUUID(),
//         item: { type: "message", role: "user", content: [{ type: "input_text", text: message }] },
//       };
//       dataChannelRef.current.send(JSON.stringify(event));
//       dataChannelRef.current.send(JSON.stringify({ type: "response.create", event_id: crypto.randomUUID() }));
//     }
//   };

//   const extractNodesFromText = (text: string): string[] => {
//     const nodes = visualizationData.elements.map((el: Element) => String(el.id));
//     return nodes.filter((node: string) => text.toLowerCase().includes(node.toLowerCase()));
//   };

//   useImperativeHandle(ref, () => ({
//     startDoubtSession: (textDoubt: string) => startSession(textDoubt),
//   }));

//   useEffect(() => {
//     if (isConnected && peerConnectionRef.current && microphoneStream) {
//       const audioTracks = microphoneStream.getAudioTracks();
//       if (audioTracks.length > 0) {
//         const senders = peerConnectionRef.current.getSenders();
//         const audioSender = senders.find((sender) => sender.track?.kind === "audio");
//         if (audioSender) {
//           audioSender.replaceTrack(audioTracks[0]);
//         } else {
//           peerConnectionRef.current.addTrack(audioTracks[0], microphoneStream);
//         }
//       }
//     }
//   }, [microphoneStream, isConnected]);

//   return null;
// });

// DoubtSolver.displayName = "DoubtSolver";
// export default DoubtSolver;


"use client";
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Visualisation, Element } from "../components/Visualisation";

interface DoubtSolverProps {
  topic: string;
  doubt: string;
  visualizationData: Visualisation;
  microphoneStream: MediaStream | null;
  onComplete: (nodes: string[], isComplete: boolean) => void;
}

const DoubtSolver = forwardRef(({ topic, doubt, visualizationData, microphoneStream, onComplete }: DoubtSolverProps, ref) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stopSession();
    };
  }, []);

  const startSession = async (userDoubt: string) => {
    try {
      if (!topic || !userDoubt) throw new Error("Missing topic or doubt");

      if (isConnected) {
        sendTextMessage(userDoubt); // Send new doubt if already connected
        return;
      }

      stopSession();
      setIsConnected(false);

      const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
      peerConnectionRef.current = pc;

      const audio = new Audio();
      audioElementRef.current = audio;
      audio.autoplay = true;

      pc.ontrack = (e) => {
        audio.srcObject = e.streams[0];
        console.log("Received audio track from AI");
      };

      if (microphoneStream) {
        const audioTracks = microphoneStream.getAudioTracks();
        if (audioTracks.length > 0) pc.addTrack(audioTracks[0], microphoneStream);
      }

      const dc = pc.createDataChannel("oai-events");
      dataChannelRef.current = dc;

      dc.onopen = () => {
        setIsConnected(true);
        const prompt = `You are an AI assistant for a ${topic} visualization. User doubt: "${userDoubt}". Visualization data: ${JSON.stringify(
          visualizationData
        )}. Resolve the doubt and suggest node highlights if needed.`;
        sendTextMessage(prompt);
      };

      dc.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.type === "response.audio_transcript.delta" && data.delta) {
          const nodes = extractNodesFromText(data.delta);
          if (nodes.length > 0) onComplete(nodes, false);
        } else if (data.type === "response.done") {
          onComplete([], false); // Keep session alive
        }
      };

      dc.onerror = (ev: RTCErrorEvent) => setError("Data channel error: " + ev.error.message);
      dc.onclose = () => setIsConnected(false);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const apiKey = process.env.NEXT_PUBLIC_OPEN_AI_KEY;
      const response = await fetch("https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/sdp" },
        body: offer.sdp,
      });

      if (!response.ok) throw new Error("Failed to negotiate SDP");
      const sdpAnswer = await response.text();
      await pc.setRemoteDescription({ type: "answer", sdp: sdpAnswer });
    } catch (err) {
      setError("Failed to start session: " + (err instanceof Error ? err.message : String(err)));
      stopSession();
    }
  };

  const stopSession = () => {
    if (dataChannelRef.current) dataChannelRef.current.close();
    if (peerConnectionRef.current) peerConnectionRef.current.close();
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.srcObject = null;
    }
    setIsConnected(false);
    dataChannelRef.current = null;
    peerConnectionRef.current = null;
    audioElementRef.current = null;
  };

  const sendTextMessage = (message: string) => {
    if (dataChannelRef.current && dataChannelRef.current.readyState === "open") {
      const event = {
        type: "conversation.item.create",
        event_id: crypto.randomUUID(),
        item: { type: "message", role: "user", content: [{ type: "input_text", text: message }] },
      };
      dataChannelRef.current.send(JSON.stringify(event));
      dataChannelRef.current.send(JSON.stringify({ type: "response.create", event_id: crypto.randomUUID() }));
    }
  };

  const extractNodesFromText = (text: string): string[] => {
    const nodes = visualizationData.elements.map((el: Element) => String(el.id));
    return nodes.filter((node: string) => text.toLowerCase().includes(node.toLowerCase()));
  };

  useImperativeHandle(ref, () => ({
    startDoubtSession: (textDoubt: string) => startSession(textDoubt),
    stopSession: () => stopSession(),
  }));

  useEffect(() => {
    if (isConnected && peerConnectionRef.current && microphoneStream) {
      const audioTracks = microphoneStream.getAudioTracks();
      if (audioTracks.length > 0) {
        const senders = peerConnectionRef.current.getSenders();
        const audioSender = senders.find((sender) => sender.track?.kind === "audio");
        if (audioSender) {
          audioSender.replaceTrack(audioTracks[0]);
        } else {
          peerConnectionRef.current.addTrack(audioTracks[0], microphoneStream);
        }
      }
    }
  }, [microphoneStream, isConnected]);

  return null;
});

DoubtSolver.displayName = "DoubtSolver";
export default DoubtSolver;