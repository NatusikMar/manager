'use client';

import React, { useState } from 'react';
import './AddNoteModal.css';

export default function EditNoteModal({ event, onClose, onUpdated }) {
  const [name, setName] = useState(event.name);
  const [time, setTime] = useState(event.event_time?.slice(0, 5) || '');
  const [endTime, setEndTime] = useState(event.event_end_time?.slice(0, 5) || '');
  const [tag, setTag] = useState(event.tag || 'blue');
  const [isRecurring, setIsRecurring] = useState(event.is_recurring ?? false);
  const [repeatFrequency, setRepeatFrequency] = useState(event.repeat_frequency ?? '');

  const [error, setError] = useState('');

  const handleRecurringChange = (checked) => {
    setIsRecurring(checked);
    if (checked && !repeatFrequency) {
      setRepeatFrequency('weekly'); // Автозаполнение
    } else if (!checked) {
      setRepeatFrequency('');
    }
  };

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

    const updatedEvent = {
      name,
      time: time || null,
      endTime: endTime || null,
      tag,
      repeat: isRecurring,
      repeat_frequency: isRecurring ? repeatFrequency : null
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

        <label>
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => handleRecurringChange(e.target.checked)}
          />
          Повторяется
        </label>

        {isRecurring && (
          <select
            value={repeatFrequency}
            onChange={(e) => setRepeatFrequency(e.target.value)}
            required
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
