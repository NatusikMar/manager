'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const CalendarContext = createContext();

export function useCalendar() {
  return useContext(CalendarContext);
}

export function CalendarProvider({ children }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [view, setView] = useState('month');
  const [sortByPriority, setSortByPriority] = useState(false);
  const [events, setEvents] = useState([]);

  const fetchEventsForDate = async (date) => {
    const dateStr = date.toISOString().slice(0, 10);
    try {
      const res = await fetch(`http://localhost:3001/api/events/${dateStr}`);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error('Ошибка загрузки событий:', err);
    }
  };

  useEffect(() => {
    fetchEventsForDate(currentDate);
  }, [currentDate]);

  const addEvent = async (event) => {
    try {
      const res = await fetch(`http://localhost:3001/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
      const newEvent = await res.json();
      setEvents((prev) => [...prev, newEvent]);
    } catch (err) {
      console.error('Ошибка добавления события:', err);
    }
  };

  const updateEvent = async (id, updated) => {
    try {
      const res = await fetch(`http://localhost:3001/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const updatedEvent = await res.json();
      setEvents((prev) => prev.map((e) => (e.id === id ? updatedEvent : e)));
    } catch (err) {
      console.error('Ошибка обновления события:', err);
    }
  };

  const deleteEvent = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/events/${id}`, { method: 'DELETE' });
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error('Ошибка удаления события:', err);
    }
  };

  return (
    <CalendarContext.Provider
      value={{
        currentDate,
        setCurrentDate,
        selectedDate,
        setSelectedDate,
        view,
        setView,
        sortByPriority,
        setSortByPriority,
        events,
        fetchEventsForDate,
        addEvent,
        updateEvent,
        deleteEvent,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}
