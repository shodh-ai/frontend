
// src/components/DoubtChat.js
import React, { useState, useRef, useEffect } from 'react';
import useSocketIO from '../../hooks/useWebSocket';

const DoubtChat = () => {
  const [doubt, setDoubt] = useState('');
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const backendUrl = 'https://7e8c-2405-201-300c-7d-bd9c-7aa-87e7-d974.ngrok-free.app'; // Replace with your backend's IP and port
  const { messages, responseData, wordTimings, audioBlob, isConnected, processDoubt } = useSocketIO(backendUrl);
  const audioRef = useRef(null);

  // Sync subtitles with audio playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || wordTimings.length === 0) return;

    const updateSubtitle = () => {
      const currentTime = audio.currentTime * 1000; // Convert to ms
      const currentWord = wordTimings.find(
        (timing) => currentTime >= timing.start_time && currentTime <= timing.end_time
      );
      setCurrentSubtitle(currentWord ? currentWord.word : '');
    };

    audio.addEventListener('timeupdate', updateSubtitle);
    return () => audio.removeEventListener('timeupdate', updateSubtitle);
  }, [wordTimings]);

  const handleSend = () => {
    if (doubt.trim() === '') return;

    const doubtData = {
      topic: 'test-topic', // Adjust as needed
      doubt: doubt,
      current_state: {
        highlightedElements: [],
        currentTime: 0,
        isOriginalNarration: true,
        currentNarration: '',
      },
      relevantNodes: [], // Add nodes if applicable
    };

    processDoubt(doubtData);
    setDoubt('');
    setCurrentSubtitle(''); // Reset subtitle
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Doubt Chat</h1>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>

      {/* Input */}
      <textarea
        value={doubt}
        onChange={(e) => setDoubt(e.target.value)}
        placeholder="Enter your doubt..."
        disabled={!isConnected}
        rows={4}
        style={{ width: '70%', marginRight: '10px', marginBottom: '10px', color:"black" }}
      />
      <button onClick={handleSend} disabled={!isConnected}>
        Send Doubt
      </button>

      {/* Messages (Status and Errors Only) */}
      <div style={{ border: '1px solid #ccc', padding: '10px', height: '100px', overflowY: 'auto', marginTop: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index}>
            {msg.type === 'status' && <p style={{ color: 'gray' }}>{msg.data}</p>}
            {msg.type === 'error' && <p style={{ color: 'red' }}>Error: {msg.data}</p>}
            {msg.type === 'end' && <p style={{ color: 'green' }}>{msg.data}</p>}
          </div>
        ))}
      </div>

      {/* Response Data */}
      {responseData && (
        <div style={{ marginTop: '10px' }}>
          <h3>Response</h3>
          <p><strong>Explanation:</strong> {responseData.explanation}</p>
          {responseData.comprehensionQuestions && (
            <ul>
              {responseData.comprehensionQuestions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Audio and Subtitles */}
      {audioBlob && (
        <div style={{ marginTop: '10px' }}>
          <h3>Audio Response</h3>
          <audio ref={audioRef} controls src={URL.createObjectURL(audioBlob)} />
          {wordTimings.length > 0 && (
            <div style={{ marginTop: '10px', fontSize: '1.2em', fontWeight: 'bold', color: 'blue' }}>
              <p>Subtitle: {currentSubtitle || 'Waiting...'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DoubtChat;