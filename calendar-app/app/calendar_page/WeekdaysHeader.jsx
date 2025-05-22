'use client';

export default function WeekdaysHeader() {
  const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  return (
    <div className="weekdays-header">
      {weekdays.map((day) => (
        <div key={day} className="weekday-cell">
          {day}
        </div>
      ))}
    </div>
  );
}
