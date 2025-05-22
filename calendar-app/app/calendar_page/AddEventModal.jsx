'use client';

import { useCalendar } from './calendar_context';
import { useState } from 'react';

export default function AddEventModal() {
  const { selectedDate, addEvent } = useCalendar();
  const [name, setName] = useState('');
  const [time, setTime] = useState('12:00');
  const [tag, setTag] = useState('обычное');
  const [repeat, setRepeat] = useState('нет');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !name) return;
    const dateStr = selectedDate.slice(0, 10);
    await addEvent({ date: dateStr, time, name, tag, repeat });
    setName('');
  };

  if (!selectedDate) return null;

  return (
    <form className="modal" onSubmit={handleSubmit}>
      <h4>Добавить событие</h4>
      <input
        type="text"
        value={name}
        placeholder="Название"
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <select value={tag} onChange={(e) => setTag(e.target.value)}>
        <option value="обычное">Обычное</option>
        <option value="важное">Важное</option>
        <option value="срочное">Срочное</option>
      </select>
      <select value={repeat} onChange={(e) => setRepeat(e.target.value)}>
        <option value="нет">Не повторять</option>
        <option value="день">Каждый день</option>
        <option value="неделя">Каждую неделю</option>
      </select>
      <button type="submit">Добавить</button>
    </form>
  );
}
