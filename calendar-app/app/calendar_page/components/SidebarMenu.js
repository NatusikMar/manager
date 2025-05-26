'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AddNoteModal from './AddNoteModal';

export default function SidebarMenu({ selectedDate, onAddNote, onTodayClick }) {
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    const handleNoteAdded = () => {
        setShowModal(false);
        if (onAddNote) onAddNote();
    };

    const handleLogout = async () => {
        try {
        await fetch('http://localhost:3001/api/logout', {
            method: 'POST',
            credentials: 'include',
        });
        } catch (error) {
        console.error('Ошибка выхода:', error);
        } finally {
        router.push('/'); 
        }
    };

  return (
    <div className="sidebar-menu">
        <button onClick={onTodayClick}>Сегодня</button>
        <button onClick={() => setShowModal(true)}>Добавить заметку</button>
        <button onClick={handleLogout}>Выйти</button>
        {showModal && (
            <AddNoteModal
            selectedDate={selectedDate}
            onClose={() => setShowModal(false)}
            onNoteAdded={handleNoteAdded}
            />
        )}
    </div>
    );
}
