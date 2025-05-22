'use client';

import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../Calendar.module.css';
import EventForm from './EventForm';

interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
}

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [showForm, setShowForm] = useState(false);

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const startDay = monthStart.getDay();
    const endDay = 6 - monthEnd.getDay();
    
    const paddingStart = Array.from({ length: startDay }, (_, i) => 
        new Date(monthStart.getFullYear(), monthStart.getMonth(), -startDay + i + 1)
    );
    
    const paddingEnd = Array.from({ length: endDay }, (_, i) => 
        new Date(monthEnd.getFullYear(), monthEnd.getMonth() + 1, i + 1)
    );
    
    const calendarDays = [...paddingStart, ...daysInMonth, ...paddingEnd];

    useEffect(() => {
        fetchEvents();
    }, [currentDate]);

    const fetchEvents = async () => {
        try {
            const start = startOfMonth(currentDate).toISOString();
            const end = endOfMonth(currentDate).toISOString();
            
            const response = await axios.get(`/api/events?start=${start}&end=${end}`);
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const handleDayClick = (day: Date) => {
        setSelectedDate(day);
        setSelectedEvent(null);
        setShowForm(true);
    };

    const handleEventClick = (event: Event, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedEvent(event);
        setSelectedDate(parseISO(event.date));
        setShowForm(true);
    };

    const getEventsForDay = (day: Date) => {
        return events.filter(event => isSameDay(parseISO(event.date), day));
    };

    return (
        <div className={styles.container}>
            <div className={styles.navigation}>
                <button className={styles.navButton} onClick={prevMonth}>Previous</button>
                <div className={styles.monthTitle}>{format(currentDate, 'MMMM yyyy')}</div>
                <button className={styles.navButton} onClick={nextMonth}>Next</button>
            </div>

            <div className={styles.calendar}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className={styles.dayHeader}>{day}</div>
                ))}

                {calendarDays.map((day, i) => {
                    const dayEvents = getEventsForDay(day);
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isToday = isSameDay(day, new Date());

                    return (
                        <div
                            key={i}
                            className={`${styles.dayCell} ${
                                !isCurrentMonth ? styles.otherMonth : ''
                            } ${
                                isToday ? styles.currentDay : ''
                            }`}
                            onClick={() => handleDayClick(day)}
                        >
                            <div className={styles.dayNumber}>{format(day, 'd')}</div>
                            {dayEvents.map(event => (
                                <div
                                    key={event.id}
                                    className={styles.event}
                                    onClick={(e) => handleEventClick(event, e)}
                                >
                                    {event.title}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>

            {showForm && selectedDate && (
                <EventForm
                    date={selectedDate}
                    event={selectedEvent}
                    onClose={() => setShowForm(false)}
                    onSave={fetchEvents}
                />
            )}
        </div>
    );
}