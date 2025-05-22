import { state } from "./state.js";
import { saveEvents } from "./storage.js";
import { renderCalendar } from "./render.js";

export function deleteEvent(dateKey, index) {
  state.events[dateKey].splice(index, 1);
  if (state.events[dateKey].length === 0) {
    delete state.events[dateKey];
  }
  saveEvents();
  renderCalendar();
}

export function addEvent(dateKey) {
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

    saveBtn.onclick = () => {
        const time = timeInput.value || "";
        const name = nameInput.value.trim();
        const tag = tagSelect.value;
        const repeat = repeatToggle.checked ? repeatFrequency.value : null;

        if (!name) return;

        if (!isValidTimeFormat(time)) {
        alert("Пожалуйста, введите время в формате ЧЧ:ММ (например, 09:30)");
        return;
        }

        if (!state.events[dateKey]) state.events[dateKey] = [];
        state.events[dateKey].push({ time: time || "", name, tag, repeat });

        localStorage.setItem("events", JSON.stringify(state.events));
        modal.classList.add("hidden");
        renderCalendar();
    };

    cancelBtn.onclick = () => {
        modal.classList.add("hidden");
    };
}

export function editEvent(dateKey, index) {
    const modal = document.getElementById("editModal");
    const timeInput = document.getElementById("editTime");
    const nameInput = document.getElementById("editName");
    const saveBtn = document.getElementById("saveEditBtn");
    const cancelBtn = document.getElementById("cancelEditBtn");
    const tagSelect = document.getElementById("editTag");

    const event = state.events[dateKey][index];
    timeInput.value = event.time !== "Весь день" ? event.time : "";
    nameInput.value = event.name;
    tagSelect.value = event.tag || "blue";

    modal.classList.remove("hidden");

    saveBtn.onclick = () => {
        const newTime = timeInput.value || "";
        const newName = nameInput.value.trim();
        const newTag = tagSelect.value;

        if (!newName) return;
        
        if (!isValidTimeFormat(newTime)) {
        alert("Пожалуйста, введите время в формате ЧЧ:ММ (например, 18:00)");
        return;
        }

        state.events[dateKey][index] = { time: newTime || "", name: newName, tag: newTag};
        localStorage.setItem("events", JSON.stringify(state.events));
        modal.classList.add("hidden");
        renderCalendar();
    };

    cancelBtn.onclick = () => {
        modal.classList.add("hidden");
    };
}

export function showEventsForDate(date, dayText) {
    const selectedDateElement = document.getElementById("selectedDate");
    selectedDateElement.textContent = dayText;

    // Очистим старые события
    const sidebar = document.getElementById("eventInfo");
    sidebar.querySelectorAll("table, .add-event-btn").forEach(el => el.remove());

    const dateKey = date.toISOString().split('T')[0];
    const eventsTable = createEventsTable(dateKey, true);
    
    let addBtn = document.createElement("button");
    addBtn.textContent = "Добавить";
    addBtn.classList.add("add-event-btn");
    addBtn.onclick = function () {
        addEvent(dateKey);
    };

    sidebar.appendChild(eventsTable);
    sidebar.appendChild(addBtn);
}

export function getEventsForDate(date) {
    const key = date.toISOString().split("T")[0];
    let result = state.events[key] ? [...state.events[key]] : [];

    for (const storedDate in state.events) {
        if (storedDate === key) continue;
        state.events[storedDate].forEach(event => {
            if (!event.repeat) return;

            const [year, month, day] = storedDate.split("-").map(Number);
            const original = new Date(year, month - 1, day);

            if (
                (event.repeat === "yearly" && original.getDate() === date.getDate() && original.getMonth() === date.getMonth()) ||
                (event.repeat === "monthly" && original.getDate() === date.getDate()) ||
                (event.repeat === "weekly" && original.getDay() === date.getDay())
            ) {
                result.push({ ...event, _repeat: true });
            }
        });
    }

    return result;
}

export function isValidTimeFormat(time) {
  if (!time) return true;
  const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
  return timeRegex.test(time);
}

export function sortEventsByTime(eventsArray) {
  return eventsArray.slice().sort((a, b) => {
    const timeA = a.time === "Весь день" ? "00:00" : a.time;
    const timeB = b.time === "Весь день" ? "00:00" : b.time;
    return timeA.localeCompare(timeB);
  });
}

export function sortEventsByPriority(eventsArray) {
  const priorityOrder = { red: 1, blue: 2, green: 3 };
  return eventsArray.slice().sort((a, b) => {
    const aPriority = priorityOrder[a.tag] || 999;
    const bPriority = priorityOrder[b.tag] || 999;
    return aPriority - bPriority;
  });
}

export function createEventsTable(dateKey, includeButtons = true){
    let eventsTable = document.createElement("table");
    eventsTable.classList.add("events-table");

    let tableHeader = `
        <tr>
            <th>Время</th>
            <th>Событие</th>
            <th>Действия</th>
        </tr>
    `;
    
    eventsTable.innerHTML = tableHeader;
    
    const dateObj = new Date(dateKey);
    const events = getEventsForDate(dateObj);

    if (events.length > 0) {
        let sortedEvents = sortEventsByTime(events);
        if (state.sortByPriority) {
            sortedEvents = sortEventsByPriority(sortedEvents);
        }

        sortedEvents.forEach((event, index) => {
            let row = document.createElement("tr");

            let timeCell = document.createElement("td");
            timeCell.textContent = event.time ? event.time : "Весь день";

            let eventCell = document.createElement("td");
            eventCell.textContent = event.name;
            eventCell.classList.add("event-tag-" + (event.tag || "blue"));

            let actionsCell = document.createElement("td");
            if (includeButtons){
                let editBtn = document.createElement("button");
                editBtn.textContent = "✏ Редактировать";
                editBtn.classList.add("edit-event-btn");
                editBtn.onclick = () => editEvent(dateKey, index);

                let deleteBtn = document.createElement("button");
                deleteBtn.textContent = "❌ Удалить";
                deleteBtn.classList.add("delete-event-btn");
                deleteBtn.onclick = () => deleteEvent(dateKey, index);

                actionsCell.appendChild(editBtn);
                actionsCell.appendChild(deleteBtn);
            }

            row.appendChild(timeCell);
            row.appendChild(eventCell);
            row.appendChild(actionsCell);

            eventsTable.appendChild(row);
        });
    } else {
        let noEventsRow = document.createElement("tr");
        let noEventsCell = document.createElement("td");
        noEventsCell.setAttribute("colspan", "3");
        noEventsCell.textContent = "Нет событий";
        noEventsCell.classList.add("no-events");
        noEventsRow.appendChild(noEventsCell);
        eventsTable.appendChild(noEventsRow);
    }

    return eventsTable
}