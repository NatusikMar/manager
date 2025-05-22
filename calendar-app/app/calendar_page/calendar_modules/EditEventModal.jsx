'use client';
import { useState, useEffect } from "react";
import { useEventHandlers } from "./useEventHandlers";
import { useContext } from "react";
import { CalendarContext } from "../calendar_context";

export default function EditEventModal({ onClose }) {
  const { selectedEvent } = useContext(CalendarContext);
  const { updateEvent, deleteEvent } = useEventHandlers();

  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [repeat, setRepeat] = useState("none");

  useEffect(() => {
    if (selectedEvent) {
      setTime(selectedEvent.time);
      setName(selectedEvent.name);
      setTag(selectedEvent.tag || "");
      setRepeat(selectedEvent.repeat || "none");
    }
  }, [selectedEvent]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateEvent(selectedEvent.id, { time, name, tag, repeat });
    onClose();
  };

  const handleDelete = async () => {
    await deleteEvent(selectedEvent.id);
    onClose();
  };

  return (
    <div className="modal">
      <form onSubmit={handleUpdate}>
        <h2>Редактировать событие</h2>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="text" value={tag} onChange={(e) => setTag(e.target.value)} />
        <select value={repeat} onChange={(e) => setRepeat(e.target.value)}>
          <option value="none">Не повторять</option>
          <option value="daily">Каждый день</option>
        </select>
        <button type="submit">Сохранить</button>
        <button type="button" onClick={handleDelete}>Удалить</button>
        <button type="button" onClick={onClose}>Отмена</button>
      </form>
    </div>
  );
}
