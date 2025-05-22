// calendar_modules/EventsTable.jsx
"use client";
import { useContext } from "react";
import { CalendarContext } from "./calendar_context";
import { sortEventsByPriority, sortEventsByTime, getEventsForDate } from "./eventUtils";

export default function EventsTable({ date, onEdit, onDelete, includeButtons = true }) {
  const { events, sortByPriority } = useContext(CalendarContext);
  const dateKey = date.toISOString().split("T")[0];
  const allEvents = getEventsForDate(events, date);

  let sorted = sortEventsByTime(allEvents);
  if (sortByPriority) sorted = sortEventsByPriority(sorted);

  return (
    <table className="events-table">
      <thead>
        <tr>
          <th>Время</th>
          <th>Событие</th>
          {includeButtons && <th>Действия</th>}
        </tr>
      </thead>
      <tbody>
        {sorted.length === 0 ? (
          <tr>
            <td colSpan={includeButtons ? 3 : 2} className="no-events">
              Нет событий
            </td>
          </tr>
        ) : (
          sorted.map((event, index) => (
            <tr key={index}>
              <td>{event.time || "Весь день"}</td>
              <td className={`event-tag-${event.tag || "blue"}`}>{event.name}</td>
              {includeButtons && (
                <td>
                  <button className="edit-event-btn" onClick={() => onEdit(dateKey, index)}>
                    ✏ Редактировать
                  </button>
                  <button className="delete-event-btn" onClick={() => onDelete(dateKey, index)}>
                    ❌ Удалить
                  </button>
                </td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
