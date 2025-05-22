import { useEffect, useState } from "react";
import { showEventsForDate } from "../utils/showEvents";

export default function MonthView({ year, month, today }) {
  const [selectedDay, setSelectedDay] = useState(null);

  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handleSelect = (day) => {
    setSelectedDay(day);
    const selectedDate = new Date(year, month, day);
    showEventsForDate(
      selectedDate,
      `${day} ${new Date(year, month).toLocaleString("ru-RU", {
        month: "long",
        year: "numeric",
      })}`
    );
  };

  useEffect(() => {
    const defaultDate = new Date();
    showEventsForDate(
      defaultDate,
      `Сегодня, ${defaultDate.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
      })}`
    );
  }, []);

  const cells = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push(
      <div key={`empty-${i}`} className="day invisible" />
    );
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const isToday =
      day === today.day && month === today.month && year === today.year;
    const isSelected = day === selectedDay;

    cells.push(
      <div
        key={day}
        className={`day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
        onClick={() => handleSelect(day)}
      >
        {day}
      </div>
    );
  }

  return <div className="calendar-grid">{cells}</div>;
}
