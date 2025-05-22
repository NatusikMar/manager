export const state = {
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear(),
  today: new Date().getDate(),
  todayMonth: new Date().getMonth(),
  todayYear: new Date().getFullYear(),
  weekOffset: 0,
  isWeekView: false,
  sortByPriority: false,
  events: JSON.parse(localStorage.getItem("events")) || {}
};

const monthYear = document.getElementById("monthYear");
const calendar = document.getElementById("calendar");
const selectedDateElement = document.getElementById("selectedDate");
const toggleViewBtn = document.getElementById("toggleViewBtn");
const sidebar = document.getElementById("eventInfo");