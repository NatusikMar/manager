'use client';
import { useState } from "react";
import { useEventHandlers } from "./useEventHandlers";
import { useContext } from "react";
import { CalendarContext } from "../calendar_context";

export default function AddEventModal({ onClose }) {
  const { selectedDate } = useContext(CalendarContext);
  const { addEvent } = useEventHandlers();

  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [repeat, setRepeat] = useState("none");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addEvent({ date: selectedDate, time, name, tag, repeat });
    onClose();
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <h2>Добавить событие</h2>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Название" required />
        <input type="text" value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Тег" />
        <select value={repeat} onChange={(e) => setRepeat(e.target.value)}>
          <option value="none">Не повторять</option>
          <option value="daily">Каждый день</option>
        </select>
        <button type="submit">Добавить</button>
        <button type="button" onClick={onClose}>Отмена</button>
      </form>
    </div>
  );
}
