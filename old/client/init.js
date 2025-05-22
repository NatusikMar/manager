import { toggleView } from "./toggleView.js";
import { renderCalendar, changeMonth } from "./render.js";
import { state } from "./state.js";

export function init() {
    document.getElementById("toggleViewBtn").addEventListener("click", toggleView);

    document.getElementById("sortByPriorityMonth").addEventListener("click", () => {
        state.sortByPriority = !state.sortByPriority;
        renderCalendar();
    });

    document.getElementById("prev").addEventListener("click", () => changeMonth(-1));
    document.getElementById("next").addEventListener("click", () => changeMonth(1));

    renderCalendar();
}

init();