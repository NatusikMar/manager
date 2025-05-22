import { state } from "./state.js";
import { showEventsForDate, addEvent, createEventsTable} from "./eventHandlers.js";

export function renderCalendar() {
    const calendar = document.getElementById("calendar");
    calendar.innerHTML = ""; // очистка перед рендером
    if (state.isWeekView) {
        renderWeek();
    } else {
        renderMonth();
    }
}

export function renderMonth() {
    calendar.innerHTML = "";
    const firstDay = (new Date(state.currentYear, state.currentMonth, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(state.currentYear, state.currentMonth + 1, 0).getDate();
    const monthYear = document.getElementById("monthYear");

    monthYear.textContent = `${new Date(state.currentYear, state.currentMonth).toLocaleString('ru-RU', { month: 'long', year: 'numeric' })}`;
  
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
            
            if (day === state.today && state.currentMonth === state.todayMonth && state.currentYear === state.todayYear) {
                dayElement.classList.add("today");
            }
            
            dayElement.onclick = function () {
                document.querySelectorAll(".day").forEach(d => d.classList.remove("selected"));
                dayElement.classList.add("selected");

                const selectedDate = new Date(state.currentYear, state.currentMonth, day);
                showEventsForDate(selectedDate, `${day} ${monthYear.textContent}`);
            };
            calendar.appendChild(dayElement);
    }
    const defaultDate = new Date();
    showEventsForDate(defaultDate, `Сегодня, ${defaultDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}`);
}

export function renderWeek() {
    calendar.innerHTML = "";
    let now = new Date();
    now.setDate(now.getDate() + state.weekOffset * 7);
    let startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
    const monthYear = document.getElementById("monthYear");

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

        if (day.getDate() === state.today && day.getMonth() === state.todayMonth && day.getFullYear() === state.todayYear) {
            dayElement.classList.add("week-today");
        }

        const eventsTable = createEventsTable(dateKey);         

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

export function changeMonth(direction) {
    if (state.isWeekView) {
        state.weekOffset += direction;
        renderCalendar();
    } else {
        state.currentMonth += direction;

        if (state.currentMonth < 0) {
            state.currentMonth = 11;
            state.currentYear--;
        } else if (state.currentMonth > 11) {
            state.currentMonth = 0;
            state.currentYear++;
        }

        renderCalendar();
    }
}