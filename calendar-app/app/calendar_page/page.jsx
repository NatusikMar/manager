import CalendarLayout from './CalendarLayout';
import { CalendarProvider } from './calendar_context';

export default function CalendarPage() {
  return (
    <CalendarProvider>
      <CalendarLayout />
    </CalendarProvider>
  );
}
