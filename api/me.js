import { pool, publicUser } from './config.js';

export async function meHandler(req, res) {
  if (!req.session.userId) return res.json({ user: null });

  try {
    const [rows] = await pool.execute('SELECT id, name, email FROM users WHERE id = ?', [req.session.userId]);
    res.json({ user: rows[0] ? publicUser(rows[0]) : null });
  } catch {
    res.status(500).json({ error: 'Не удалось проверить сессию.' });
  }
}

export default meHandler;
