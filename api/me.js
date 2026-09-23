import { pool, publicUser } from './config.js';

export async function meHandler(req, res) {
  if (!req.session.userId) return res.json({ user: null });

  try {
    const [rows] = await pool.execute('SELECT id, name, email, role FROM users WHERE id = ?', [req.session.userId]);
    const user = rows[0];
    if (user) {
      req.session.role = user.role || 'user';
    }
    res.json({ user: user ? publicUser(user) : null });
  } catch {
    res.status(500).json({ error: 'Seansi kontrollimine ebaõnnestus.' });
  }
}

export default meHandler;
