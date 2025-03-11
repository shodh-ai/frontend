// // src/hooks/useWebSocket.js
// import { useEffect, useRef, useState } from 'react';

// const useWebSocket = (topic) => {
//   const [messages, setMessages] = useState([]); 
//   const [isConnected, setIsConnected] = useState(false);
//   const wsRef = useRef(null);

//   useEffect(() => {
//     const url = `ws://localhost:8000/ws/narration/${topic}`; 
//     wsRef.current = new WebSocket(url);

//     wsRef.current.onopen = () => {
//       console.log('WebSocket connected');
//       setIsConnected(true);
//     };

//     wsRef.current.onmessage = (event) => {
//       if (event.data instanceof Blob) {
//         // Handle audio chunks
//         setMessages((prev) => [...prev, { type: 'audio', data: event.data }]);
//       } else {
//         // Handle JSON messages
//         const data = JSON.parse(event.data);
//         setMessages((prev) => [...prev, data]);
//       }
//     };

//     wsRef.current.onerror = (error) => {
//       console.error('WebSocket error:', error);
//     };

//     wsRef.current.onclose = () => {
//       console.log('WebSocket disconnected');
//       setIsConnected(false);
//     };

//     return () => {
//       if (wsRef.current) wsRef.current.close();
//     };
//   }, [topic]); // Reconnect if topic changes

//   const sendMessage = (text, nodes = []) => {
//     if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
//       const message = JSON.stringify({ text, nodes });
//       wsRef.current.send(message);
//     } else {
//       console.error('WebSocket is not connected');
//     }
//   };

//   return { messages, isConnected, sendMessage };
// };

// export default useWebSocket;


// src/hooks/useSocketIO.js
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const useSocketIO = (baseUrl) => {
  const [messages, setMessages] = useState([]); // Text and status messages
  const [audioBlob, setAudioBlob] = useState(null); // Single audio Blob
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const audioChunksRef = useRef([]); // Store chunks until 'end'

  useEffect(() => {
    socketRef.current = io(baseUrl, { transports: ['websocket'] });

    socketRef.current.on('connect', () => {
      console.log('Socket.IO connected');
      setIsConnected(true);
    });

    socketRef.current.on('text_chunk', (chunk) => {
      setMessages((prev) => [...prev, { type: 'text', data: chunk }]);
    });

    socketRef.current.on('audio_chunk', (chunk) => {
      // Store chunk as ArrayBuffer
      audioChunksRef.current.push(chunk instanceof ArrayBuffer ? chunk : chunk.buffer);
      console.log('Received audio chunk, total chunks:', audioChunksRef.current.length);
    });

    socketRef.current.on('end', (data) => {
      // Combine chunks into a single Blob on stream end
      if (audioChunksRef.current.length > 0) {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mpeg' });
        setAudioBlob(audioBlob);
        audioChunksRef.current = []; // Reset chunks
      }
      setMessages((prev) => [...prev, { type: 'end', data }]);
    });

    socketRef.current.on('error', (error) => {
      console.error('Socket.IO error:', error);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket.IO disconnected');
      setIsConnected(false);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [baseUrl]);

  const processDoubt = (doubtData) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('process-doubt', doubtData);
      audioChunksRef.current = []; // Reset chunks for new request
      setAudioBlob(null); // Clear previous audio
    } else {
      console.error('Socket.IO not connected');
    }
  };

  return { messages, audioBlob, isConnected, processDoubt };
};

export default useSocketIO;