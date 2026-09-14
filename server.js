import express from 'express';
import session from 'express-session';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { meHandler } from './api/me.js';
import { registerHandler } from './api/register.js';
import { loginHandler } from './api/login.js';
import { logoutHandler } from './api/logout.js';
import { getCommentsHandler, createCommentHandler } from './api/comments.js';
import { adminArticlesHandler, adminCommentsHandler, adminDeleteCommentHandler, adminTagsHandler, adminArticleTagsHandler, getArticlesHandler } from './api/admin.js';
import { initializeDatabase } from './api/config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'kinosfera-development-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 24 * 7 }
}));

const authHandlers = {
  me: meHandler,
  register: registerHandler,
  login: loginHandler,
  logout: logoutHandler
};

for (const [name, handler] of Object.entries(authHandlers)) {
  app.get(`/api/${name}`, handler);
  app.get(`/api/${name}.php`, handler);
  app.post(`/api/${name}`, handler);
  app.post(`/api/${name}.php`, handler);
}

app.get('/api/comments/:articleKey', getCommentsHandler);
app.post('/api/comments/:articleKey', createCommentHandler);
app.get('/api/articles', getArticlesHandler);

app.get('/api/admin/articles', adminArticlesHandler);
app.post('/api/admin/articles', adminArticlesHandler);
app.get('/api/admin/comments', adminCommentsHandler);
app.delete('/api/admin/comments/:id', adminDeleteCommentHandler);
app.get('/api/admin/tags', adminTagsHandler);
app.post('/api/admin/tags', adminTagsHandler);
app.post('/api/admin/articles/:id/tags', adminArticleTagsHandler);

app.use(express.static(path.join(__dirname, 'dist')));
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api/')) return res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  next();
});

async function startServer() {
  try {
    await initializeDatabase();
    app.listen(port, () => console.log(`Киносфера запущена: http://localhost:${port}`));
  } catch (error) {
    console.error('Не удалось инициализировать базу данных:', error.message);
    process.exit(1);
  }
}

startServer();
