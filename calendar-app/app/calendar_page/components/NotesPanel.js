'use client';

import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import './NotesPanel.css';
import EditNoteModal from './EditNoteModal';
import {
  getOfflineEventsByDate,
  deleteQueuedNote,
} from '../utils/localDB';

const NotesPanel = forwardRef(({ selectedDate }, ref) => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [sortType, setSortType] = useState('time');

  const formattedDate = selectedDate.toLocaleDateString('en-CA');

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/data/${formattedDate}`, {
        credentials: 'include',
      });

      if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`);

      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Неверный формат данных');

      const filtered = data
        .filter(event => new Date(event.event_date).toLocaleDateString('en-CA') === formattedDate)
        .map(event => ({
          ...event,
          fromCache: false,
          is_recurring: !!event.repeat_interval,
        }));

      const offlineEvents = await getOfflineEventsByDate(formattedDate);
      setEvents([...filtered, ...offlineEvents]);
    } catch (err) {
      console.warn('Оффлайн. Загружаю только локальные события:', err);
      const offlineEvents = await getOfflineEventsByDate(formattedDate);
      setEvents(offlineEvents);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [formattedDate]);

  useImperativeHandle(ref, () => ({
    refreshEvents: fetchEvents,
  }));

  const handleDelete = async (id, isOffline, queueId) => {
    if (!confirm('Удалить событие?')) return;

    try {
      if (isOffline && queueId != null) {
        await deleteQueuedNote(queueId);
        fetchEvents();
      } else if (navigator.onLine) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (res.ok) fetchEvents();
        else console.error('Ошибка при удалении');
      } else {
        console.warn('Оффлайн: не могу удалить событие с сервера');
      }
    } catch (err) {
      console.error('Ошибка удаления:', err);
    }
  };

  const handleEdit = (event) => setEditingEvent(event);
  const handleUpdate = () => {
    setEditingEvent(null);
    fetchEvents();
  };

  const sortedEvents = [...events].sort((a, b) => {
    if (sortType === 'time') {
      return (a.event_time || '').localeCompare(b.event_time || '');
    } else if (sortType === 'important') {
      const priority = { red: 1, blue: 2, green: 3, null: 4 };
      return (priority[a.tag] || 4) - (priority[b.tag] || 4);
    }
    return 0;
  });

  return (
    <div className="notes-panel">
      <h3>Заметки на {formattedDate}</h3>

      <div className="filters">
        <label htmlFor="sortSelect">Сортировка:</label>
        <select
          id="sortSelect"
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="time">По времени</option>
          <option value="important">По важности</option>
        </select>
      </div>

      <div className="notes-scroll">
        {sortedEvents.length === 0 ? (
          <p className="empty">Нет событий</p>
        ) : (
          <ul className="notes-list list">
            {sortedEvents.map(event => (
              <li
                key={event.id || event.queueId}
                className={`note-item list
                  ${event.isOffline ? 'offline' : ''}
                  ${event.fromCache ? 'local' : ''}
                `}
              >
                <div className="note-header">
                  {event.fromCache && (
                    <span className="cache-indicator" title="Кэшированное событие"></span>
                  )}
                  <span className="note-time">
                    {event.event_time && event.event_end_time
                      ? `${event.event_time.slice(0, 5)} — ${event.event_end_time.slice(0, 5)}`
                      : event.event_time
                        ? `${event.event_time.slice(0, 5)}`
                        : 'Весь день'}
                  </span>
                </div>

                <div className="note-name">{event.name}</div>

                {event.tag && (
                  <span className={`note-tag ${event.tag}`}>
                    {event.tag === 'red' && 'Важное'}
                    {event.tag === 'green' && 'Личное'}
                    {event.tag === 'blue' && 'Учёба'}
                  </span>
                )}

                <div className="note-actions">
                  {!navigator.onLine && !event.local ? (
                <span className="readonly-info">📄 Только просмотр</span>
              ) : (
                <>
                  <button onClick={() => handleEdit(event)}>✏️</button>
                  <button onClick={() => handleDelete(event.id, event.isOffline, event.queueId)}>🗑️</button>
                </>
              )}


                </div>
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
});

export default NotesPanel;
