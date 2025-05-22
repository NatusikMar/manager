'use client';

import { useCalendar } from './calendar_context';

export default function SidebarMenu() {
  const { sortByPriority, setSortByPriority } = useCalendar();

  return (
    <aside className="sidebar-menu">
      <h3>Настройки</h3>
      <label>
        <input
          type="checkbox"
          checked={sortByPriority}
          onChange={(e) => setSortByPriority(e.target.checked)}
        />
        Сортировать по приоритету
      </label>
    </aside>
  );
}
