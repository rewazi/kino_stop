import { pool } from './config.js';

export async function getCommentsHandler(req, res) {
  const articleKey = String(req.params.articleKey || '').trim();

  if (!articleKey) {
    return res.status(400).json({ error: 'Некорректный ключ статьи.' });
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
    console.error('Ошибка загрузки комментариев:', error);
    res.status(500).json({ error: 'Не удалось загрузить комментарии.' });
  }
}

export async function createCommentHandler(req, res) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Только зарегистрированные пользователи могут писать комментарии.' });
  }

  const articleKey = String(req.params.articleKey || '').trim();
  const text = String(req.body.text || '').trim();

  if (!articleKey) {
    return res.status(400).json({ error: 'Некорректный ключ статьи.' });
  }

  if (text.length < 2 || text.length > 500) {
    return res.status(422).json({ error: 'Комментарий должен содержать от 2 до 500 символов.' });
  }

  try {
    const [userRows] = await pool.execute('SELECT id, name FROM users WHERE id = ?', [req.session.userId]);
    const user = userRows[0];

    if (!user) {
      return res.status(401).json({ error: 'Пользователь не найден. Выполните вход заново.' });
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
    console.error('Ошибка создания комментария:', error);
    res.status(500).json({ error: 'Не удалось сохранить комментарий.' });
  }
}

export default { getCommentsHandler, createCommentHandler };
