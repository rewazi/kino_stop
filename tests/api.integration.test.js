import bcrypt from 'bcryptjs';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const execute = vi.fn();

vi.mock('../api/config.js', () => ({
  pool: { execute },
  initializeDatabase: vi.fn(),
  publicUser: (user) => ({ id: user.id, name: user.name, email: user.email, role: user.role || 'user' }),
  validateCredentials: (name, email, password, isRegistration = false) => {
    if (isRegistration && (name.length < 2 || name.length > 80)) return 'Имя должно содержать от 2 до 80 символов.';
    if (!/^\S+@\S+\.\S+$/.test(email)) return 'Введите корректный email.';
    if (password.length < 6) return 'Пароль должен содержать минимум 6 символов.';
    return null;
  }
}));

const { app } = await import('../server.js');

const adminHash = await bcrypt.hash('admin123', 4);

beforeEach(() => {
  execute.mockReset();
  execute.mockImplementation(async (sql) => {
    if (sql.includes('FROM users WHERE email')) return [[{ id: 1, name: 'Админ', email: 'admin@example.com', password_hash: adminHash, role: 'admin' }]];
    if (sql.includes('FROM users WHERE id')) return [[{ id: 1, name: 'Админ', email: 'admin@example.com', role: 'admin' }]];
    if (sql.includes('SELECT id, name FROM users')) return [[{ id: 1, name: 'Админ' }]];
    if (sql.includes('FROM articles')) return [[{ id: 1, slug: 'silent', section: 'Истоки', title: 'Тест', subtitle: 'Описание', year: '1895', image: 'image', fact: 'Факт', body: '["Текст"]', tags: 'кино, история', tag_ids: '2,3' }]];
    if (sql.includes('FROM tags')) return [[{ id: 2, name: 'кино' }, { id: 3, name: 'история' }]];
    if (sql.includes('FROM comments WHERE article_key')) return [[{ id: 1, article_key: 'silent', user_id: 1, name: 'Админ', text: 'Отлично', created_at: new Date('2026-01-01T00:00:00Z') }]];
    if (sql.includes('FROM comments WHERE id')) return [[{ id: 2, article_key: 'silent', user_id: 1, name: 'Админ', text: 'Новый', created_at: new Date('2026-01-01T00:00:00Z') }]];
    if (sql.includes('INSERT INTO users')) return [{ insertId: 2 }];
    if (sql.includes('INSERT INTO comments')) return [{ insertId: 2 }];
    return [{ affectedRows: 1, insertId: 4 }];
  });
});

describe('API integration', () => {
  it('rejects invalid registration data', async () => {
    const response = await request(app).post('/api/register').send({ name: 'A', email: 'bad', password: '1' });
    expect(response.status).toBe(422);
    expect(response.body.error).toBeTruthy();
  });

  it('registers a user and creates a session', async () => {
    const response = await request(app).post('/api/register').send({ name: 'Иван', email: 'ivan@example.com', password: 'secret123' });
    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe('ivan@example.com');
  });

  it('logs in an admin and exposes the admin role', async () => {
    const agent = request.agent(app);
    const response = await agent.post('/api/login').send({ email: 'admin@example.com', password: 'admin123' });
    expect(response.status).toBe(200);
    expect(response.body.user.role).toBe('admin');
    expect((await agent.get('/api/me')).body.user.role).toBe('admin');
  });

  it('rejects invalid login and returns an empty session', async () => {
    const agent = request.agent(app);
    expect((await agent.post('/api/login').send({ email: 'admin@example.com', password: 'wrong' })).status).toBe(401);
    expect((await agent.get('/api/me')).body.user).toBeNull();
  });

  it('requires authentication for comments', async () => {
    const response = await request(app).post('/api/comments/silent').send({ text: 'Комментарий' });
    expect(response.status).toBe(401);
  });

  it('creates a comment for an authenticated user', async () => {
    const agent = request.agent(app);
    await agent.post('/api/login').send({ email: 'admin@example.com', password: 'admin123' });
    const response = await agent.post('/api/comments/silent').send({ text: 'Комментарий' });
    expect(response.status).toBe(201);
    expect(response.body.comment.text).toBe('Новый');
  });

  it('validates comment text before writing it', async () => {
    const agent = request.agent(app);
    await agent.post('/api/login').send({ email: 'admin@example.com', password: 'admin123' });
    expect((await agent.post('/api/comments/silent').send({ text: 'x' })).status).toBe(422);
    expect((await request(app).get('/api/comments/')).status).toBe(404);
  });

  it('returns articles with tag names and ids', async () => {
    const response = await request(app).get('/api/articles');
    expect(response.status).toBe(200);
    expect(response.body.articles[0].tags).toEqual(['кино', 'история']);
    expect(response.body.articles[0].tagIds).toEqual([2, 3]);
  });

  it('serves admin articles and tags after login', async () => {
    const agent = request.agent(app);
    await agent.post('/api/login').send({ email: 'admin@example.com', password: 'admin123' });
    expect((await agent.get('/api/admin/articles')).status).toBe(200);
    expect((await agent.get('/api/admin/tags')).body.tags).toHaveLength(2);
  });

  it('supports admin article and tag CRUD actions', async () => {
    const agent = request.agent(app);
    await agent.post('/api/login').send({ email: 'admin@example.com', password: 'admin123' });

    expect((await agent.post('/api/admin/articles').send({
      slug: 'new', section: 'Раздел', title: 'Новая', subtitle: 'Описание', year: '2026', image: 'image', fact: 'Факт', body: ['Текст'], tags: 'кино'
    })).status).toBe(201);
    expect((await agent.put('/api/admin/articles/1').send({ title: 'Изменённая', body: ['Новый текст'], fact: 'Новая заметка' })).status).toBe(200);
    expect((await agent.post('/api/admin/tags').send({ name: 'новый тег' })).status).toBe(201);
    expect((await agent.post('/api/admin/articles/1/tags').send({ tag: 'кино' })).status).toBe(201);
    expect((await agent.delete('/api/admin/articles/1/tags/2')).status).toBe(200);
    expect((await agent.delete('/api/admin/tags/2')).status).toBe(200);
  });

  it('deletes comments as an administrator and logs out', async () => {
    const agent = request.agent(app);
    await agent.post('/api/login').send({ email: 'admin@example.com', password: 'admin123' });
    expect((await agent.get('/api/admin/comments')).status).toBe(200);
    expect((await agent.delete('/api/admin/comments/1')).status).toBe(200);
    expect((await agent.post('/api/logout').send({})).status).toBe(200);
    expect((await agent.get('/api/admin/tags')).status).toBe(401);
  });
});