'use client';

import React, { useState } from 'react';
import './AddNoteModal.css';

export default function AddNoteModal({ selectedDate, onClose, onNoteAdded}) {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [tag, setTag] = useState('blue');
  const [isRecurring, setIsRecurring] = useState(false);
  const [repeatFrequency, setRepeatFrequency] = useState('');
  const [repeatCount, setRepeatCount] = useState(0);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate) {
      console.error('Дата не выбрана');
      return;
    }

    if (endTime && !time) {
      setError('Пожалуйста, укажите время начала, если задано время окончания.');
      return;
    }

    if (time && endTime && endTime < time) {
      setError('Время окончания не может быть раньше времени начала.');
      return;
    }

    if (isRecurring && !repeatFrequency) {
      setError('Пожалуйста, выберите период повторения.');
      return;
    }

    if (isRecurring && (repeatCount < 0 || repeatCount > 50)) {
      setError('Количество повторов должно быть от 0 до 50.');
      return;
    }

    setError('');

    // Преобразуем выбранную дату в строку формата YYYY-MM-DD
    const eventDate = selectedDate.toLocaleDateString('en-CA'); // YYYY-MM-DD


    const newEvent = {
      name,
      event_time: time || null,
      event_end_time: endTime || null,
      event_date: eventDate,
      tag,
      is_recurring: isRecurring,
      repeat_frequency: isRecurring ? repeatFrequency : null,
      repeat_count: isRecurring ? repeatCount : 0
    };

    try {
      const res = await fetch('http://localhost:3001/api/events/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
        credentials: 'include',
      });

      if (res.ok) {
        onNoteAdded();
        onClose();
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Ошибка при добавлении заметки');
      }
    } catch (err) {
      console.error('Ошибка:', err);
      setError('Ошибка подключения к серверу');
    }
  };

  return (
    <div className="modal-backdrop">
      <form className="modal" onSubmit={handleSubmit}>
        <h2>Добавить заметку</h2>

        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

        <input
          type="text"
          placeholder="Название"
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
          <option value="blue">Учеба</option>
          <option value="green">Личное</option>
          <option value="red">Важное</option>
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
          <>
            <select
              value={repeatFrequency}
              onChange={(e) => setRepeatFrequency(e.target.value)}
            >
              <option value="">Выберите период</option>
              <option value="weekly">Раз в неделю</option>
              <option value="monthly">Раз в месяц</option>
              <option value="yearly">Раз в год</option>
            </select>

            <input
              type="number"
              min={0}
              max={50}
              value={repeatCount}
              onChange={(e) => setRepeatCount(parseInt(e.target.value) || 0)}
              placeholder="Сколько раз повторить"
              required
            />
          </>
        )}

        <div className="modal-buttons">
          <button type="submit">Сохранить</button>
          <button type="button" onClick={onClose}>Отмена</button>
        </div>
      </form>
    </div>
  );
}
