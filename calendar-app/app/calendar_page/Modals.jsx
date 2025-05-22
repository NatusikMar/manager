"use client";
import React from "react";

export default function Modals() {
  return (
    <>
      <div id="eventModal" className="event-modal hidden">
        <div className="modal-content">
          <h3>Добавить событие</h3>
          <div className="input-group">
            <label htmlFor="eventTime">Время</label>
            <input type="time" id="eventTime" />
            <label htmlFor="eventName">Название</label>
            <input type="text" id="eventName" placeholder="Введите событие" />
            <label htmlFor="eventTag">Категория</label>
            <select id="eventTag">
              <option value="blue">🔵 Учёба</option>
              <option value="green">🟢 Личное</option>
              <option value="red">🔴 Важно</option>
            </select>
            <label>
              <input type="checkbox" id="eventRepeatToggle" />
              Повторять
            </label>
          </div>
          <div className="input-group hidden" id="repeatOptions">
            <label htmlFor="repeatFrequency">Частота</label>
            <select id="repeatFrequency">
              <option value="yearly">Ежегодно</option>
              <option value="monthly">Ежемесячно</option>
              <option value="weekly">Еженедельно</option>
            </select>
          </div>
          <div className="modal-actions">
            <button className="auth-button" id="saveEventBtn">Добавить</button>
            <button className="auth-button cancel" id="cancelEventBtn">Отмена</button>
          </div>
        </div>
      </div>

      <div id="editModal" className="event-modal hidden">
        <div className="modal-content">
          <h3>Редактировать событие</h3>
          <div className="input-group">
            <label htmlFor="editTime">Время</label>
            <input type="time" id="editTime" />
          </div>
          <div className="input-group">
            <label htmlFor="editName">Название</label>
            <input type="text" id="editName" />
          </div>
          <div className="input-group">
            <label htmlFor="editTag">Категория</label>
            <select id="editTag">
              <option value="blue">🔵 Учёба</option>
              <option value="green">🟢 Личное</option>
              <option value="red">🔴 Важно</option>
            </select>
            <label>
              <input type="checkbox" id="eventRepeatToggle" />
              Повторять
            </label>
          </div>
          <div className="input-group hidden" id="repeatOptions">
            <label htmlFor="repeatFrequency">Частота</label>
            <select id="repeatFrequency">
              <option value="yearly">Ежегодно</option>
              <option value="monthly">Ежемесячно</option>
              <option value="weekly">Еженедельно</option>
            </select>
          </div>
          <div className="modal-actions">
            <button className="auth-button" id="saveEditBtn">Сохранить</button>
            <button className="auth-button cancel" id="cancelEditBtn">Отмена</button>
          </div>
        </div>
      </div>
    </>
  );
}
