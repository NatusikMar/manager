'use client';

import React, { useState } from 'react';
import './AddNoteModal.css';

export default function AddNoteModal({ selectedDate, onClose, onNoteAdded }) {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [tag, setTag] = useState('blue');
  const [isRecurring, setIsRecurring] = useState(false);
  const [repeatFrequency, setRepeatFrequency] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate) {
        console.error('Дата не выбрана');
        return;
        }

        const eventDate = selectedDate.toLocaleDateString('en-CA'); // YYYY-MM-DD


    const newEvent = {
      name,
      event_time: time,
      event_date: eventDate,
      tag,
      is_recurring: isRecurring,
      repeat_frequency: isRecurring ? repeatFrequency : null,
      user_id: 1 // временно, пока не подключена авторизация
    };

    try {
      const res = await fetch('http://localhost:3001/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });

      if (res.ok) {
        onNoteAdded(); // обновить заметки
        onClose(); // закрыть модалку
      } else {
        console.error('Ошибка при добавлении заметки');
      }
    } catch (err) {
      console.error('Ошибка:', err);
    }
  };

  return (
    <div className="modal-backdrop">
      <form className="modal" onSubmit={handleSubmit}>
        <h2>Добавить заметку</h2>

        <input
          type="text"
          placeholder="Название"
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
