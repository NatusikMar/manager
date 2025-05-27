'use client';

import React, { useState } from 'react';
import './AddNoteModal.css';

export default function EditNoteModal({ event, onClose, onUpdated }) {
  const [name, setName] = useState(event.name);
  const [time, setTime] = useState(event.event_time?.slice(0, 5) || '');
  const [endTime, setEndTime] = useState(event.event_end_time?.slice(0, 5) || '');
  const [tag, setTag] = useState(event.tag || 'blue');
  const [error, setError] = useState('');

  const isTimeValid = (start, end) => {
    if (!start || !end) return true;
    return start <= end;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (endTime && !time) {
      setError('Укажите время начала, если задано время окончания.');
      return;
    }

    if (!isTimeValid(time, endTime)) {
      setError('Время окончания не может быть раньше времени начала.');
      return;
    }

    setError('');
    const eventDate = new Date(event.event_date).toLocaleDateString('en-CA'); // YYYY-MM-DD без смещения


  const updatedEvent = {
    name,
    event_date: eventDate,
    event_time: time || null,
    event_end_time: endTime || null,
    tag
  };


    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEvent),
        credentials: 'include',
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

        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>
          Время начала:
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </label>

        <label>
          Время окончания:
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </label>

        <select value={tag} onChange={(e) => setTag(e.target.value)}>
          <option value="blue">Синий</option>
          <option value="green">Зелёный</option>
          <option value="red">Красный</option>
        </select>

        <div className="modal-buttons">
          <button type="submit">Сохранить</button>
          <button type="button" onClick={onClose}>Отмена</button>
        </div>
      </form>
    </div>
  );
}
