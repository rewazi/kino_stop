import bcrypt from 'bcryptjs';
import { pool, publicUser } from './config.js';

// --- UUS FUNKTSIONAALSUS 1: kaitse jõuruteoreetilise (brute-force) sisselogimise vastu ---
// Mälulekete ja DoS rünnakute vältimiseks on vahemälu piiratud (MAX_CACHE_ENTRIES = 5000)
// ning aegunud katsed eemaldatakse automaatselt nii päringute ajal kui ka taustatööna.
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutit
const MAX_CACHE_ENTRIES = 5000;

export function pruneExpiredAttempts(now = Date.now()) {
  for (const [key, state] of loginAttempts.entries()) {
    const isLocked = state.lockedUntil && state.lockedUntil > now;
    const isRecent = (now - (state.updatedAt || 0)) < LOCKOUT_MS;
    if (!isLocked && !isRecent) {
      loginAttempts.delete(key);
    }
  }
}

export function resetLoginAttempts() {
  loginAttempts.clear();
}

const cleanupTimer = setInterval(() => pruneExpiredAttempts(), 5 * 60 * 1000);
if (cleanupTimer.unref) cleanupTimer.unref();

function getAttemptState(key) {
  const state = loginAttempts.get(key);
  if (!state) return { count: 0, lockedUntil: 0, updatedAt: 0 };

  const now = Date.now();
  const isLocked = state.lockedUntil && state.lockedUntil > now;
  const isRecent = (now - (state.updatedAt || 0)) < LOCKOUT_MS;

  // Kui blokeering on möödas ja viimasest katsest on möödas üle 15 min, kustutame kirje
  if (!isLocked && !isRecent) {
    loginAttempts.delete(key);
    return { count: 0, lockedUntil: 0, updatedAt: 0 };
  }

  return state;
}

function registerFailedAttempt(key) {
  const now = Date.now();
  const state = getAttemptState(key);
  const count = state.count + 1;
  const lockedUntil = count >= MAX_ATTEMPTS ? now + LOCKOUT_MS : 0;

  // Kui mälu limiit on täis, teeme esmalt aegunud kirjete puhastuse
  if (loginAttempts.size >= MAX_CACHE_ENTRIES) {
    pruneExpiredAttempts(now);
  }

  // Kui vahemälu on ikka täis, eemaldame vanima kirje (FIFO/LRU kaitse DoS vastu)
  if (loginAttempts.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = loginAttempts.keys().next().value;
    if (oldestKey) loginAttempts.delete(oldestKey);
  }

  loginAttempts.set(key, { count, lockedUntil, updatedAt: now });
}

function clearAttempts(key) {
  loginAttempts.delete(key);
}

export async function loginHandler(req, res) {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
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
      req.session.role = user.role || 'user';
      res.json({ user: publicUser(user) });
    });
  } catch {
    res.status(500).json({ error: 'Sisselogimine ebaõnnestus.' });
  }
}

export { loginAttempts, registerFailedAttempt, getAttemptState, clearAttempts, MAX_ATTEMPTS, LOCKOUT_MS, MAX_CACHE_ENTRIES };
export default loginHandler;

