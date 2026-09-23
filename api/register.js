import bcrypt from 'bcryptjs';
import { pool, validateCredentials } from './config.js';

export async function registerHandler(req, res) {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const validationError = validateCredentials(name, email, password, true);

  if (validationError) {
    return res.status(422).json({ error: validationError });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, passwordHash]
    );

    req.session.userId = result.insertId;
    req.session.role = 'user';
    req.session.save((error) => {
      if (error) return res.status(500).json({ error: 'Seansi salvestamine ebaõnnestus.' });
      res.status(201).json({ user: { id: result.insertId, name, email, role: 'user' } });
    });
  } catch (error) {
    console.error('Registreerimise viga:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Selle e-postiga kasutaja on juba registreeritud.' });
    }

    res.status(500).json({ error: 'Konto loomine ebaõnnestus.' });
  }
}

export default registerHandler;
