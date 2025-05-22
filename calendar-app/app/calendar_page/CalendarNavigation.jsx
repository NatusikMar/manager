// app/calendar_page/CalendarNavigation.jsx
'use client';

import { useState } from 'react';

export default function CalendarNavigation() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const changeMonth = (direction) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newDate);
  };

  const getMonthYear = () =>
    currentMonth.toLocaleString('ru-RU', { month: 'long', year: 'numeric' });

  return (
    <div className="month-navigation">
      <button onClick={() => changeMonth(-1)}>&lt;</button>
      <h2>{getMonthYear()}</h2>
      <button onClick={() => changeMonth(1)}>&gt;</button>
    </div>
  );
}
