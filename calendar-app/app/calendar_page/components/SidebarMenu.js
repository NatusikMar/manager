'use client';

import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle
} from 'react';
import AddNoteModal from './AddNoteModal';

export default function SidebarMenu({ selectedDate, onAddNote, onTodayClick }) {
  const [showModal, setShowModal] = useState(false);

  const handleNoteAdded = () => {
    setShowModal(false);
    if (onAddNote) onAddNote(); // обновим заметки в родителе
  };

  return (
    <div className="sidebar-menu">
      <button onClick={onTodayClick}>Сегодня</button>
      <button onClick={() => setShowModal(true)}>Добавить заметку</button>

      {showModal && (
        <AddNoteModal
          selectedDate={selectedDate}
          onClose={() => setShowModal(false)}
          onNoteAdded={handleNoteAdded}
        />
      )}
    </div>
  );
}
