'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const CalendarContext = createContext();

export function CalendarProvider({ children }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [view, setView] = useState('month');
  const [sortByPriority, setSortByPriority] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('events');
    if (stored) setEvents(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const addEvent = (event) => {
    setEvents((prev) => [...prev, event]);
  };

  const updateEvent = (updatedEvent) => {
    setEvents((prev) =>
      prev.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev))
    );
  };

  const deleteEvent = (eventId) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== eventId));
  };

  return (
    <CalendarContext.Provider
      value={{
        currentDate,
        setCurrentDate,
        selectedDate,
        setSelectedDate,
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        view,
        setView,
        sortByPriority,
        setSortByPriority,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export const useCalendar = () => useContext(CalendarContext);
