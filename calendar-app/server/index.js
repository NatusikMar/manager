import "./loadEnv.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import next from "next";
import eventsRoutes from "./routes/events.js";
import authRoutes from "./routes/auth.js";

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();

  app.use(cors({
    origin: true,//"http://localhost:3000",
    credentials: true,
  }));

  app.use(cookieParser());
  app.use(express.json());

  // API роуты
  app.use("/api", authRoutes);
  app.use("/api/events", eventsRoutes);

  // 👉 Раздача .next статических файлов
  if (!dev) {
    app.use("/_next", express.static(".next"));
    app.use("/icons", express.static(path.join("public", "icons")));
    app.use("/manifest.json", express.static(path.join("public", "manifest.json")));
    app.use("/favicon.ico", express.static(path.join("public", "favicon.ico")));
  }

  // Все остальные запросы — обрабатывает Next
  app.all("*", (req, res) => {
    return handle(req, res);
  });

  app.listen(port, () => {
    console.log(`✅ Сервер работает на http://localhost:${port}`);
  });
});
