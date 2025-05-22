import { state } from "./state.js";
import { showEventsForDate, openAddEventModal, createEventsTable } from "../eventHandlers.js";

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
  const calendar = document.getElementById("calendar");
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

export async function renderWeek() {
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";
  let now = new Date();
  now.setDate(now.getDate() + state.weekOffset * 7);
  let startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
  const monthYear = document.getElementById("monthYear");

  monthYear.textContent = `Неделя ${startOfWeek.toLocaleDateString('ru-RU')}`;

  const weekContainer = document.createElement("div");
  weekContainer.classList.add("week-container");

  const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const monthNames = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

  for (let i = 0; i < 7; i++) {
    let day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);

    let dateKey = day.toISOString().split('T')[0];

    // Получаем события с сервера
    const res = await fetch(`/api/events?date=${dateKey}`);
    const events = await res.json();

    let dayElement = document.createElement("div");
    dayElement.classList.add("week-day");

    const dayNameElement = document.createElement("div");
    dayNameElement.classList.add("week-day-name");
    dayNameElement.textContent = dayNames[i];

    dayElement.textContent = `${day.getDate()} ${monthNames[day.getMonth()]}`;
    dayElement.prepend(dayNameElement);

    if (day.getDate() === state.today && day.getMonth() === state.todayMonth && day.getFullYear() === state.todayYear) {
      dayElement.classList.add("week-today");
    }

    const eventsTable = createEventsTable(events, dateKey);

    const addEventBtn = document.createElement("button");
    addEventBtn.textContent = "Добавить";
    addEventBtn.classList.add("add-event-btn");
    addEventBtn.onclick = () => openAddEventModal(dateKey);

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
