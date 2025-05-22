'use client';

import { useCalendar } from './calendar_context';
import { useState, useEffect } from 'react';

export default function EditEventModal({ event, onClose }) {
  const { updateEvent, deleteEvent } = useCalendar();

  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [tag, setTag] = useState('');
  const [repeat, setRepeat] = useState('');

  useEffect(() => {
    if (event) {
      setName(event.name);
      setTime(event.time);
      setTag(event.tag);
      setRepeat(event.repeat);
    }
  }, [event]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateEvent(event.id, { time, name, tag, repeat });
    onClose();
  };

  const handleDelete = async () => {
    if (confirm('Удалить событие?')) {
      await deleteEvent(event.id);
      onClose();
    }
  };

  if (!event) return null;

  return (
    <div className="modal">
      <h4>Редактировать событие</h4>
      <form onSubmit={handleUpdate}>
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
        <div className="modal-actions">
          <button type="submit">Сохранить</button>
          <button type="button" onClick={handleDelete}>Удалить</button>
          <button type="button" onClick={onClose}>Отмена</button>
        </div>
      </form>
    </div>
  );
}
