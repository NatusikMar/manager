// app/calendar_page/SidebarInfo.jsx
'use client';

import { useContext } from 'react';
import { CalendarContext } from './calendar_context';

export default function SidebarInfo() {
  const { selectedDate, sortEventsByPriority, viewMode } = useContext(CalendarContext);

  return (
    <div className="sidebar">
      <h3>Выбранный день:</h3>
      <p>{selectedDate || 'Не выбран'}</p>
      {viewMode === 'month' && (
        <div className="sort-controls month-sort">
          <button className="sort-button" onClick={sortEventsByPriority}>
            Сортировать по приоритету
          </button>
        </div>
      )}
    </div>
  );
}
