import { state } from "./state.js";
import { renderCalendar } from "./render.js";

export function toggleView() {
    const sidebar = document.getElementById("eventInfo");
    
    state.isWeekView = !state.isWeekView;
    toggleViewBtn.textContent = state.isWeekView ? "Месяц" : "Неделя";
    
    // Полностью скрываем sidebar
    sidebar.style.display = state.isWeekView ? "none" : "block";

    // Меняем классы для календаря
    calendar.className = state.isWeekView ? "week-view" : "calendar";

    const calendarContainer = document.querySelector(".calendar-container");
    if (state.isWeekView) {
        calendarContainer.classList.add("week-mode");
    } else {
        calendarContainer.classList.remove("week-mode");
    }
    document.querySelector(".month-sort").style.display = state.isWeekView ? "none" : "flex";
    document.getElementById("sortByPriorityWeek").classList.toggle("hidden", !state.isWeekView);

    if (!state.isWeekView) {
        state.weekOffset = 0; // сбросим при переходе обратно на месяц
    }
    renderCalendar();
}