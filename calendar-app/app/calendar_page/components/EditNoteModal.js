'use client';

import React, { useState } from 'react';
import './AddNoteModal.css'; // используем тот же стиль

export default function EditNoteModal({ event, onClose, onUpdated }) {
  const [name, setName] = useState(event.name);
  const [time, setTime] = useState(event.event_time?.slice(0, 5));
  const [tag, setTag] = useState(event.tag || 'blue');
  const [isRecurring, setIsRecurring] = useState(event.is_recurring);
  const [repeatFrequency, setRepeatFrequency] = useState(event.repeat_frequency || '');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedEvent = {
      name,
      time,
      tag,
      repeat: isRecurring,
    };

    try {
      const res = await fetch(`http://localhost:3001/api/events/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEvent),
      });

      if (res.ok) {
        onUpdated();
        onClose();
      } else {
        console.error('Ошибка при обновлении события');
      }
    } catch (err) {
      console.error('Ошибка:', err);
    }
  };

  return (
    <div className="modal-backdrop">
      <form className="modal" onSubmit={handleSubmit}>
        <h2>Редактировать заметку</h2>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <select value={tag} onChange={(e) => setTag(e.target.value)}>
          <option value="blue">Синий</option>
          <option value="green">Зелёный</option>
          <option value="red">Красный</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
          />
          Повторяется
        </label>

        {isRecurring && (
          <select
            value={repeatFrequency}
            onChange={(e) => setRepeatFrequency(e.target.value)}
          >
            <option value="weekly">Раз в неделю</option>
            <option value="monthly">Раз в месяц</option>
            <option value="yearly">Раз в год</option>
          </select>
        )}

        <div className="modal-buttons">
          <button type="submit">Сохранить</button>
          <button type="button" onClick={onClose}>Отмена</button>
        </div>
      </form>
    </div>
  );
}
