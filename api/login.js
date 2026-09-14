import bcrypt from 'bcryptjs';
import { pool, publicUser } from './config.js';

export async function loginHandler(req, res) {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  try {
    const [rows] = await pool.execute('SELECT id, name, email, password_hash FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Неверный email или пароль.' });
    }

    req.session.regenerate((error) => {
      if (error) return res.status(500).json({ error: 'Не удалось создать сессию.' });
      req.session.userId = user.id;
      res.json({ user: publicUser(user) });
    });
  } catch {
    res.status(500).json({ error: 'Не удалось выполнить вход.' });
  }
}

export default loginHandler;
