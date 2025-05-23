// /app/calendar_page/components/CalendarGrid.js
'use client';

import React from 'react';

export default function CalendarGrid({ days, events }) {
  return (
    <div className="calendar">
      {days.map((day, index) => (
        <div key={index} className="day">
          {day.getDate()}
          {/* Здесь можно вывести события этого дня */}
        </div>
      ))}
    </div>
  );
}
