'use client';

import { useCalendar } from './calendar_context';

export default function SidebarInfo() {
  const { selectedDate, events } = useCalendar();

  const date = new Date(selectedDate || new Date());
  const dateStr = date.toLocaleDateString();

  const dayEvents = events.filter((e) => e.date === date.toISOString().slice(0, 10));

  return (
    <aside className="sidebar-info">
      <h3>{selectedDate ? `События: ${dateStr}` : 'Выберите день'}</h3>
      <ul>
        {dayEvents.map((ev) => (
          <li key={ev.id}>
            <strong>{ev.title}</strong> <span>[{ev.priority || 0}]</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
