// app/calendar_page/CalendarLayout.jsx
import SidebarMenu from './SidebarMenu';
import CalendarNavigation from './CalendarNavigation';
import WeekdaysHeader from './WeekdaysHeader';
import CalendarGrid from './CalendarGrid';
import SidebarInfo from './SidebarInfo';
import AddEventModal from './AddEventModal';
import EditEventModal from './EditEventModal';
import './calendar.css';

export default function CalendarLayout() {
  return (
    <div className="main-layout">
      <SidebarMenu />
      <div className="calendar-container">
        <CalendarNavigation />
        <WeekdaysHeader />
        <CalendarGrid />
      </div>
      <SidebarInfo />
      <AddEventModal />
      <EditEventModal />
    </div>
  );
}
