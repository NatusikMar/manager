// app/calendar_page/utils.js
export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export function isToday(today, day, month, year) {
  return (
    today.getDate() === day &&
    today.getMonth() === month &&
    today.getFullYear() === year
  );
}

export function getWeekDays(weekOffset = 0) {
  const now = new Date();
  now.setDate(now.getDate() + weekOffset * 7);
  const monday = new Date(now.setDate(now.getDate() - now.getDay() + 1));

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    return day;
  });
}
