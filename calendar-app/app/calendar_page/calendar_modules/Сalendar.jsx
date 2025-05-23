'use client';

import { useContext } from 'react';
import { CalendarContext } from '../calendar_context';

export default function Calendar({ onAddEvent }) {
  const {
    viewMode,
    toggleView,
    selectedDate,
    setSelectedDate,
    events,
  } = useContext(CalendarContext);

  const eventsForSelectedDate = selectedDate
    ? events.filter(event => event.date === selectedDate)
    : [];

  return (
    <div className="calendar-wrapper">
      <div className="calendar-header">
        <button onClick={toggleView}>
          Переключить на {viewMode === 'month' ? 'неделю' : 'месяц'}
        </button>
        <button onClick={onAddEvent}>Добавить событие</button>
      </div>

      <div className="calendar-body">
        <h2>Выбранная дата: {selectedDate || 'не выбрана'}</h2>

        {eventsForSelectedDate.length > 0 ? (
          <ul>
            {eventsForSelectedDate.map(event => (
              <li key={event.id}>
                <strong>{event.title}</strong> — {event.time} (приоритет: {event.priority})
              </li>
            ))}
          </ul>
        ) : (
          <p>Нет событий на эту дату.</p>
        )}
      </div>
    </div>
  );
}
