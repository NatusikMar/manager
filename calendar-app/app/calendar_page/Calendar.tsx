'use client';

import { useState, useEffect } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, format, isSameMonth, isSameDay } from 'date-fns';
import CalendarHeader from './CalendarHeader';
import DayCell from './DayCell';
import { CalendarEvent } from './types';
import api from '../api/client';
import styles from '../../styles/calendar.module.css';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get(`/events/${format(currentDate, 'yyyy-MM-dd')}`);
        setEvents(res.data);
      } catch (err) {
        console.error('Ошибка загрузки событий:', err);
      }
    };

    fetchEvents();
  }, [currentDate]);

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  return (
    <div className={styles.calendar}>
      <CalendarHeader
        currentDate={currentDate}
        onNext={() => setCurrentDate(addMonths(currentDate, 1))}
        onPrev={() => setCurrentDate(subMonths(currentDate, 1))}
      />
      <div className={styles.grid}>
        {days.map(day => (
          <DayCell key={day.toISOString()} date={day} events={events.filter(e => e.date === format(day, 'yyyy-MM-dd'))} />
        ))}
      </div>
    </div>
  );
}
