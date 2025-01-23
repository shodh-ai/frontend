'use client'
import Switch from '../Switch';

interface NotesSectionProps {
  isNotesEnabled: boolean;
  setIsNotesEnabled: (value: boolean) => void;
}

const NotesSection = ({ isNotesEnabled, setIsNotesEnabled }: NotesSectionProps) => {
  return (
    <>
      
      <div className='flex flex-1 items-center gap-2 justify-end'>
        {isNotesEnabled && (
          <button className="p-2 mr-5 rounded bg-blue-500">Save Notes</button>
        )}
        <p>Notes</p>
        <Switch isOn={isNotesEnabled} onToggle={() => setIsNotesEnabled(!isNotesEnabled)} />
      </div>
    </>
  );
};

export default NotesSection;