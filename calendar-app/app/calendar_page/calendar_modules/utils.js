// utils.js

// Проверка корректности времени в формате HH:MM
export function isValidTimeFormat(time) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
}

// Сортировка событий по времени
export function sortEventsByTime(events) {
  return events.sort((a, b) => a.time.localeCompare(b.time));
}

// Сортировка событий по приоритету (например: "важное", "обычное", "низкий")
export function sortEventsByPriority(events) {
  const priorityOrder = { "важное": 1, "обычное": 2, "низкий": 3 };
  return events.sort((a, b) => (priorityOrder[a.tag] || 99) - (priorityOrder[b.tag] || 99));
}


