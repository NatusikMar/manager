const monthYear = document.getElementById("monthYear");
const calendar = document.getElementById("calendar");
const selectedDateElement = document.getElementById("selectedDate");
const toggleViewBtn = document.getElementById("toggleViewBtn");
const sidebar = document.getElementById("eventInfo");

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let today = new Date().getDate();
let todayMonth = new Date().getMonth();
let todayYear = new Date().getFullYear();
let weekOffset = 0;
let isWeekView = false;
let sortByPriority = false;
let events = {}; // Пример: { "2024-04-02": ["Встреча", "Доклад"], "2024-04-03": ["Звонок"] };
        
function toggleView() {
    isWeekView = !isWeekView;
    toggleViewBtn.textContent = isWeekView ? "Месяц" : "Неделя";
    
    // Полностью скрываем sidebar
    sidebar.style.display = isWeekView ? "none" : "block";

    // Меняем классы для календаря
    calendar.className = isWeekView ? "week-view" : "calendar";

    const calendarContainer = document.querySelector(".calendar-container");
    if (isWeekView) {
        calendarContainer.classList.add("week-mode");
    } else {
        calendarContainer.classList.remove("week-mode");
    }
    document.querySelector(".month-sort").style.display = isWeekView ? "none" : "flex";
    document.getElementById("sortByPriorityWeek").classList.toggle("hidden", !isWeekView);

    if (!isWeekView) {
        weekOffset = 0; // сбросим при переходе обратно на месяц
    }
    renderCalendar();
}

function renderCalendar() {
    calendar.innerHTML = "";
    
    if (isWeekView) {
        renderWeek();
    } else {
        renderMonth();
    }
}

function renderWeek() {
    calendar.innerHTML = "";
    let now = new Date();
    now.setDate(now.getDate() + weekOffset * 7);
    let startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
    
    monthYear.textContent = `Неделя ${startOfWeek.toLocaleDateString('ru-RU')}`;

    const weekContainer = document.createElement("div");
    weekContainer.classList.add("week-container");

    for (let i = 0; i < 7; i++) {
        let day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);

        const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
        let dayNameElement = document.createElement("div");
        dayNameElement.classList.add("week-day-name");
        dayNameElement.textContent = dayNames[i];
        
        let dateKey = day.toISOString().split('T')[0]; // "2024-04-02"

        let dayElement = document.createElement("div");
        dayElement.classList.add("week-day");

        const monthNames = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
        dayElement.textContent = `${day.getDate()} ${monthNames[day.getMonth()]}`;
        dayElement.prepend(dayNameElement);

        if (day.getDate() === today && day.getMonth() === todayMonth && day.getFullYear() === todayYear) {
            dayElement.classList.add("week-today");
        }

        // Таблица событий
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

        if (events[dateKey] && events[dateKey].length > 0) {
            let sortedEvents = sortEventsByTime(events[dateKey]);
            if (sortByPriority) {
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

        // Кнопка "Добавить событие"
        let addEventBtn = document.createElement("button");
        addEventBtn.textContent = "Добавить";
        addEventBtn.classList.add("add-event-btn");
        addEventBtn.onclick = function () {
            addEvent(dateKey);
        };

        dayElement.appendChild(eventsTable);
        dayElement.appendChild(addEventBtn);
        weekContainer.appendChild(dayElement);
    }
    calendar.appendChild(weekContainer);
}

function renderMonth() {
    sidebar.style.display = "block"; // Возвращаем sidebar

    const firstDay = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    monthYear.textContent = `${new Date(currentYear, currentMonth).toLocaleString('ru-RU', { month: 'long', year: 'numeric' })}`;
    
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement("div");
        emptyDiv.classList.add("day");
        emptyDiv.style.visibility = "hidden";
        calendar.appendChild(emptyDiv);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement("div");
        dayElement.classList.add("day");
        dayElement.textContent = day;
        
        if (day === today && currentMonth === todayMonth && currentYear === todayYear) {
            dayElement.classList.add("today");
        }
        
        dayElement.onclick = function () {
            document.querySelectorAll(".day").forEach(d => d.classList.remove("selected"));
            dayElement.classList.add("selected");

            const selectedDate = new Date(currentYear, currentMonth, day);
            showEventsForDate(selectedDate, `${day} ${monthYear.textContent}`);
        };
        calendar.appendChild(dayElement);
    }

    const defaultDate = new Date();
    showEventsForDate(defaultDate, `Сегодня, ${defaultDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}`);
}

function showEventsForDate(date, dayText) {
    selectedDateElement.textContent = dayText;

    // Очистим старые события
    sidebar.querySelectorAll("table, .add-event-btn").forEach(el => el.remove());

    const dateKey = date.toISOString().split('T')[0];

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
    
    const eventsForDate = getEventsForDate(date);
    if (eventsForDate.length > 0) {
        let sortedEvents = sortEventsByTime(eventsForDate);
        if (sortByPriority) {
            sortedEvents = sortEventsByPriority(sortedEvents);
        }
        sortedEvents.forEach((event, index) => {
            let row = document.createElement("tr");

            let timeCell = document.createElement("td");
            timeCell.textContent = event.time || "Весь день";

            let eventCell = document.createElement("td");
            eventCell.textContent = event.name;

            let actionsCell = document.createElement("td");

            let editBtn = document.createElement("button");
            editBtn.textContent = "✏";
            editBtn.onclick = () => editEvent(dateKey, index);

            let deleteBtn = document.createElement("button");
            deleteBtn.textContent = "❌";
            deleteBtn.onclick = () => deleteEvent(dateKey, index);

            actionsCell.appendChild(editBtn);
            actionsCell.appendChild(deleteBtn);

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

    let addBtn = document.createElement("button");
    addBtn.textContent = "Добавить";
    addBtn.classList.add("add-event-btn");
    addBtn.onclick = function () {
        addEvent(dateKey);
    };

    sidebar.appendChild(eventsTable);
    sidebar.appendChild(addBtn);
}

function changeMonth(direction) {
    if (isWeekView) {
        weekOffset += direction;
        renderCalendar();
    } else {
        currentMonth += direction;

        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        } else if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }

        renderCalendar();
    }
}

function getEventsForDate(date) {
    const key = date.toISOString().split("T")[0];
    let result = events[key] ? [...events[key]] : [];

    for (const storedDate in events) {
        if (storedDate === key) continue;
        events[storedDate].forEach(event => {
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

function addEvent(dateKey) {
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

        if (!events[dateKey]) events[dateKey] = [];
        events[dateKey].push({ time: time || "", name, tag, repeat });

        localStorage.setItem("events", JSON.stringify(events));
        modal.classList.add("hidden");
        renderCalendar();
    };

    cancelBtn.onclick = () => {
        modal.classList.add("hidden");
    };
}

function editEvent(dateKey, index) {
    const modal = document.getElementById("editModal");
    const timeInput = document.getElementById("editTime");
    const nameInput = document.getElementById("editName");
    const saveBtn = document.getElementById("saveEditBtn");
    const cancelBtn = document.getElementById("cancelEditBtn");
    const tagSelect = document.getElementById("editTag");

    const event = events[dateKey][index];
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

        events[dateKey][index] = { time: newTime || "", name: newName, tag: newTag};
        localStorage.setItem("events", JSON.stringify(events));
        modal.classList.add("hidden");
        renderCalendar();
    };

    cancelBtn.onclick = () => {
        modal.classList.add("hidden");
    };
}

function sortEventsByTime(eventsArray) {
    return eventsArray.slice().sort((a, b) => {
        const timeA = a.time === "Весь день" ? "00:00" : a.time;
        const timeB = b.time === "Весь день" ? "00:00" : b.time;
        return timeA.localeCompare(timeB);
    });
}

function sortEventsByPriority(eventsArray) {
    const priorityOrder = { red: 1, blue: 2, green: 3 };
    return eventsArray.slice().sort((a, b) => {
        const aPriority = priorityOrder[a.tag] || 999;
        const bPriority = priorityOrder[b.tag] || 999;
        return aPriority - bPriority;
    });
}

function deleteEvent(dateKey, index) {
    events[dateKey].splice(index, 1);
    if (events[dateKey].length === 0) {
        delete events[dateKey];
    }
    renderCalendar();
}

function isValidTimeFormat(time) {
    // Пустое значение тоже допустимо (весь день)
    if (!time) return true;

    // Проверка на формат HH:MM, 24-часовой
    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
    return timeRegex.test(time);
}

function init() {
    toggleViewBtn.addEventListener("click", toggleView);

    document.getElementById("sortByPriorityMonth").addEventListener("click", () => {
        sortByPriority = !sortByPriority;
        renderCalendar();
    });

    document.getElementById("sortByPriorityWeek").addEventListener("click", () => {
        sortByPriority = !sortByPriority;
        renderCalendar();
    });

    renderCalendar();
}

// Запуск
init();