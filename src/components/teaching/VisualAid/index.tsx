import React, { useState, useEffect, useRef } from 'react';
import { getTeachingData } from '@/src/services/flowApi';

interface VisualAidProps {
  visualAid: string;
  assistantReply: string;
  onNarrationComplete?: () => void;
  flowData?: string[];
  currentSubtask?: number;
  conversationHistory?: any[];
  onTeachingDataReceived?: (data: any) => void;
  isVideoPlaying?: boolean;
}

const VisualAid: React.FC<VisualAidProps> = ({ 
  visualAid, 
  assistantReply, 
  onNarrationComplete,
  flowData = [],
  currentSubtask = 0,
  conversationHistory = [],
  onTeachingDataReceived,
  isVideoPlaying = false
}) => {
  const [isNarrating, setIsNarrating] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const subtitleLinesRef = useRef<string[]>([]);
  const currentLineIndexRef = useRef(0);

  // Break text into natural sentences for subtitles
  const prepareSubtitles = (text: string) => {
    return text
      .replace(/([.!?])\s+/g, "$1|")
      .split("|")
      .filter(line => line.trim().length > 0);
  };

  const startNarration = () => {
      if (!assistantReply || !isVideoPlaying) return;
  
      // If already narrating, don't start again
      if (isNarrating && utteranceRef.current) {
        console.log('Narration already in progress');
        return;
      }
  
      // Keep existing displayed text when restarting narration
      const currentText = displayedText || '';
      
      setIsNarrating(true);
      subtitleLinesRef.current = prepareSubtitles(assistantReply);
      currentLineIndexRef.current = 0;
      
      // Only reset displayed text if we're starting fresh
      if (!currentText) {
        setDisplayedText('');
      }
  
      // Cancel any existing utterance
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
        utteranceRef.current = null;
      }

    try {
      // Create and configure utterance
      const utterance = new SpeechSynthesisUtterance(assistantReply);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Handle sentence boundaries for subtitle timing
      utterance.onboundary = (event) => {
        if (event.name === 'sentence') {
          const currentIndex = currentLineIndexRef.current;
          if (currentIndex < subtitleLinesRef.current.length) {
            setCurrentSubtitle(subtitleLinesRef.current[currentIndex]);
            setDisplayedText(prev => 
              prev + (prev ? ' ' : '') + subtitleLinesRef.current[currentIndex]
            );
            currentLineIndexRef.current++;
          }
        }
      };

      // Handle narration completion
      utterance.onend = async () => {
        console.log('Narration completed:', assistantReply.substring(0, 50) + '...');
        setIsNarrating(false);
        setCurrentSubtitle('');
        setDisplayedText(assistantReply);
        onNarrationComplete?.();

        // Make API call for next teaching data
        try {
          const nextTeachData = await getTeachingData(
            flowData,
            currentSubtask + 1,
            conversationHistory
          );
          
          if (nextTeachData) {
            onTeachingDataReceived?.(nextTeachData);
            
            // Let parent know to start next narration
            setTimeout(() => {
              if (!utteranceRef.current) {
                onNarrationComplete?.();
              }
            }, 500);
          }
        } catch (error) {
          console.error('Error fetching next teaching data:', error);
        }
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error starting narration:', error);
      setIsNarrating(false);
      setDisplayedText(assistantReply);
    }
  };

  // Handle play/pause
  useEffect(() => {
    if (isVideoPlaying && !isNarrating && utteranceRef.current === null) {
      startNarration();
    } else if (!isVideoPlaying && isNarrating) {
      window.speechSynthesis.pause();
    } else if (isVideoPlaying && isNarrating) {
      window.speechSynthesis.resume();
    }
  }, [isVideoPlaying]);

  // Handle content and narration state
  useEffect(() => {
    if (!assistantReply) return;

    // Only reset if content actually changed
    if (displayedText !== assistantReply) {
      setCurrentSubtitle('');
      setDisplayedText(assistantReply);
      
      // Cancel any existing narration
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
        utteranceRef.current = null;
      }
      setIsNarrating(false);
    }

    setIsLoading(false);

    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, [assistantReply]);

  // Handle play/pause state
  useEffect(() => {
    if (!assistantReply) return;

    if (isVideoPlaying) {
      if (!isNarrating && !utteranceRef.current) {
        // Start new narration
        startNarration();
      } else if (!isNarrating && utteranceRef.current) {
        // Resume paused narration
        window.speechSynthesis.resume();
        setIsNarrating(true);
      }
    } else {
      if (isNarrating) {
        // Pause narration
        window.speechSynthesis.pause();
        setIsNarrating(false);
      }
    }
  }, [isVideoPlaying, assistantReply]);

  if (isLoading) {
    return <div className="text-white p-4">Loading content...</div>;
  }

  return (
    <div className="h-full w-full flex flex-col">
      {/* Visual Aid Container */}
      <div
        className="flex-1 w-full bg-[#111111] p-4 rounded-lg overflow-auto [&>div]:h-full [&>div]:w-full [&_.grid]:h-full [&_.grid]:w-full [&_.grid]:grid [&_.grid]:grid-cols-2 [&_.grid]:gap-4"
        dangerouslySetInnerHTML={{ __html: visualAid }}
      />
      
      {/* Subtitle and Assistant Reply Container */}
      <div className="h-24 w-full bg-black/50 backdrop-blur-sm p-4 overflow-y-auto mt-4 rounded-lg">
        <div className="max-w-3xl mx-auto">
          {isNarrating ? (
            // Current subtitle during narration
            <p className="text-base text-white/90 whitespace-pre-wrap animate-fade-in">
              {currentSubtitle || displayedText}
            </p>
          ) : (
            // Full text when paused or complete
            <p className="text-base text-white/90 whitespace-pre-wrap">
              {displayedText || assistantReply}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualAid;