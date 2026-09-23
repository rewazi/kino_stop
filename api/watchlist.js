import { pool } from './config.js';

export function calculateBadges(items = []) {
  const badges = [];
  const watchedSlugs = new Set(items.filter((i) => i.status === 'watched' || i.status === 'favorite').map((i) => i.article_slug));

  if (items.some((i) => i.status === 'watched' || i.status === 'favorite')) {
    badges.push({ id: 'first_step', name: 'Kinoavastaja', desc: 'Esimene vaadatud peatükk kinoajaloos' });
  }

  if (items.some((i) => i.status === 'favorite')) {
    badges.push({ id: 'cinephile', name: 'Kirglik Kinofiil', desc: 'Isikliku lemmikfilmi salvestaja' });
  }

  if (watchedSlugs.has('silent')) {
    badges.push({ id: 'silent_scholar', name: 'Tummfilmi Teadlane', desc: 'Tummkino grammatika mõistja' });
  }

  if (watchedSlugs.has('nouvelle')) {
    badges.push({ id: 'new_wave_rebel', name: 'Uue Laine Mässaja', desc: 'Prantsuse autorikino austaja' });
  }

  if (watchedSlugs.has('blockbuster')) {
    badges.push({ id: 'blockbuster_buff', name: 'Suveblokbasterite Meister', desc: 'Suure ekraani ja kassahittide tundja' });
  }

  return badges;
}

export async function getWatchlistHandler(req, res) {
  const userId = req.session?.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Palun logi sisse oma arhiivi vaatamiseks.' });
  }

  try {
    const [rows] = await pool.execute(
      'SELECT id, user_id, article_slug, status, rating, notes, created_at, updated_at FROM watchlist WHERE user_id = ? ORDER BY updated_at DESC',
      [userId]
    );

    const items = rows || [];
    const watchedCount = items.filter((i) => i.status === 'watched').length;
    const wantCount = items.filter((i) => i.status === 'want').length;
    const favoriteCount = items.filter((i) => i.status === 'favorite').length;
    const totalWatchedOrFav = items.filter((i) => i.status === 'watched' || i.status === 'favorite').length;
    const progressPercent = Math.min(100, Math.round((totalWatchedOrFav / 3) * 100));

    res.json({
      items,
      stats: {
        total: items.length,
        watchedCount,
        wantCount,
        favoriteCount,
        progressPercent
      },
      badges: calculateBadges(items)
    });
  } catch {
    res.status(500).json({ error: 'Watchlisti laadimine ebaõnnestus.' });
  }
}

export async function saveWatchlistHandler(req, res) {
  const userId = req.session?.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Palun logi sisse materjali salvestamiseks.' });
  }

  const articleSlug = String(req.body?.article_slug || '').trim().toLowerCase();
  const status = ['want', 'watched', 'favorite'].includes(req.body?.status) ? req.body.status : 'want';
  const rating = req.body?.rating ? Math.max(1, Math.min(5, Number(req.body.rating))) : null;
  const notes = req.body?.notes !== undefined ? String(req.body.notes).slice(0, 500) : null;

  if (!articleSlug) {
    return res.status(400).json({ error: 'Artikli identifikaator on kohustuslik.' });
  }

  try {
    await pool.execute(
      `INSERT INTO watchlist (user_id, article_slug, status, rating, notes)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE status = VALUES(status), rating = VALUES(rating), notes = VALUES(notes), updated_at = CURRENT_TIMESTAMP`,
      [userId, articleSlug, status, rating, notes]
    );

    res.json({
      success: true,
      item: { article_slug: articleSlug, status, rating, notes }
    });
  } catch {
    res.status(500).json({ error: 'Kirje salvestamine watchlisti ebaõnnestus.' });
  }
}

export async function deleteWatchlistHandler(req, res) {
  const userId = req.session?.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Palun logi sisse kirje eemaldamiseks.' });
  }

  const articleSlug = String(req.params.articleSlug || '').trim().toLowerCase();
  if (!articleSlug) {
    return res.status(400).json({ error: 'Artikli identifikaator on kohustuslik.' });
  }

  try {
    await pool.execute('DELETE FROM watchlist WHERE user_id = ? AND article_slug = ?', [userId, articleSlug]);
    res.json({ success: true, message: 'Kirje edukalt eemaldatud.' });
  } catch {
    res.status(500).json({ error: 'Kirje eemaldamine ebaõnnestus.' });
  }
}
