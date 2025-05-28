import { getQueuedNotes, clearQueue } from './localDB';

export async function syncNotes() {
  const queue = await getQueuedNotes();

  for (const action of queue) {
    if (action.type === 'add') {
      try {
        await fetch('http://localhost:3000/api/events/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.note),
          credentials: 'include',
        });
      } catch (err) {
        console.error('Ошибка при синхронизации:', err);
        return; // остановим, чтобы не потерять данные
      }
    }
  }

  await clearQueue();
}
