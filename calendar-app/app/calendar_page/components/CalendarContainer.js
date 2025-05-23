'use client';

import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../../styles/calendar_style.css';

// Кастомные стрелки
const ArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M15 6L9 12L15 18" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M9 6L15 12L9 18" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function CalendarContainer({ selectedDate, setSelectedDate }) {
  const handleChange = (date) => {
    setSelectedDate(date); // обновляем состояние в родителе
  };

  return (
    <div className="calendar-wrapper">
      <Calendar
        onChange={handleChange}
        value={selectedDate}
        locale="ru"
        next2Label={null}
        prev2Label={null}
        prevLabel={<ArrowLeft />}
        nextLabel={<ArrowRight />}
        tileClassName={({ date }) => {
          const isToday = date.toDateString() === new Date().toDateString();
          return isToday ? 'react-calendar__tile--today' : null;
        }}
      />
    </div>
  );
}
