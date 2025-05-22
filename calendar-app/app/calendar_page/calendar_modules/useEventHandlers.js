'use client';
import { useContext } from "react";
import { CalendarContext } from "../calendar_context";

export const useEventHandlers = () => {
  const { setEvents, selectedDate, setSelectedEvent } = useContext(CalendarContext);

  const loadEvents = async (date) => {
    try {
      const res = await fetch(`http://localhost:3001/events/${date}`);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Ошибка загрузки событий:", err);
    }
  };

  const addEvent = async (event) => {
    try {
      await fetch(`http://localhost:3001/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      });
      await loadEvents(event.date);
    } catch (err) {
      console.error("Ошибка при добавлении события:", err);
    }
  };

  const updateEvent = async (id, event) => {
    try {
      await fetch(`http://localhost:3001/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      });
      await loadEvents(selectedDate);
    } catch (err) {
      console.error("Ошибка при обновлении события:", err);
    }
  };

  const deleteEvent = async (id) => {
    try {
      await fetch(`http://localhost:3001/events/${id}`, {
        method: "DELETE",
      });
      await loadEvents(selectedDate);
      setSelectedEvent(null);
    } catch (err) {
      console.error("Ошибка при удалении события:", err);
    }
  };

  return {
    loadEvents,
    addEvent,
    updateEvent,
    deleteEvent,
  };
};
