// server/routes.js
import express from 'express';
import { pool } from './db.js';

const router = express.Router();

// Получить все события
router.get('/events', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Добавить событие
router.post('/events', async (req, res) => {
  const { name, date, time, tag, repeat } = req.body;
  try {
    await pool.query(
      'INSERT INTO events (name, date, time, tag, repeat) VALUES ($1, $2, $3, $4, $5)',
      [name, date, time, tag, repeat]
    );
    res.status(201).send('Событие добавлено');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// (Можно добавить редактирование и удаление)

export default router;
