import express from 'express';
import session from 'express-session';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';
import { meHandler } from './api/me.js';
import { registerHandler } from './api/register.js';
import { loginHandler } from './api/login.js';
import { logoutHandler } from './api/logout.js';
import { getCommentsHandler, createCommentHandler, updateOwnCommentHandler, deleteOwnCommentHandler } from './api/comments.js';
import { adminArticlesHandler, adminCommentsHandler, adminDeleteCommentHandler, adminTagsHandler, adminDeleteTagHandler, adminArticleTagsHandler, adminDeleteArticleTagHandler, getArticlesHandler } from './api/admin.js';
import { pool, initializeDatabase } from './api/config.js';
import { MySQLSessionStore } from './api/sessionStore.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const app = express();
const port = Number(process.env.PORT || 3000);

export const sessionStore = new MySQLSessionStore({ pool });

app.use(express.json());
app.use(session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET || 'filmisfaar-development-secret',
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
// UUS FUNKTSIONAALSUS 3: kasutaja saab muuta ja kustutada enda kommentaari
app.put('/api/comments/entry/:id', updateOwnCommentHandler);
app.delete('/api/comments/entry/:id', deleteOwnCommentHandler);
// UUS FUNKTSIONAALSUS 2: /api/articles toetab nüüd ?tag= ja ?q= otsinguparameetreid (vt api/admin.js)
app.get('/api/articles', getArticlesHandler);

app.get('/api/admin/articles', adminArticlesHandler);
app.post('/api/admin/articles', adminArticlesHandler);
app.put('/api/admin/articles/:id', adminArticlesHandler);
app.get('/api/admin/comments', adminCommentsHandler);
app.delete('/api/admin/comments/:id', adminDeleteCommentHandler);
app.get('/api/admin/tags', adminTagsHandler);
app.post('/api/admin/tags', adminTagsHandler);
app.delete('/api/admin/tags/:id', adminDeleteTagHandler);
app.post('/api/admin/articles/:id/tags', adminArticleTagsHandler);
app.delete('/api/admin/articles/:id/tags/:tagId', adminDeleteArticleTagHandler);

app.use(express.static(path.join(__dirname, 'dist')));
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api/')) return res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  next();
});

export async function startServer() {
  try {
    await initializeDatabase();
    app.listen(port, () => console.log(`Filmisfäär käivitatud: http://localhost:${port}`));
  } catch (error) {
    console.error('Andmebaasi ei õnnestunud lähtestada:', error.message);
    process.exit(1);
  }
}

const isDirectRun = process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;
if (isDirectRun) startServer();
