// app/calendar_page/calendar_context.js
'use client';

import { createContext, useState, useEffect } from 'react';

export const CalendarContext = createContext();

export function CalendarProvider({ children }) {
  const [viewMode, setViewMode] = useState('month');
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [editEvent, setEditEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const toggleView = () => {
    setViewMode(viewMode === 'month' ? 'week' : 'month');
  };

  const sortEventsByPriority = () => {
    const sorted = [...events].sort((a, b) => b.priority - a.priority);
    setEvents(sorted);
  };

  const addEvent = (event) => {
    setEvents([...events, event]);
    setModalOpen(false);
  };

  const updateEvent = (updated) => {
    setEvents(events.map(e => e.id === updated.id ? updated : e));
    setEditModalOpen(false);
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(e => e.id !== id));
    setEditModalOpen(false);
  };

  return (
    <CalendarContext.Provider value={{
      viewMode,
      toggleView,
      sortEventsByPriority,
      selectedDate,
      setSelectedDate,
      events,
      addEvent,
      updateEvent,
      deleteEvent,
      editEvent,
      setEditEvent,
      modalOpen,
      setModalOpen,
      editModalOpen,
      setEditModalOpen,
    }}>
      {children}
    </CalendarContext.Provider>
  );
}
