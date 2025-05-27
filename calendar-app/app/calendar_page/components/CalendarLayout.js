'use client';

import { useState, useRef } from 'react';
import SidebarMenu from './SidebarMenu';
import CalendarContainer from './CalendarContainer';
import NotesPanel from './NotesPanel';
import AddNoteModal from './AddNoteModal';
import '../../../styles/calendar_style.css';

export default function CalendarLayout({ username }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const notesPanelRef = useRef();

  const handleNoteAdded = () => {
    setShowModal(false);
    if (notesPanelRef.current) {
      notesPanelRef.current.refreshEvents(); // 🔁 обновляем события
    }
  };

  

  return (
    <div className="main-layout">
      <div >
      <header className="calendar-header">
        <h2>Привет, {username}!</h2>
      </header>

      <SidebarMenu
        selectedDate={selectedDate}
        onAddNote={handleNoteAdded}
        onTodayClick={() => setSelectedDate(new Date())}
      />
      </div>

      <CalendarContainer
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <NotesPanel
        ref={notesPanelRef}
        selectedDate={selectedDate}
      />

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
