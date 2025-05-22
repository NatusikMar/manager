// calendar_modules/eventUtils.js
export function isValidTimeFormat(time) {
  if (!time) return true;
  const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
  return timeRegex.test(time);
}

export function sortEventsByTime(eventsArray) {
  return eventsArray.slice().sort((a, b) => {
    const timeA = a.time === "Весь день" ? "00:00" : a.time;
    const timeB = b.time === "Весь день" ? "00:00" : b.time;
    return timeA.localeCompare(timeB);
  });
}

export function sortEventsByPriority(eventsArray) {
  const priorityOrder = { red: 1, blue: 2, green: 3 };
  return eventsArray.slice().sort((a, b) => {
    const aPriority = priorityOrder[a.tag] || 999;
    const bPriority = priorityOrder[b.tag] || 999;
    return aPriority - bPriority;
  });
}

export function getEventsForDate(events, date) {
  const key = date.toISOString().split("T")[0];
  let result = events[key] ? [...events[key]] : [];

  for (const storedDate in events) {
    if (storedDate === key) continue;
    events[storedDate].forEach((event) => {
      if (!event.repeat) return;

      const [year, month, day] = storedDate.split("-").map(Number);
      const original = new Date(year, month - 1, day);

      if (
        (event.repeat === "yearly" &&
          original.getDate() === date.getDate() &&
          original.getMonth() === date.getMonth()) ||
        (event.repeat === "monthly" && original.getDate() === date.getDate()) ||
        (event.repeat === "weekly" && original.getDay() === date.getDay())
      ) {
        result.push({ ...event, _repeat: true });
      }
    });
  }

  return result;
}
