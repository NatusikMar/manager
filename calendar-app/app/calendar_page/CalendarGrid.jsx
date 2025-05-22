'use client';
import { useCalendar } from './calendar_context';
import { useEffect, useMemo } from 'react';
import './calendar.css';

export default function CalendarGrid() {
  const {
    currentDate,
    events,
    view,
    setSelectedDate,
    sortByPriority,
  } = useCalendar();

  // Генерация массива дней текущего месяца или недели
  const days = useMemo(() => {
    const date = new Date(currentDate);
    const result = [];

    if (view === 'month') {
      date.setDate(1);
      const firstDayIndex = date.getDay() || 7;
      const startDate = new Date(date);
      startDate.setDate(startDate.getDate() - firstDayIndex + 1);

      for (let i = 0; i < 42; i++) {
        const day = new Date(startDate);
        day.setDate(startDate.getDate() + i);
        result.push(day);
      }
    } else {
      const start = new Date(currentDate);
      const day = start.getDay() || 7;
      start.setDate(start.getDate() - day + 1);
      for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        result.push(d);
      }
    }

    return result;
  }, [currentDate, view]);

  const getEventsForDay = (day) => {
    const iso = day.toISOString().slice(0, 10);
    let filtered = events.filter(
      (event) => event.date === iso
    );
    if (sortByPriority) {
      filtered = filtered.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    }
    return filtered;
  };

  return (
    <div className={`calendar-grid ${view}`}>
      {days.map((day, idx) => {
        const iso = day.toISOString().slice(0, 10);
        const isToday = iso === new Date().toISOString().slice(0, 10);
        const dayEvents = getEventsForDay(day);

        return (
          <div
            key={idx}
            className={`calendar-cell ${isToday ? 'today' : ''}`}
            onClick={() => setSelectedDate(iso)}
          >
            <div className="cell-date">{day.getDate()}</div>
            <ul className="cell-events">
              {dayEvents.map((ev) => (
                <li key={ev.id} className={`event priority-${ev.priority || 0}`}>
                  {ev.title}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
