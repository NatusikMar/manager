"use client";
import { useState } from "react";
import Link from "next/link";

export default function RegistrationPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm_password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) {
      setMessage("Пароли не совпадают.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Успешная регистрация!");
        setForm({ name: "", email: "", password: "", confirm_password: "" });
      } else {
        setMessage(data.error || "Ошибка регистрации.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Ошибка соединения с сервером.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1 className="welcome-text">Создайте аккаунт и начните планировать!</h1>
        <h2 className="auth-title">Регистрация</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Имя</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Пароль</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Подтвердите пароль</label>
            <input type="password" name="confirm_password" value={form.confirm_password} onChange={handleChange} required />
          </div>
          <button type="submit" className="auth-button">Зарегистрироваться</button>
        </form>
        {message && <p style={{ color: "red", marginTop: "1rem" }}>{message}</p>}
        <p className="register-link">
          Уже есть аккаунт? <Link href="/">Войти</Link>
        </p>
      </div>
    </div>
  );
}
