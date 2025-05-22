import jwt from "jsonwebtoken";

const JWT_SECRET = "supersecret";

function authenticateToken(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: "Не авторизован." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Неверный токен." });
    }

    req.user = user;
    next();
  });
}

export default authenticateToken;
