'use client'

import Switch from "../Switch";

interface NotesSectionProps {
  isNotesEnabled: boolean;
  setIsNotesEnabled: (value: boolean) => void;
}

const NotesSection = ({ isNotesEnabled, setIsNotesEnabled }: NotesSectionProps) => {
  return (
    <>
      <div className='flex flex-1 items-center gap-2 justify-end'>
        <p>Doubts</p>
        <Switch isOn={isNotesEnabled} onToggle={() => setIsNotesEnabled(!isNotesEnabled)} />
      </div>
    </>
  );
};

export default NotesSection;