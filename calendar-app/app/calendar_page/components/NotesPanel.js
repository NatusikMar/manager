'use client';

import React, { useEffect, useState } from 'react';
import './NotesPanel.css';
import EditNoteModal from './EditNoteModal'; // создадим этот компонент

export default function NotesPanel({ selectedDate }) {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);

  const formattedDate = selectedDate.toLocaleDateString('en-CA'); // YYYY-MM-DD

  const fetchEvents = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/events/${formattedDate}`);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error('Ошибка загрузки событий:', err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [formattedDate]);

  const handleDelete = async (id) => {
    const confirmDelete = confirm('Удалить событие?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:3001/api/events/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchEvents(); // обновить список после удаления
      } else {
        console.error('Ошибка при удалении');
      }
    } catch (err) {
      console.error('Ошибка:', err);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
  };

  const handleUpdate = () => {
    setEditingEvent(null); // закрыть модалку
    fetchEvents();         // обновить список
  };

  return (
    <div className="notes-panel">
      <h3>Заметки на {formattedDate}</h3>
      <div className="notes-scroll">
        {events.length === 0 ? (
          <p className="empty">Нет событий</p>
        ) : (
          <ul className="notes-list">
            {events.map(event => (
              <li key={event.id} className="note-item">
                <span className="note-time">
                    {event.event_time && event.event_end_time && (
                    `${event.event_time.slice(0, 5)} — ${event.event_end_time.slice(0, 5)}`
                    )}
                    {event.event_time && !event.event_end_time && (
                    `${event.event_time.slice(0, 5)}`
                    )}
                    {!event.event_time && !event.event_end_time && (
                    'Весь день'
                    )}
                </span>
                <span className="note-name">{event.name}</span>
                {event.tag && <span className={`note-tag ${event.tag}`}></span>}
                {event.is_recurring && <span className="note-repeat">🔁</span>}
                <button onClick={() => handleEdit(event)}>✏️</button>
                <button onClick={() => handleDelete(event.id)}>🗑️</button>
                </li>

            ))}
          </ul>
        )}
      </div>

      {editingEvent && (
        <EditNoteModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onUpdated={handleUpdate}
        />
      )}
    </div>
  );
}
