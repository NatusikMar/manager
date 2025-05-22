'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface EventFormProps {
    date: Date;
    event?: {
        id: string;
        title: string;
        description: string;
        date: string;
    } | null;
    onClose: () => void;
    onSave: () => void;
}

export default function EventForm({ date, event, onClose, onSave }: EventFormProps) {
    const [title, setTitle] = useState(event?.title || '');
    const [description, setDescription] = useState(event?.description || '');

    useEffect(() => {
        if (event) {
            setTitle(event.title);
            setDescription(event.description);
        } else {
            setTitle('');
            setDescription('');
        }
    }, [event]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            if (event) {
                await axios.put(`/api/events/${event.id}`, {
                    title,
                    description,
                    date: date.toISOString(),
                });
            } else {
                await axios.post('/api/events', {
                    title,
                    description,
                    date: date.toISOString(),
                });
            }
            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving event:', error);
        }
    };

    return (
        <div className="modal">
            <div className="modalContent">
                <h3>{event ? 'Edit Event' : 'Add Event'}</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Title:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="formActions">
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit">Save</button>
                    </div>
                </form>
            </div>

            <style jsx>{`
                .modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .modalContent {
                    background: white;
                    padding: 20px;
                    border-radius: 5px;
                    width: 400px;
                    max-width: 90%;
                }
                h3 {
                    margin-top: 0;
                }
                label {
                    display: block;
                    margin-bottom: 5px;
                }
                input, textarea {
                    width: 100%;
                    padding: 8px;
                    margin-bottom: 10px;
                    border: 1px solid #ddd;
                    border-radius: 3px;
                }
                textarea {
                    height: 100px;
                }
                .formActions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    margin-top: 15px;
                }
                button {
                    padding: 5px 10px;
                    border: 1px solid #ddd;
                    border-radius: 3px;
                    cursor: pointer;
                }
                button[type='submit'] {
                    background-color: #4caf50;
                    color: white;
                    border: none;
                }
            `}</style>
        </div>
    );
}