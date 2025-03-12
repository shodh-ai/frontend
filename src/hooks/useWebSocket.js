// // src/hooks/useSocketIO.js
// import { useEffect, useRef, useState } from 'react';
// import { io } from 'socket.io-client';

// const useSocketIO = (baseUrl) => {
//   const [messages, setMessages] = useState([]); // Text, status, errors
//   const [responseData, setResponseData] = useState(null); // Complete AI response
//   const [wordTimings, setWordTimings] = useState([]); // Timing data
//   const [audioBlob, setAudioBlob] = useState(null); // Combined audio
//   const [isConnected, setIsConnected] = useState(false);
//   const socketRef = useRef(null);
//   const audioChunksRef = useRef([]);
//   const audioContentTypeRef = useRef('audio/mpeg'); // Default

//   useEffect(() => {
//     socketRef.current = io(baseUrl, { transports: ['websocket'] });

//     socketRef.current.on('connect', () => {
//       console.log('Socket.IO connected');
//       setIsConnected(true);
//       setMessages((prev) => [...prev, { type: 'status', data: 'Connected to server' }]);
//     });

//     socketRef.current.on('status', (status) => {
//       setMessages((prev) => [...prev, { type: 'status', data: status.message }]);
//     });

//     socketRef.current.on('text_chunk', (chunk) => {
//       setMessages((prev) => [...prev, { type: 'text', data: chunk }]);
//     });

//     socketRef.current.on('response_data', (data) => {
//       setResponseData(data);
//     });

//     socketRef.current.on('timing', (timingData) => {
//       setWordTimings(timingData);
//     });

//     socketRef.current.on('audio_header', (headerInfo) => {
//       audioChunksRef.current = []; // Reset chunks
//       audioContentTypeRef.current = headerInfo.content_type || 'audio/mpeg';
//     });

//     socketRef.current.on('audio_chunk', (chunk) => {
//       audioChunksRef.current.push(chunk); // Buffer chunks
//       console.log('Received audio chunk, total:', audioChunksRef.current.length);
//     });

//     socketRef.current.on('end', (data) => {
//       if (audioChunksRef.current.length > 0) {
//         const audioBlob = new Blob(audioChunksRef.current, { type: audioContentTypeRef.current });
//         setAudioBlob(audioBlob);
//         audioChunksRef.current = []; // Reset
//       }
//       setMessages((prev) => [...prev, { type: 'end', data: data.message }]);
//     });

//     socketRef.current.on('error', (error) => {
//       setMessages((prev) => [...prev, { type: 'error', data: error.message }]);
//     });

//     socketRef.current.on('disconnect', () => {
//       console.log('Socket.IO disconnected');
//       setIsConnected(false);
//       setMessages((prev) => [...prev, { type: 'status', data: 'Disconnected from server' }]);
//     });

//     return () => {
//       socketRef.current.disconnect();
//     };
//   }, [baseUrl]);

//   const processDoubt = (doubtData) => {
//     if (socketRef.current && isConnected) {
//       socketRef.current.emit('process-doubt', doubtData);
//       // Reset state for new request
//       setMessages([]);
//       setResponseData(null);
//       setWordTimings([]);
//       setAudioBlob(null);
//       audioChunksRef.current = [];
//     } else {
//       console.error('Socket.IO not connected');
//       setMessages((prev) => [...prev, { type: 'error', data: 'Not connected to server' }]);
//     }
//   };

//   return { messages, responseData, wordTimings, audioBlob, isConnected, processDoubt };
// };

// export default useSocketIO;


// src/hooks/useSocketIO.js
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const useSocketIO = (baseUrl) => {
  const [messages, setMessages] = useState([]); // Status and errors only
  const [responseData, setResponseData] = useState(null); // Complete AI response
  const [wordTimings, setWordTimings] = useState([]); // Timing data for subtitles
  const [audioBlob, setAudioBlob] = useState(null); // Combined audio
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContentTypeRef = useRef('audio/mpeg'); // Default

  useEffect(() => {
    socketRef.current = io(baseUrl, { transports: ['websocket'] });

    socketRef.current.on('connect', () => {
      console.log('Socket.IO connected');
      setIsConnected(true);
      setMessages((prev) => [...prev, { type: 'status', data: 'Connected to server' }]);
    });

    socketRef.current.on('status', (status) => {
      setMessages((prev) => [...prev, { type: 'status', data: status.message }]);
    });

    socketRef.current.on('text_chunk', (chunk) => {
      // No longer storing text chunks; we'll use wordTimings for subtitles
      console.log('Received text chunk:', chunk);
    });

    socketRef.current.on('response_data', (data) => {
      setResponseData(data);
    });

    socketRef.current.on('timing', (timingData) => {
      setWordTimings(timingData);
    });

    socketRef.current.on('audio_header', (headerInfo) => {
      audioChunksRef.current = []; // Reset chunks
      audioContentTypeRef.current = headerInfo.content_type || 'audio/mpeg';
    });

    socketRef.current.on('audio_chunk', (chunk) => {
      audioChunksRef.current.push(chunk); // Buffer chunks
      console.log('Received audio chunk, total:', audioChunksRef.current.length);
    });

    socketRef.current.on('end', (data) => {
      if (audioChunksRef.current.length > 0) {
        const audioBlob = new Blob(audioChunksRef.current, { type: audioContentTypeRef.current });
        setAudioBlob(audioBlob);
        audioChunksRef.current = []; // Reset
      }
      setMessages((prev) => [...prev, { type: 'end', data: data.message }]);
    });

    socketRef.current.on('error', (error) => {
      setMessages((prev) => [...prev, { type: 'error', data: error.message }]);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket.IO disconnected');
      setIsConnected(false);
      setMessages((prev) => [...prev, { type: 'status', data: 'Disconnected from server' }]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [baseUrl]);

  const processDoubt = (doubtData) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('process-doubt', doubtData);
      // Reset state for new request
      setMessages([]);
      setResponseData(null);
      setWordTimings([]);
      setAudioBlob(null);
      audioChunksRef.current = [];
    } else {
      console.error('Socket.IO not connected');
      setMessages((prev) => [...prev, { type: 'error', data: 'Not connected to server' }]);
    }
  };

  return { messages, responseData, wordTimings, audioBlob, isConnected, processDoubt };
};

export default useSocketIO;