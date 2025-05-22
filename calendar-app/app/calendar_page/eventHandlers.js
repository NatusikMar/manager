"use client";

import { state } from "./calendar_modules/state";
import { renderCalendar } from "./calendar_modules/render";
import { isValidTimeFormat, sortEventsByTime, sortEventsByPriority } from "./calendar_modules/utils";

// Отправка DELETE-запроса на сервер
export async function deleteEvent(id) {
  await fetch(`/api/events/${id}`, { method: "DELETE" });
  renderCalendar();
}

// Открытие формы создания события
export function openAddEventModal(dateKey) {
  const modal = document.getElementById("eventModal");
  const timeInput = document.getElementById("eventTime");
  const nameInput = document.getElementById("eventName");
  const tagSelect = document.getElementById("eventTag");
  const repeatToggle = document.getElementById("eventRepeatToggle");
  const repeatOptions = document.getElementById("repeatOptions");
  const repeatFrequency = document.getElementById("repeatFrequency");
  const saveBtn = document.getElementById("saveEventBtn");
  const cancelBtn = document.getElementById("cancelEventBtn");

  timeInput.value = "";
  nameInput.value = "";
  tagSelect.value = "blue";
  repeatToggle.checked = false;
  repeatOptions.classList.add("hidden");

  repeatToggle.onchange = () => {
    repeatOptions.classList.toggle("hidden", !repeatToggle.checked);
  };

  modal.classList.remove("hidden");

  saveBtn.onclick = async () => {
    const time = timeInput.value || "";
    const name = nameInput.value.trim();
    const tag = tagSelect.value;
    const repeat = repeatToggle.checked ? repeatFrequency.value : null;

    if (!name) return;
    if (!isValidTimeFormat(time)) {
      alert("Введите время в формате ЧЧ:ММ");
      return;
    }

    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: dateKey, time, name, tag, repeat }),
    });

    modal.classList.add("hidden");
    renderCalendar();
  };

  cancelBtn.onclick = () => {
    modal.classList.add("hidden");
  };
}

// Открытие формы редактирования события
export function openEditEventModal(event) {
  const modal = document.getElementById("editModal");
  const timeInput = document.getElementById("editTime");
  const nameInput = document.getElementById("editName");
  const tagSelect = document.getElementById("editTag");
  const saveBtn = document.getElementById("saveEditBtn");
  const cancelBtn = document.getElementById("cancelEditBtn");

  timeInput.value = event.time !== "Весь день" ? event.time : "";
  nameInput.value = event.name;
  tagSelect.value = event.tag || "blue";

  modal.classList.remove("hidden");

  saveBtn.onclick = async () => {
    const newTime = timeInput.value || "";
    const newName = nameInput.value.trim();
    const newTag = tagSelect.value;

    if (!newName) return;
    if (!isValidTimeFormat(newTime)) {
      alert("Введите время в формате ЧЧ:ММ");
      return;
    }

    await fetch(`/api/events/${event.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        time: newTime,
        name: newName,
        tag: newTag,
      }),
    });

    modal.classList.add("hidden");
    renderCalendar();
  };

  cancelBtn.onclick = () => {
    modal.classList.add("hidden");
  };
}

// Получение и отображение событий
export async function showEventsForDate(date, dayText) {
  const selectedDateElement = document.getElementById("selectedDate");
  selectedDateElement.textContent = dayText;

  const sidebar = document.getElementById("eventInfo");
  sidebar.querySelectorAll("table, .add-event-btn").forEach(el => el.remove());

  const dateKey = date.toISOString().split("T")[0];

  const res = await fetch(`/api/events?date=${dateKey}`);
  const events = await res.json();

  const eventsTable = createEventsTable(events, dateKey);
  const addBtn = document.createElement("button");
  addBtn.textContent = "Добавить";
  addBtn.classList.add("add-event-btn");
  addBtn.onclick = () => openAddEventModal(dateKey);

  sidebar.appendChild(eventsTable);
  sidebar.appendChild(addBtn);
}

// Таблица событий
export function createEventsTable(events, dateKey) {
  const table = document.createElement("table");
  table.classList.add("events-table");

  table.innerHTML = `
    <tr>
      <th>Время</th>
      <th>Событие</th>
      <th>Действия</th>
    </tr>
  `;

  let sorted = sortEventsByTime(events);
  if (state.sortByPriority) sorted = sortEventsByPriority(sorted);

  if (sorted.length > 0) {
    sorted.forEach(event => {
      const row = document.createElement("tr");

      const timeCell = document.createElement("td");
      timeCell.textContent = event.time || "Весь день";

      const nameCell = document.createElement("td");
      nameCell.textContent = event.name;
      nameCell.classList.add("event-tag-" + (event.tag || "blue"));

      const actionsCell = document.createElement("td");
      const editBtn = document.createElement("button");
      editBtn.textContent = "✏ Редактировать";
      editBtn.classList.add("edit-event-btn");
      editBtn.onclick = () => openEditEventModal(event);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "❌ Удалить";
      deleteBtn.classList.add("delete-event-btn");
      deleteBtn.onclick = () => deleteEvent(event.id);

      actionsCell.appendChild(editBtn);
      actionsCell.appendChild(deleteBtn);

      row.appendChild(timeCell);
      row.appendChild(nameCell);
      row.appendChild(actionsCell);

      table.appendChild(row);
    });
  } else {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.setAttribute("colspan", "3");
    cell.textContent = "Нет событий";
    cell.classList.add("no-events");
    row.appendChild(cell);
    table.appendChild(row);
  }

  return table;
}
