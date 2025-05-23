import { format, isSameDay } from 'date-fns';
import { CalendarEvent } from './types';
import styles from '../../styles/calendar.module.css';

interface Props {
  date: Date;
  events: CalendarEvent[];
}

export default function DayCell({ date, events }: Props) {
  const isToday = isSameDay(date, new Date());

  return (
    <div className={`${styles.day} ${isToday ? styles.today : ''}`}>
      <div className={styles.dateLabel}>{format(date, 'd')}</div>
      {events.map(event => (
        <div key={event.id} className={styles.event}>
          {event.name}
        </div>
      ))}
    </div>
  );
}
