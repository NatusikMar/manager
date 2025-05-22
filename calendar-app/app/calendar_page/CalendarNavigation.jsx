'use client';
import { useCalendar } from './calendar_context';

export default function CalendarNavigation() {
  const { currentDate, setCurrentDate, view, setView } = useCalendar();

  const changeMonth = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  const changeWeek = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7 * offset);
    setCurrentDate(newDate);
  };

  const formatted = currentDate.toLocaleDateString('default', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="calendar-nav">
      <button onClick={() => (view === 'month' ? changeMonth(-1) : changeWeek(-1))}>←</button>
      <span>{formatted}</span>
      <button onClick={() => (view === 'month' ? changeMonth(1) : changeWeek(1))}>→</button>
      <select value={view} onChange={(e) => setView(e.target.value)}>
        <option value="month">Месяц</option>
        <option value="week">Неделя</option>
      </select>
    </div>
  );
}
