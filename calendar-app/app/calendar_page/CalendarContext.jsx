"use client";

import { createContext, useContext, useState } from "react";

// ⛳️ Добавляем экспорт
export const CalendarContext = createContext();

export function CalendarProvider({ children }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isWeekView, setIsWeekView] = useState(false);
  const [sortByPriority, setSortByPriority] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  return (
    <CalendarContext.Provider
      value={{
        currentDate,
        setCurrentDate,
        isWeekView,
        setIsWeekView,
        sortByPriority,
        setSortByPriority,
        weekOffset,
        setWeekOffset,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

// Хук остаётся без изменений
export const useCalendar = () => useContext(CalendarContext);
