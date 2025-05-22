"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function Home() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        router.push(data.redirectTo); // переход на /calendar_page
        //setMessage("Успешный вход!");
        //router.push("/dashboard");
      } else {
        setMessage(data.error || "Ошибка входа.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Ошибка соединения с сервером.");
    }
  };

  return (
    <>
      <Head>
        <title>Менеджер задач и событий</title>
        <meta name="description" content="Вход в менеджер задач и событий" />
      </Head>
      <div className="auth-page">
        <div className="auth-box">
          <h1 className="welcome-text">Добро пожаловать в менеджер задач и событий!</h1>
          <h2 className="auth-title">Вход</h2>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label>Пароль</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="auth-button">Войти</button>
          </form>
          {message && <p style={{ color: "red", marginTop: "1rem" }}>{message}</p>}
          <p className="register-link">
            Нет аккаунта?{" "}
            <Link href="/registration_page">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
