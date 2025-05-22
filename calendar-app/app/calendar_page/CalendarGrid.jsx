// app/calendar_page/CalendarGrid.jsx
'use client';

import { useContext } from 'react';
import { CalendarContext } from './calendar_context';
import { getDaysInMonth, getWeekDays, isToday } from './utils';

export default function CalendarGrid() {
  const {
    state,
    setSelectedDate,
    showEventsForDate,
    addEvent,
    createEventsTable
  } = useContext(CalendarContext);

  const today = new Date();

  if (state.isWeekView) {
    return <WeekView />;
  } else {
    return <MonthView />;
  }

  function MonthView() {
    const firstDay = (new Date(state.currentYear, state.currentMonth, 1).getDay() + 6) % 7;
    const daysInMonth = getDaysInMonth(state.currentYear, state.currentMonth);

    const cells = [];

    // Пустые клетки перед началом месяца
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="day-cell empty" />);
    }

    // Дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
      const isCurrent =
        isToday(today, day, state.currentMonth, state.currentYear);

      const handleClick = () => {
        const selected = new Date(state.currentYear, state.currentMonth, day);
        setSelectedDate(selected);
        showEventsForDate(selected, `${day} ${formatMonthYear()}`);
      };

      cells.push(
        <div
          key={day}
          className={`day-cell ${isCurrent ? 'today' : ''}`}
          onClick={handleClick}
        >
          {day}
        </div>
      );
    }

    return <div className="calendar">{cells}</div>;
  }

  function WeekView() {
    const weekDays = getWeekDays(state.weekOffset);

    return (
      <div className="calendar">
        {weekDays.map((day, i) => {
          const dateKey = day.toISOString().split('T')[0];
          const isCurrent = isToday(today, day.getDate(), day.getMonth(), day.getFullYear());
          const monthNames = [
            'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
            'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
          ];

          return (
            <div key={dateKey} className={`day-cell ${isCurrent ? 'today' : ''}`}>
              <div className="week-day-name">{['Пн','Вт','Ср','Чт','Пт','Сб','Вс'][i]}</div>
              <div>{`${day.getDate()} ${monthNames[day.getMonth()]}`}</div>
              {createEventsTable(dateKey)}
              <button className="add-event-btn" onClick={() => addEvent(dateKey)}>
                Добавить
              </button>
            </div>
          );
        })}
      </div>
    );
  }

  function formatMonthYear() {
    return new Date(state.currentYear, state.currentMonth).toLocaleString('ru-RU', {
      month: 'long',
      year: 'numeric',
    });
  }
}
