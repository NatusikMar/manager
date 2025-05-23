// ==== /components/EventForm.tsx ====
'use client';
import { useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

interface Props {
  date: Date;
  event: any;
  onClose: () => void;
  onSave: () => void;
}

export default function EventForm({ date, event, onClose, onSave }: Props) {
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const data = { date: format(date, 'yyyy-MM-dd'), title, description };
    if (event) {
      await axios.put(`/api/events/${event.id}`, data);
    } else {
      await axios.post('/api/events', data);
    }
    onSave();
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <form className="bg-white p-4 rounded shadow w-80" onSubmit={handleSubmit}>
        <h2 className="mb-2 text-lg font-bold">{event ? 'Edit Event' : 'New Event'}</h2>
        <input className="border w-full mb-2 p-1" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
        <textarea className="border w-full mb-2 p-1" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <div className="flex justify-between">
          <button type="button" onClick={onClose} className="text-gray-500">Cancel</button>
          <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">Save</button>
        </div>
      </form>
    </div>
  );
}