import { Pool } from "pg";

//console.log("Все переменные окружения:", process.env);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool
  .connect()
  .then(client => {
    console.log("✅ Успешное подключение к базе данных");
    client.release();
  })
  .catch(err => {
    console.error("❌ Ошибка подключения к базе данных:", err.message);
  });

export default pool;
