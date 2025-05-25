'use client';

import { useEffect } from 'react';

import { useState } from 'react';
import SidebarMenu from './SidebarMenu';
import CalendarContainer from './CalendarContainer';
import NotesPanel from './NotesPanel';
import AddNoteModal from './AddNoteModal'; // подключи модальное окно
import '../../../styles/calendar_style.css';

export default function CalendarLayout({ username }){
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);

  // Обновление при добавлении новой заметки
  const handleNoteAdded = () => {
    setShowModal(false);
    setSelectedDate(new Date(selectedDate)); // триггер перерисовки NotesPanel
  };

  return (
    <div className="main-layout">
      <header className="calendar-header">
        <h2>Привет, {username}!</h2>
      </header>
      <SidebarMenu
        selectedDate={selectedDate}
        onAddNote={handleNoteAdded}
        onTodayClick={() => setSelectedDate(new Date())}
        />


      <CalendarContainer
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <NotesPanel selectedDate={selectedDate} />

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
