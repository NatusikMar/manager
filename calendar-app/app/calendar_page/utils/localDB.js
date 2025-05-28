// utils/localDB.js
import { openDB } from 'idb';

const DB_NAME = 'calendar-db';
const DB_VERSION = 1;

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('queue')) {
        db.createObjectStore('queue', { keyPath: 'id', autoIncrement: true });
      }
    }
  });
}

export async function queueNote(note) {
  const db = await initDB();
  await db.add('queue', { type: 'add', note });
}

export async function getQueuedNotes() {
  const db = await initDB();
  return db.getAll('queue');
}

export async function clearQueue() {
  const db = await initDB();
  const tx = db.transaction('queue', 'readwrite');
  await tx.objectStore('queue').clear();
  await tx.done;
}

export async function getOfflineEventsByDate(dateStr) {
  const db = await initDB();
  const allQueued = await db.getAll('queue');

  return allQueued
    .filter(entry =>
      entry.type === 'add' &&
      entry.note?.event_date === dateStr
    )
    .map(entry => ({
      ...entry.note,
      isOffline: true,
      local: true,         // <--- добавляем!
      queueId: entry.id,
    }));
}


export async function deleteQueuedNote(queueId) {
  const db = await initDB();
  await db.delete('queue', queueId);
}

export async function updateQueuedNote(queueId, updatedNote) {
  const db = await initDB();
  const tx = db.transaction('queue', 'readwrite');
  const store = tx.objectStore('queue');
  const original = await store.get(queueId);

  if (original) {
    await store.put({ ...original, note: updatedNote });
  }

  await tx.done;
}
