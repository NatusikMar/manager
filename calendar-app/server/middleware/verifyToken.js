import jwt from 'jsonwebtoken';


export default function verifyToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Нет токена' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // теперь доступно req.user.id
    next();
  } catch (err) {
    console.error('Ошибка верификации токена:', err);
    res.status(401).json({ error: 'Неверный токен' });
  }

  
}
