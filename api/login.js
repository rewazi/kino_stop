import bcrypt from 'bcryptjs';
import { pool, publicUser } from './config.js';

// --- UUS FUNKTSIONAALSUS 1: kaitse jõuruteoreetilise (brute-force) sisselogimise vastu ---
// Peame lihtsat mällu salvestatud loendurit e-posti aadressi kohta. Kui liiga paljud
// katsed lühikese aja jooksul ebaõnnestuvad, blokeerime järgmised katsed ajutiselt.
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutit

function getAttemptState(key) {
  const state = loginAttempts.get(key);
  if (!state) return { count: 0, lockedUntil: 0 };
  return state;
}

function registerFailedAttempt(key) {
  const state = getAttemptState(key);
  const count = state.count + 1;
  const lockedUntil = count >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_MS : 0;
  loginAttempts.set(key, { count, lockedUntil });
}

function clearAttempts(key) {
  loginAttempts.delete(key);
}

export async function loginHandler(req, res) {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const attemptKey = `${email}:${req.ip}`;

  const { lockedUntil } = getAttemptState(attemptKey);
  if (lockedUntil && lockedUntil > Date.now()) {
    const waitMinutes = Math.ceil((lockedUntil - Date.now()) / 60000);
    return res.status(429).json({ error: `Liiga palju ebaõnnestunud katseid. Proovige uuesti ${waitMinutes} min pärast.` });
  }

  try {
    const [rows] = await pool.execute('SELECT id, name, email, password_hash, role FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      registerFailedAttempt(attemptKey);
      return res.status(401).json({ error: 'Vale e-post või parool.' });
    }

    clearAttempts(attemptKey);

    req.session.regenerate((error) => {
      if (error) return res.status(500).json({ error: 'Seansi loomine ebaõnnestus.' });
      req.session.userId = user.id;
      res.json({ user: publicUser(user) });
    });
  } catch {
    res.status(500).json({ error: 'Sisselogimine ebaõnnestus.' });
  }
}

export default loginHandler;
