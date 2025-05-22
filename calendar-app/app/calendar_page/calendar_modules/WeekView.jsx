import { useEffect, useState } from "react";
import { createEventsTable, openAddEventModal } from "../utils/eventHandlers";

const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const monthNames = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря"
];

export default function WeekView({ weekOffset, today }) {
  const [days, setDays] = useState([]);

  useEffect(() => {
    let now = new Date();
    now.setDate(now.getDate() + weekOffset * 7);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));

    const fetchDays = async () => {
      const weekDays = [];

      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);

        const dateKey = day.toISOString().split("T")[0];
        const res = await fetch(`/api/events?date=${dateKey}`);
        const events = await res.json();

        weekDays.push({ day, events, dateKey });
      }

      setDays(weekDays);
    };

    fetchDays();
  }, [weekOffset]);

  return (
    <div className="week-container">
      {days.map(({ day, events, dateKey }, i) => {
        const isToday =
          day.getDate() === today.day &&
          day.getMonth() === today.month &&
          day.getFullYear() === today.year;

        return (
          <div key={dateKey} className={`week-day ${isToday ? "week-today" : ""}`}>
            <div className="week-day-name">{dayNames[i]}</div>
            <div>{`${day.getDate()} ${monthNames[day.getMonth()]}`}</div>
            {createEventsTable(events, dateKey)}
            <button className="add-event-btn" onClick={() => openAddEventModal(dateKey)}>
              Добавить
            </button>
          </div>
        );
      })}
    </div>
  );
}
