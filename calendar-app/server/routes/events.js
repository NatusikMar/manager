import express from "express";
import db from "../db.js";
import {
  addDays,
  addMonths,
  addYears,
} from "date-fns";
import verifyToken from "../middleware/verifyToken.js";
import dotenv from 'dotenv';
dotenv.config();


const router = express.Router();

// Защищённый доступ — все маршруты
router.use(verifyToken);

// Получить имя пользователя для приветствия
router.get("/user", async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query("SELECT username FROM users WHERE id = $1", [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    res.json({ username: result.rows[0].username });
  } catch (err) {
    console.error("Ошибка при получении username:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});


// Получить события на дату
router.get("/data/:date", async (req, res) => {

  const { date } = req.params;
  const userId = req.user.id; // ← из токена
  try {
    const result = await db.query(
      "SELECT * FROM events WHERE event_date = $1 AND user_id = $2 ORDER BY event_time",
      [date, userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Ошибка при получении событий:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Добавить новое событие
router.post("/add", async (req, res) => {
  const {
    name,
  event_date,
  event_time,
  event_end_time,
  tag,
  is_recurring,         
  repeat_frequency,
  repeat_count = 0,
} = req.body;

  const userId = req.user.id;
  const repeat_interval = is_recurring ? repeat_frequency : null;

  try {
    const baseDate = new Date(event_date);
    const events = [];

    for (let i = 0; i <= repeat_count; i++) {
      let currentDate = new Date(baseDate); // создаем копию, чтобы не менять оригинал

      if (i > 0 && repeat_interval) {
        if (repeat_interval === "weekly") {
          currentDate = addDays(baseDate, i * 7);
        } else if (repeat_interval === "monthly") {
          currentDate = addMonths(baseDate, i);
        } else if (repeat_interval === "yearly") {
          currentDate = addYears(baseDate, i);
        }
      }

      events.push([
        userId,
        name,
        currentDate.toISOString().slice(0, 10),
        event_time,
        event_end_time,
        tag,
        repeat_interval || null
      ]);
    }

    const placeholders = events.map((_, i) =>
      `($${i * 7 + 1}, $${i * 7 + 2}, $${i * 7 + 3}, $${i * 7 + 4}, $${i * 7 + 5}, $${i * 7 + 6}, $${i * 7 + 7})`
    ).join(", ");
    const flatValues = events.flat();

    const query = `
      INSERT INTO events 
      (user_id, name, event_date, event_time, event_end_time, tag, repeat_interval)
      VALUES ${placeholders}
      RETURNING *
    `;

    const result = await db.query(query, flatValues);
    res.status(201).json(result.rows);
  } catch (err) {
    console.error("Ошибка при добавлении события:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Обновить событие
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { event_date, event_time, event_end_time, name, tag } = req.body;

  try {
    const result = await db.query(
      `UPDATE events
       SET event_date = $1,
           event_time = $2,
           event_end_time = $3,
           name = $4,
           tag = $5
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [event_date, event_time, event_end_time, name, tag, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: "Нет доступа к событию" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка при обновлении события:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Удалить одно событие
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await db.query(
      "DELETE FROM events WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: "Нет доступа к удалению" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Ошибка при удалении события:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});


export default router;
