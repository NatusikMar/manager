// calendar_modules/toggleView.js

import { state } from "./state.js";
import { renderCalendar } from "./render.js";

export function toggleView() {
  const sidebar = document.getElementById("eventInfo");
  const toggleViewBtn = document.getElementById("toggleViewBtn");
  const calendar = document.getElementById("calendar");
  const calendarContainer = document.querySelector(".calendar-container");

  state.isWeekView = !state.isWeekView;

  toggleViewBtn.textContent = state.isWeekView ? "Месяц" : "Неделя";

  sidebar.style.display = state.isWeekView ? "none" : "block";
  calendar.className = state.isWeekView ? "week-view" : "calendar";

  calendarContainer.classList.toggle("week-mode", state.isWeekView);
  document.querySelector(".month-sort").style.display = state.isWeekView ? "none" : "flex";
  document.getElementById("sortByPriorityWeek").classList.toggle("hidden", !state.isWeekView);

  if (!state.isWeekView) {
    state.weekOffset = 0;
  }

  renderCalendar();
}
