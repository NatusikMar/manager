// app/calendar_page/SidebarMenu.jsx
'use client';

import { useContext } from 'react';
import { CalendarContext } from './calendar_context';

export default function SidebarMenu() {
  const { viewMode, toggleView, sortEventsByPriority } = useContext(CalendarContext);

  return (
    <div className="sidebar-menu">
      <button onClick={toggleView}>
        {viewMode === 'month' ? 'Неделя' : 'Месяц'}
      </button>
      {viewMode === 'week' && (
        <button className="sort-button" onClick={sortEventsByPriority}>
          Сортировать по приоритету
        </button>
      )}
    </div>
  );
}
