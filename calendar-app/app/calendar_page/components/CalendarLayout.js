'use client';

import { useState, useRef, useEffect } from 'react';
import SidebarMenu from './SidebarMenu';
import CalendarContainer from './CalendarContainer';
import NotesPanel from './NotesPanel';
import AddNoteModal from './AddNoteModal';
import { syncNotes } from '../utils/syncOffline'; // добавим импорт
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

  useEffect(() => {
    const handleOnline = async () => {
      console.log('📶 Интернет восстановлен. Синхронизация...');
      await syncNotes();
      if (notesPanelRef.current) {
        notesPanelRef.current.refreshEvents(); // 🔁 обновляем события после синхронизации
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  return (
  <div className="main-layout">
    <header className="calendar-header">
      <h2>Привет, {username}!</h2>
    </header>

    <div className="calendar-body">
      <SidebarMenu
        selectedDate={selectedDate}
        onAddNote={handleNoteAdded}
        onTodayClick={() => setSelectedDate(new Date())}
      />

      <CalendarContainer
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <NotesPanel
        ref={notesPanelRef}
        selectedDate={selectedDate}
      />
    </div>

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
