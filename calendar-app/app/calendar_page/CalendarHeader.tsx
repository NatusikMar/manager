import { format } from 'date-fns';
import styles from '../../styles/calendar.module.css';

interface Props {
  currentDate: Date;
  onNext: () => void;
  onPrev: () => void;
}

export default function CalendarHeader({ currentDate, onNext, onPrev }: Props) {
  return (
    <div className={styles.header}>
      <button onClick={onPrev}>←</button>
      <span>{format(currentDate, 'MMMM yyyy')}</span>
      <button onClick={onNext}>→</button>
    </div>
  );
}
