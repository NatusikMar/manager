import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const getEventsByDate = async (date: string) => {
  const response = await axios.get(`${API_BASE_URL}/events/${date}`);
  return response.data;
};

export const createEvent = async (eventData: {
  date: string;
  time: string;
  name: string;
  tag: string;
  repeat: string;
}) => {
  const response = await axios.post(`${API_BASE_URL}/events`, eventData);
  return response.data;
};

export const updateEvent = async (id: string, eventData: {
  time?: string;
  name?: string;
  tag?: string;
  repeat?: string;
}) => {
  const response = await axios.put(`${API_BASE_URL}/events/${id}`, eventData);
  return response.data;
};

export const deleteEvent = async (id: string) => {
  const response = await axios.delete(`${API_BASE_URL}/events/${id}`);
  return response.data;
};