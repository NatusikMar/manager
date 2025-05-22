// app/calendar_page/WeekdaysHeader.jsx
export default function WeekdaysHeader() {
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  return (
    <div className="weekdays">
      {days.map(day => <div key={day}>{day}</div>)}
    </div>
  );
}
