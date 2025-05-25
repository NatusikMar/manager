import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";
import authenticateToken from "./authMiddleware.js";

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET;

// POST /api/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: "Неверный email или пароль." });
    }

    const user = userResult.rows[0];

    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: "Неверный email или пароль." });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: "1d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.json({ redirectTo: "/calendar_page" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера." });
  }
});

// POST /api/register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Все поля обязательны." });
  }

  try {
    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Пользователь с таким email уже существует." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (username, email, password_hash, created_at) VALUES ($1, $2, $3, NOW())",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "Пользователь зарегистрирован!" });
  } catch (err) {
    console.error("Ошибка при регистрации:", err.message, err.stack);
    res.status(500).json({ error: "Ошибка сервера." });
  }
});

// GET /api/calendar/events
router.get("/calendar/events", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query("SELECT * FROM events WHERE user_id = $1", [userId]);

    res.json(result.rows);
  } catch (err) {
    console.error("Ошибка при получении событий:", err.message);
    res.status(500).json({ error: "Ошибка сервера при получении событий." });
  }
});

export default router;
