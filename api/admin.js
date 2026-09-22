import { pool } from './config.js';

function requireAdmin(req, res) {
  if (!req.session.userId) {
    res.status(401).json({ error: 'Sisselogimine on nõutav.' });
    return false;
  }

  return true;
}

async function attachTags(articleId, tagNames) {
  for (const rawName of tagNames) {
    const name = String(rawName || '').trim();
    if (!name) continue;

    let [tagRows] = await pool.execute('SELECT id FROM tags WHERE name = ?', [name]);
    let tagId;
    if (tagRows.length) {
      tagId = tagRows[0].id;
    } else {
      const [insertTag] = await pool.execute('INSERT INTO tags (name) VALUES (?)', [name]);
      tagId = insertTag.insertId;
    }

    await pool.execute(
      'INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE article_id = article_id',
      [articleId, tagId]
    );
  }
}

export async function getArticlesHandler(req, res) {
  // --- UUS FUNKTSIONAALSUS 2: artiklite otsimine sildi ja/või märksõna järgi ---
  // Toetab valikulisi päringuparameetreid ?tag=<sildi nimi> ja ?q=<otsisõna>.
  const tagFilter = String(req.query.tag || '').trim();
  const searchQuery = String(req.query.q || '').trim().toLowerCase();

  try {
    const [rows] = await pool.execute(`
      SELECT a.id, a.slug, a.section, a.title, a.subtitle, a.year, a.image, a.fact, a.body,
              GROUP_CONCAT(t.name ORDER BY t.name SEPARATOR ', ') AS tags,
              GROUP_CONCAT(t.id ORDER BY t.name SEPARATOR ',') AS tag_ids
      FROM articles a
      LEFT JOIN article_tags at ON at.article_id = a.id
      LEFT JOIN tags t ON t.id = at.tag_id
      GROUP BY a.id, a.slug, a.section, a.title, a.subtitle, a.year, a.image, a.fact, a.body
      ORDER BY a.id ASC
    `);

    let articles = rows.map((article) => ({
      ...article,
      body: JSON.parse(article.body),
      tags: article.tags ? article.tags.split(', ') : [],
      tagIds: article.tag_ids ? article.tag_ids.split(',').map(Number) : []
    }));

    if (tagFilter) {
      articles = articles.filter((article) => article.tags.includes(tagFilter));
    }

    if (searchQuery) {
      articles = articles.filter((article) =>
        article.title.toLowerCase().includes(searchQuery) ||
        article.subtitle.toLowerCase().includes(searchQuery) ||
        article.body.some((paragraph) => paragraph.toLowerCase().includes(searchQuery))
      );
    }

    res.json({ articles });
  } catch (error) {
    console.error('Artiklite laadimise viga:', error);
    res.status(500).json({ error: 'Artiklite laadimine ebaõnnestus.' });
  }
}

export async function adminArticlesHandler(req, res) {
  if (!requireAdmin(req, res)) return;

  if (req.method === 'GET') {
    return getArticlesHandler(req, res);
  }

  if (req.method === 'POST') {
    const payload = req.body || {};
    const slug = String(payload.slug || '').trim();
    const section = String(payload.section || '').trim();
    const title = String(payload.title || '').trim();
    const subtitle = String(payload.subtitle || '').trim();
    const year = String(payload.year || '').trim();
    const image = String(payload.image || '').trim();
    const fact = String(payload.fact || '').trim();
    const body = Array.isArray(payload.body) ? payload.body : [];
    const tags = String(payload.tags || '').split(',');

    if (!slug || !title || !subtitle || !year || !image || !fact || body.length === 0) {
      return res.status(422).json({ error: 'Täitke kõik artikli väljad.' });
    }

    try {
      const [result] = await pool.execute(
        'INSERT INTO articles (slug, section, title, subtitle, year, image, body, fact) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [slug, section || 'Üldine', title, subtitle, year, image, JSON.stringify(body), fact]
      );
      await attachTags(result.insertId, tags);

      res.status(201).json({ id: result.insertId, message: 'Artikkel on lisatud.' });
    } catch (error) {
      console.error('Artikli loomise viga:', error);
      res.status(500).json({ error: 'Artikli salvestamine ebaõnnestus.' });
    }
  }

  if (req.method === 'PUT') {
    const articleId = Number(req.params.id);
    const title = String(req.body.title || '').trim();
    const fact = String(req.body.fact || '').trim();
    const body = Array.isArray(req.body.body) ? req.body.body.map((paragraph) => String(paragraph).trim()).filter(Boolean) : [];

    if (!articleId || !title || !fact || body.length === 0) {
      return res.status(422).json({ error: 'Sisestage artikli pealkiri, sisu ja märkus.' });
    }

    try {
      const [result] = await pool.execute(
        'UPDATE articles SET title = ?, body = ?, fact = ? WHERE id = ?',
        [title, JSON.stringify(body), fact, articleId]
      );

      if (!result.affectedRows) {
        return res.status(404).json({ error: 'Artiklit ei leitud.' });
      }

      res.json({ success: true, message: 'Artikkel on uuendatud.' });
    } catch (error) {
      console.error('Artikli uuendamise viga:', error);
      res.status(500).json({ error: 'Artikli uuendamine ebaõnnestus.' });
    }
  }
}

export async function adminCommentsHandler(req, res) {
  if (!requireAdmin(req, res)) return;

  try {
    const [rows] = await pool.execute(`
      SELECT c.id, c.article_key, c.name, c.text, c.created_at
      FROM comments c
      ORDER BY c.created_at DESC
    `);

    res.json({ comments: rows });
  } catch (error) {
    console.error('Kommentaaride laadimise viga:', error);
    res.status(500).json({ error: 'Kommentaaride laadimine ebaõnnestus.' });
  }
}

export async function adminDeleteCommentHandler(req, res) {
  if (!requireAdmin(req, res)) return;

  const commentId = Number(req.params.id);
  if (!commentId) {
    return res.status(400).json({ error: 'Vale kommentaari ID.' });
  }

  try {
    await pool.execute('DELETE FROM comments WHERE id = ?', [commentId]);
    res.json({ success: true, message: 'Kommentaar on kustutatud.' });
  } catch (error) {
    console.error('Kommentaari kustutamise viga:', error);
    res.status(500).json({ error: 'Kommentaari kustutamine ebaõnnestus.' });
  }
}

export async function adminTagsHandler(req, res) {
  if (!requireAdmin(req, res)) return;

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.execute('SELECT id, name FROM tags ORDER BY name ASC');
      res.json({ tags: rows });
    } catch (error) {
      console.error('Siltide laadimise viga:', error);
      res.status(500).json({ error: 'Siltide laadimine ebaõnnestus.' });
    }
    return;
  }

  if (req.method === 'POST') {
    const name = String(req.body.name || '').trim();
    if (!name) {
      return res.status(422).json({ error: 'Sildi nimi on kohustuslik.' });
    }

    try {
      const [result] = await pool.execute('INSERT INTO tags (name) VALUES (?)', [name]);
      res.status(201).json({ id: result.insertId, name });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Selline silt on juba olemas.' });
      }
      console.error('Sildi loomise viga:', error);
      res.status(500).json({ error: 'Sildi salvestamine ebaõnnestus.' });
    }
  }
}

export async function adminDeleteTagHandler(req, res) {
  if (!requireAdmin(req, res)) return;

  const tagId = Number(req.params.id);
  if (!tagId) {
    return res.status(400).json({ error: 'Vale sildi ID.' });
  }

  try {
    await pool.execute('DELETE FROM tags WHERE id = ?', [tagId]);
    res.json({ success: true, message: 'Silt on kustutatud.' });
  } catch (error) {
    console.error('Sildi kustutamise viga:', error);
    res.status(500).json({ error: 'Sildi kustutamine ebaõnnestus.' });
  }
}

export async function adminArticleTagsHandler(req, res) {
  if (!requireAdmin(req, res)) return;

  const articleId = Number(req.params.id);
  const tagName = String(req.body.tag || '').trim();

  if (!articleId || !tagName) {
    return res.status(422).json({ error: 'Määrake artikkel ja silt.' });
  }

  try {
    await attachTags(articleId, [tagName]);
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Sildi sidumise viga:', error);
    res.status(500).json({ error: 'Sildi salvestamine artikli jaoks ebaõnnestus.' });
  }
}

export async function adminDeleteArticleTagHandler(req, res) {
  if (!requireAdmin(req, res)) return;

  const articleId = Number(req.params.id);
  const tagId = Number(req.params.tagId);
  if (!articleId || !tagId) {
    return res.status(400).json({ error: 'Vale artikkel või silt.' });
  }

  try {
    await pool.execute('DELETE FROM article_tags WHERE article_id = ? AND tag_id = ?', [articleId, tagId]);
    res.json({ success: true, message: 'Silt on artiklilt eemaldatud.' });
  } catch (error) {
    console.error('Sildi eemaldamise viga artiklilt:', error);
    res.status(500).json({ error: 'Sildi eemaldamine artiklilt ebaõnnestus.' });
  }
}
