import { state } from "./state.js";

export function saveEvents() {
  localStorage.setItem("events", JSON.stringify(state.events));
}
