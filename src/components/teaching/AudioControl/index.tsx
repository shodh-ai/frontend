'use client'
import { useState, useEffect } from 'react'
import { LuAudioLines } from 'react-icons/lu'
import { Message } from '@/src/models/DoubtModel'

interface AudioControlProps {
  mainConversationHistory: Message[]
}

const AudioControl = ({ mainConversationHistory }: AudioControlProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel()
    }
  }, [])

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const lastAssistantMessage = [...mainConversationHistory]
      .reverse()
      .find(msg => msg.role === 'assistant')

    if (!lastAssistantMessage) return

    const utterance = new SpeechSynthesisUtterance(lastAssistantMessage.content)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    
    window.speechSynthesis.speak(utterance)
    setIsSpeaking(true)
  }

  return (
    <div
      onClick={toggleSpeech}
      className={`absolute top-0 right-0 p-2 rounded-full m-2 cursor-pointer transition-colors ${
        isSpeaking ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-700'
      }`}
      title={isSpeaking ? 'Stop speaking' : 'Read assistant reply'}
    >
      <LuAudioLines size="1.5em" className='text-white' />
    </div>
  )
}

export default AudioControl