import "./loadEnv.js";

import express from "express";
import cors from "cors";
import eventsRoutes from "./routes/events.js";
import authRoutes from "./routes/auth.js";


const app = express();
const port = 3001;

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());
app.use('/api', authRoutes);
app.use('/api/events', eventsRoutes);

app.get('/', (req, res) => {
  res.send('Сервер работает!');
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
