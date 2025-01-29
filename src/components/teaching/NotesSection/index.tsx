'use client'

import Switch from "../Switch";

interface NotesSectionProps {
  isNotesEnabled: boolean;
  setIsNotesEnabled: (value: boolean) => void;
  handleVideoToggle: () => void;
}

const NotesSection = ({ isNotesEnabled, setIsNotesEnabled }: NotesSectionProps) => {
  const setToggle = () => {
  setIsNotesEnabled(!isNotesEnabled)
  // handleVideoToggle()
}
  return (
    
      <div className='flex flex-1 mr-4 items-center gap-2 justify-end w-full'>
        <p>Doubts</p>
        <Switch isOn={isNotesEnabled} onToggle={setToggle} />
      </div>
    
  );
};

export default NotesSection;