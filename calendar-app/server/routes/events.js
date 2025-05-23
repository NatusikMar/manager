import express from "express";
import db from "../db.js";

const router = express.Router();

// Получить события по дате
router.get("/:date", async (req, res) => {
  const { date } = req.params;
  try {
    const result = await db.query(
      "SELECT * FROM events WHERE event_date = $1 ORDER BY event_time",
      [date]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Ошибка при получении событий:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Добавить новое событие
router.post("/", async (req, res) => {
  const {
    user_id,
    event_date,
    event_time,
    name,
    tag,
    is_recurring,
    repeat_frequency
  } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO events 
       (user_id, name, event_date, event_time, tag, is_recurring, repeat_frequency) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [user_id, name, event_date, event_time, tag, is_recurring, repeat_frequency]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка при добавлении события:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});


// Обновить событие
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { time, name, tag, repeat } = req.body;
  try {
    const result = await db.query(
      "UPDATE events SET event_time = $1, name = $2, tag = $3, is_recurring = $4 WHERE id = $5 RETURNING *",
      [time, name, tag, repeat, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка при обновлении события:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Удалить событие
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM events WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Ошибка при удалении события:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

export default router;
