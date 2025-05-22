'use client';
import { useEffect, useState, useContext } from "react";
import { CalendarProvider, CalendarContext } from "./calendar_context";
import Calendar from "./calendar_modules/Сalendar";
import AddEventModal from "./calendar_modules/AddEventModal";
import EditEventModal from "./calendar_modules/EditEventModal";
import { useEventHandlers } from "./calendar_modules/useEventHandlers";

export default function CalendarPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <CalendarProvider>
      <InnerCalendar
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
      />
    </CalendarProvider>
  );
}

function InnerCalendar({ showAddModal, setShowAddModal, showEditModal, setShowEditModal }) {
  const { selectedEvent, selectedDate } = useContext(CalendarContext);
  const { loadEvents } = useEventHandlers();

  useEffect(() => {
    if (selectedDate) {
      loadEvents(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedEvent) {
      setShowEditModal(true);
    }
  }, [selectedEvent]);

  return (
    <div>
      <Calendar onAddEvent={() => setShowAddModal(true)} />
      {showAddModal && <AddEventModal onClose={() => setShowAddModal(false)} />}
      {showEditModal && <EditEventModal onClose={() => setShowEditModal(false)} />}
    </div>
  );
}
