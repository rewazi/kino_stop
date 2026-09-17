import { pool } from './config.js';

function requireAdmin(req, res) {
  if (!req.session.userId) {
    res.status(401).json({ error: 'Требуется вход в систему.' });
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

    res.json({ articles: rows.map((article) => ({
      ...article,
      body: JSON.parse(article.body),
      tags: article.tags ? article.tags.split(', ') : [],
      tagIds: article.tag_ids ? article.tag_ids.split(',').map(Number) : []
    })) });
  } catch (error) {
    console.error('Ошибка получения статей:', error);
    res.status(500).json({ error: 'Не удалось получить статьи.' });
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
      return res.status(422).json({ error: 'Заполните все поля статьи.' });
    }

    try {
      const [result] = await pool.execute(
        'INSERT INTO articles (slug, section, title, subtitle, year, image, body, fact) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [slug, section || 'Общее', title, subtitle, year, image, JSON.stringify(body), fact]
      );
      await attachTags(result.insertId, tags);

      res.status(201).json({ id: result.insertId, message: 'Статья добавлена.' });
    } catch (error) {
      console.error('Ошибка создания статьи:', error);
      res.status(500).json({ error: 'Не удалось сохранить статью.' });
    }
  }

  if (req.method === 'PUT') {
    const articleId = Number(req.params.id);
    const title = String(req.body.title || '').trim();
    const body = Array.isArray(req.body.body) ? req.body.body.map((paragraph) => String(paragraph).trim()).filter(Boolean) : [];

    if (!articleId || !title || body.length === 0) {
      return res.status(422).json({ error: 'Укажите название и содержимое статьи.' });
    }

    try {
      const [result] = await pool.execute(
        'UPDATE articles SET title = ?, body = ? WHERE id = ?',
        [title, JSON.stringify(body), articleId]
      );

      if (!result.affectedRows) {
        return res.status(404).json({ error: 'Статья не найдена.' });
      }

      res.json({ success: true, message: 'Статья обновлена.' });
    } catch (error) {
      console.error('Ошибка обновления статьи:', error);
      res.status(500).json({ error: 'Не удалось обновить статью.' });
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
    console.error('Ошибка получения комментариев:', error);
    res.status(500).json({ error: 'Не удалось получить комментарии.' });
  }
}

export async function adminDeleteCommentHandler(req, res) {
  if (!requireAdmin(req, res)) return;

  const commentId = Number(req.params.id);
  if (!commentId) {
    return res.status(400).json({ error: 'Некорректный ID комментария.' });
  }

  try {
    await pool.execute('DELETE FROM comments WHERE id = ?', [commentId]);
    res.json({ success: true, message: 'Комментарий удалён.' });
  } catch (error) {
    console.error('Ошибка удаления комментария:', error);
    res.status(500).json({ error: 'Не удалось удалить комментарий.' });
  }
}

export async function adminTagsHandler(req, res) {
  if (!requireAdmin(req, res)) return;

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.execute('SELECT id, name FROM tags ORDER BY name ASC');
      res.json({ tags: rows });
    } catch (error) {
      console.error('Ошибка получения тегов:', error);
      res.status(500).json({ error: 'Не удалось получить теги.' });
    }
    return;
  }

  if (req.method === 'POST') {
    const name = String(req.body.name || '').trim();
    if (!name) {
      return res.status(422).json({ error: 'Название тега обязательно.' });
    }

    try {
      const [result] = await pool.execute('INSERT INTO tags (name) VALUES (?)', [name]);
      res.status(201).json({ id: result.insertId, name });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Такой тег уже существует.' });
      }
      console.error('Ошибка создания тега:', error);
      res.status(500).json({ error: 'Не удалось сохранить тег.' });
    }
  }
}

export async function adminDeleteTagHandler(req, res) {
  if (!requireAdmin(req, res)) return;

  const tagId = Number(req.params.id);
  if (!tagId) {
    return res.status(400).json({ error: 'Некорректный ID тега.' });
  }

  try {
    await pool.execute('DELETE FROM tags WHERE id = ?', [tagId]);
    res.json({ success: true, message: 'Тег удалён.' });
  } catch (error) {
    console.error('Ошибка удаления тега:', error);
    res.status(500).json({ error: 'Не удалось удалить тег.' });
  }
}

export async function adminArticleTagsHandler(req, res) {
  if (!requireAdmin(req, res)) return;

  const articleId = Number(req.params.id);
  const tagName = String(req.body.tag || '').trim();

  if (!articleId || !tagName) {
    return res.status(422).json({ error: 'Укажите статью и тег.' });
  }

  try {
    await attachTags(articleId, [tagName]);
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Ошибка привязки тега:', error);
    res.status(500).json({ error: 'Не удалось сохранить тег для статьи.' });
  }
}

export async function adminDeleteArticleTagHandler(req, res) {
  if (!requireAdmin(req, res)) return;

  const articleId = Number(req.params.id);
  const tagId = Number(req.params.tagId);
  if (!articleId || !tagId) {
    return res.status(400).json({ error: 'Некорректная статья или тег.' });
  }

  try {
    await pool.execute('DELETE FROM article_tags WHERE article_id = ? AND tag_id = ?', [articleId, tagId]);
    res.json({ success: true, message: 'Тег убран со статьи.' });
  } catch (error) {
    console.error('Ошибка удаления тега со статьи:', error);
    res.status(500).json({ error: 'Не удалось убрать тег со статьи.' });
  }
}
