'use client'
import { LuAudioLines } from 'react-icons/lu'

const AudioControl = () => {
  return (
    <div 
      className='absolute top-0 right-0 bg-gray-800 p-2 rounded-full m-2 cursor-pointer hover:bg-gray-700'
    >
      <LuAudioLines size="1.5em" className='text-white' />
    </div>
  )
}

export default AudioControl