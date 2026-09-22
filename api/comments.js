import { pool } from './config.js';

export async function getCommentsHandler(req, res) {
  const articleKey = String(req.params.articleKey || '').trim();

  if (!articleKey) {
    return res.status(400).json({ error: 'Vale artikli võti.' });
  }

  try {
    const [rows] = await pool.execute(
      'SELECT id, article_key, user_id, name, text, created_at FROM comments WHERE article_key = ? ORDER BY created_at DESC',
      [articleKey]
    );

    const comments = rows.map((comment) => ({
      ...comment,
      created_at: new Date(comment.created_at).toISOString()
    }));

    res.json({ comments });
  } catch (error) {
    console.error('Kommentaaride laadimise viga:', error);
    res.status(500).json({ error: 'Kommentaaride laadimine ebaõnnestus.' });
  }
}

export async function createCommentHandler(req, res) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Ainult registreeritud kasutajad saavad kommenteerida.' });
  }

  const articleKey = String(req.params.articleKey || '').trim();
  const text = String(req.body.text || '').trim();

  if (!articleKey) {
    return res.status(400).json({ error: 'Vale artikli võti.' });
  }

  if (text.length < 2 || text.length > 500) {
    return res.status(422).json({ error: 'Kommentaar peab sisaldama 2 kuni 500 tähemärki.' });
  }

  try {
    const [userRows] = await pool.execute('SELECT id, name FROM users WHERE id = ?', [req.session.userId]);
    const user = userRows[0];

    if (!user) {
      return res.status(401).json({ error: 'Kasutajat ei leitud. Logige uuesti sisse.' });
    }

    const [result] = await pool.execute(
      'INSERT INTO comments (article_key, user_id, name, text) VALUES (?, ?, ?, ?)',
      [articleKey, user.id, user.name, text]
    );

    const [rows] = await pool.execute(
      'SELECT id, article_key, user_id, name, text, created_at FROM comments WHERE id = ?',
      [result.insertId]
    );

    const comment = rows[0];

    res.status(201).json({
      comment: {
        ...comment,
        created_at: new Date(comment.created_at).toISOString()
      }
    });
  } catch (error) {
    console.error('Kommentaari loomise viga:', error);
    res.status(500).json({ error: 'Kommentaari salvestamine ebaõnnestus.' });
  }
}

// --- UUS FUNKTSIONAALSUS 3: kasutaja saab muuta või kustutada enda kommentaari ---
export async function updateOwnCommentHandler(req, res) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Ainult registreeritud kasutajad saavad kommentaare muuta.' });
  }

  const commentId = Number(req.params.id);
  const text = String(req.body.text || '').trim();

  if (!commentId) {
    return res.status(400).json({ error: 'Vale kommentaari ID.' });
  }

  if (text.length < 2 || text.length > 500) {
    return res.status(422).json({ error: 'Kommentaar peab sisaldama 2 kuni 500 tähemärki.' });
  }

  try {
    const [rows] = await pool.execute('SELECT id, user_id FROM comments WHERE id = ?', [commentId]);
    const comment = rows[0];

    if (!comment) {
      return res.status(404).json({ error: 'Kommentaari ei leitud.' });
    }

    if (comment.user_id !== req.session.userId) {
      return res.status(403).json({ error: 'Saate muuta ainult enda kommentaare.' });
    }

    await pool.execute('UPDATE comments SET text = ? WHERE id = ?', [text, commentId]);
    res.json({ success: true, message: 'Kommentaar on uuendatud.' });
  } catch (error) {
    console.error('Kommentaari muutmise viga:', error);
    res.status(500).json({ error: 'Kommentaari muutmine ebaõnnestus.' });
  }
}

export async function deleteOwnCommentHandler(req, res) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Ainult registreeritud kasutajad saavad kommentaare kustutada.' });
  }

  const commentId = Number(req.params.id);
  if (!commentId) {
    return res.status(400).json({ error: 'Vale kommentaari ID.' });
  }

  try {
    const [rows] = await pool.execute('SELECT id, user_id FROM comments WHERE id = ?', [commentId]);
    const comment = rows[0];

    if (!comment) {
      return res.status(404).json({ error: 'Kommentaari ei leitud.' });
    }

    if (comment.user_id !== req.session.userId) {
      return res.status(403).json({ error: 'Saate kustutada ainult enda kommentaare.' });
    }

    await pool.execute('DELETE FROM comments WHERE id = ?', [commentId]);
    res.json({ success: true, message: 'Kommentaar on kustutatud.' });
  } catch (error) {
    console.error('Kommentaari kustutamise viga:', error);
    res.status(500).json({ error: 'Kommentaari kustutamine ebaõnnestus.' });
  }
}

export default { getCommentsHandler, createCommentHandler, updateOwnCommentHandler, deleteOwnCommentHandler };
