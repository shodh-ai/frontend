
// import React, { useState } from 'react';
// import useWebSocket from '../../hooks/useWebSocket';

// const RealTimeConnection = () => {
//   const [input, setInput] = useState('');
//   const [topic] = useState('test-topic'); // Set your topic here
//   const { messages, isConnected, sendMessage } = useWebSocket(topic);

//   const handleSend = () => {
//     if (input.trim() === '') return;
//     sendMessage(input);
//     setInput('');
//   };

//   return (
//     <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
//       <h1>Realtime Chat</h1>
//       <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
//       <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'auto', marginBottom: '10px' }}>
//         {messages.map((msg, index) => (
//           <div key={index}>
//             {msg.type === 'text' && <p>Text: {msg.data}</p>}
//             {msg.type === 'audio' && <audio controls src={URL.createObjectURL(msg.data)} />}
//           </div>
//         ))}
//       </div>
//       <input
//         type="text"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         placeholder="Type a message..."
//         disabled={!isConnected}
//         style={{ width: '70%', marginRight: '10px' }}
//       />
//       <button onClick={handleSend} disabled={!isConnected}>
//         Send
//       </button>
//     </div>
//   );
// };

// export default RealTimeConnection;

// src/components/DoubtChat.js
import React, { useState } from 'react';
import useSocketIO from '../../hooks/useWebSocket';

const DoubtChat = () => {
  const [doubt, setDoubt] = useState('');
  const backendUrl = 'http://192.168.1.100:8000'; // Your backend's IP/domain
  const { messages, audioBlob, isConnected, processDoubt } = useSocketIO(backendUrl);

  const handleSend = () => {
    if (doubt.trim() === '') return;

    const doubtData = {
      topic: 'test-topic',
      doubt: doubt,
      current_state: {},
      relevantNodes: [], // Or "nodes" if required
    };

    processDoubt(doubtData);
    setDoubt('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Doubt Chat</h1>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'auto', marginBottom: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index}>
            {msg.type === 'text' && <p>Text: {msg.data}</p>}
            {msg.type === 'end' && <p>Stream ended</p>}
          </div>
        ))}
        {audioBlob && (
          <div>
            <audio controls src={URL.createObjectURL(audioBlob)} />
          </div>
        )}
      </div>
      <textarea
        value={doubt}
        onChange={(e) => setDoubt(e.target.value)}
        placeholder="Enter your doubt..."
        disabled={!isConnected}
        rows={4}
        style={{ width: '70%', marginRight: '10px' }}
      />
      <button onClick={handleSend} disabled={!isConnected}>
        Send Doubt
      </button>
    </div>
  );
};

export default DoubtChat;