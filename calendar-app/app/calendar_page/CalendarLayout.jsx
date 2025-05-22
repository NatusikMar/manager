'use client';
import CalendarNavigation from './CalendarNavigation';
import WeekdaysHeader from './WeekdaysHeader';
import CalendarGrid from './CalendarGrid';
import SidebarMenu from './SidebarMenu';
import SidebarInfo from './SidebarInfo';
import AddEventModal from './AddEventModal';
import './calendar.css';

export default function CalendarLayout() {
  return (
    <div className="calendar-layout">
      <SidebarMenu />
      <main>
        <CalendarNavigation />
        <WeekdaysHeader />
        <CalendarGrid />
      </main>
      <SidebarInfo />
      <AddEventModal />
    </div>
  );
}
