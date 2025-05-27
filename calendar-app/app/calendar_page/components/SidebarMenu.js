'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AddNoteModal from './AddNoteModal';

export default function SidebarMenu({ selectedDate, onAddNote, onTodayClick }) {
    const [showModal, setShowModal] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstall, setShowInstall] = useState(false);
    const router = useRouter();

    const handleNoteAdded = () => {
        setShowModal(false);
        if (onAddNote) onAddNote();
    };

    const handleLogout = async () => {
        try {
        await fetch('http://localhost:3000/api/logout', {
            method: 'POST',
            credentials: 'include',
        });
        } catch (error) {
        console.error('Ошибка выхода:', error);
        } finally {
        router.push('/'); 
        }
    };

// PWA установка
    useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
        console.log('Событие beforeinstallprompt получено');
        e.preventDefault(); 
        setDeferredPrompt(e);
        setShowInstall(true); 
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 👉 Регистрируем сразу, без 'load'
    // if ('serviceWorker' in navigator) {
    //     navigator.serviceWorker.register('/sw.js', { scope: '/calendar_page' })
    //         .then(reg => {
    //             console.log('✅ Service Worker зарегистрирован:', reg);
    //         })
    //         .catch(err => {
    //             console.error('❌ Ошибка регистрации Service Worker:', err);
    //         });
    // }

    return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
}, []);



    const handleInstallClick = async () => {
        console.log('Клик по кнопке установки');
        if (!deferredPrompt) {
            console.log('deferredPrompt отсутствует');
            return;
        } 

        deferredPrompt.prompt(); // запускаем установку
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`Результат установки: ${outcome}`);

        if (outcome === 'accepted') {
            console.log('Приложение установлено');
        } else {
            console.log('Установка отклонена');
        }

        setDeferredPrompt(null);
        setShowInstall(false);
    };

  return (
    <div className="sidebar-menu">
        <button onClick={onTodayClick}>Сегодня</button>
        <button onClick={() => setShowModal(true)}>Добавить заметку</button>
        {showInstall && (
            <button onClick={handleInstallClick}>Установить приложение</button>
        )}
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
