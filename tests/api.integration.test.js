import bcrypt from 'bcryptjs';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const execute = vi.fn();

vi.mock('../api/config.js', () => ({
  pool: { execute },
  initializeDatabase: vi.fn(),
  publicUser: (user) => ({ id: user.id, name: user.name, email: user.email, role: user.role || 'user' }),
  validateCredentials: (name, email, password, isRegistration = false) => {
    if (isRegistration && (name.length < 2 || name.length > 80)) return 'Nimi peab olema 2–80 tähemärki pikk.';
    if (!/^\S+@\S+\.\S+$/.test(email)) return 'Sisestage kehtiv e-posti aadress.';
    if (password.length < 6) return 'Parool peab sisaldama vähemalt 6 tähemärki.';
    return null;
  }
}));

const { app } = await import('../server.js');

const adminHash = await bcrypt.hash('admin123', 4);

beforeEach(() => {
  execute.mockReset();
  execute.mockImplementation(async (sql) => {
    if (sql.includes('FROM users WHERE email')) return [[{ id: 1, name: 'Admin', email: 'admin@example.com', password_hash: adminHash, role: 'admin' }]];
    if (sql.includes('FROM users WHERE id')) return [[{ id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' }]];
    if (sql.includes('SELECT id, name FROM users')) return [[{ id: 1, name: 'Admin' }]];
    if (sql.includes('SELECT id, user_id FROM comments')) return [[{ id: 1, user_id: 1 }]];
    if (sql.includes('FROM articles')) return [[{ id: 1, slug: 'silent', section: 'Algused', title: 'Test', subtitle: 'Kirjeldus', year: '1895', image: 'image', fact: 'Fakt', body: '["Tekst"]', tags: 'film, ajalugu', tag_ids: '2,3' }]];
    if (sql.includes('FROM tags')) return [[{ id: 2, name: 'film' }, { id: 3, name: 'ajalugu' }]];
    if (sql.includes('FROM comments WHERE article_key')) return [[{ id: 1, article_key: 'silent', user_id: 1, name: 'Admin', text: 'Suurepärane', created_at: new Date('2026-01-01T00:00:00Z') }]];
    if (sql.includes('FROM comments WHERE id')) return [[{ id: 2, article_key: 'silent', user_id: 1, name: 'Admin', text: 'Uus', created_at: new Date('2026-01-01T00:00:00Z') }]];
    if (sql.includes('INSERT INTO users')) return [{ insertId: 2 }];
    if (sql.includes('INSERT INTO comments')) return [{ insertId: 2 }];
    return [{ affectedRows: 1, insertId: 4 }];
  });
});

describe('API integratsioon', () => {
  it('lükkab tagasi vigased registreerimisandmed', async () => {
    const response = await request(app).post('/api/register').send({ name: 'A', email: 'bad', password: '1' });
    expect(response.status).toBe(422);
    expect(response.body.error).toBeTruthy();
  });

  it('registreerib kasutaja ja loob seansi', async () => {
    const response = await request(app).post('/api/register').send({ name: 'Jaan', email: 'jaan@example.com', password: 'secret123' });
    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe('jaan@example.com');
  });

  it('logib administraatori sisse ja näitab admin-rolli', async () => {
    const agent = request.agent(app);
    const response = await agent.post('/api/login').send({ email: 'admin@example.com', password: 'admin123' });
    expect(response.status).toBe(200);
    expect(response.body.user.role).toBe('admin');
    expect((await agent.get('/api/me')).body.user.role).toBe('admin');
  });

  it('lükkab tagasi vale sisselogimise ja tagastab tühja seansi', async () => {
    const agent = request.agent(app);
    expect((await agent.post('/api/login').send({ email: 'admin@example.com', password: 'wrong' })).status).toBe(401);
    expect((await agent.get('/api/me')).body.user).toBeNull();
  });

  it('nõuab kommenteerimiseks autentimist', async () => {
    const response = await request(app).post('/api/comments/silent').send({ text: 'Kommentaar' });
    expect(response.status).toBe(401);
  });

  it('loob kommentaari autenditud kasutaja jaoks', async () => {
    const agent = request.agent(app);
    await agent.post('/api/login').send({ email: 'admin@example.com', password: 'admin123' });
    const response = await agent.post('/api/comments/silent').send({ text: 'Kommentaar' });
    expect(response.status).toBe(201);
    expect(response.body.comment.text).toBe('Uus');
  });

  it('kontrollib kommentaari teksti enne salvestamist', async () => {
    const agent = request.agent(app);
    await agent.post('/api/login').send({ email: 'admin@example.com', password: 'admin123' });
    expect((await agent.post('/api/comments/silent').send({ text: 'x' })).status).toBe(422);
    expect((await request(app).get('/api/comments/')).status).toBe(404);
  });

  it('lubab kasutajal muuta ja kustutada enda kommentaari (uus funktsionaalsus)', async () => {
    const agent = request.agent(app);
    await agent.post('/api/login').send({ email: 'admin@example.com', password: 'admin123' });
    expect((await agent.put('/api/comments/entry/1').send({ text: 'Muudetud tekst' })).status).toBe(200);
    expect((await agent.delete('/api/comments/entry/1')).status).toBe(200);
  });

  it('tagastab artiklid koos siltide nimede ja ID-dega ning toetab otsingut (uus funktsionaalsus)', async () => {
    const response = await request(app).get('/api/articles');
    expect(response.status).toBe(200);
    expect(response.body.articles[0].tags).toEqual(['film', 'ajalugu']);
    expect(response.body.articles[0].tagIds).toEqual([2, 3]);

    const filtered = await request(app).get('/api/articles?tag=film');
    expect(filtered.status).toBe(200);
    expect(filtered.body.articles).toHaveLength(1);

    const noMatch = await request(app).get('/api/articles?tag=puudub');
    expect(noMatch.body.articles).toHaveLength(0);
  });

  it('teenindab admin-artikleid ja -silte pärast sisselogimist', async () => {
    const agent = request.agent(app);
    await agent.post('/api/login').send({ email: 'admin@example.com', password: 'admin123' });
    expect((await agent.get('/api/admin/articles')).status).toBe(200);
    expect((await agent.get('/api/admin/tags')).body.tags).toHaveLength(2);
  });

  it('toetab admin-artikli ja -sildi CRUD-toiminguid', async () => {
    const agent = request.agent(app);
    await agent.post('/api/login').send({ email: 'admin@example.com', password: 'admin123' });

    expect((await agent.post('/api/admin/articles').send({
      slug: 'new', section: 'Osa', title: 'Uus', subtitle: 'Kirjeldus', year: '2026', image: 'image', fact: 'Fakt', body: ['Tekst'], tags: 'film'
    })).status).toBe(201);
    expect((await agent.put('/api/admin/articles/1').send({ title: 'Muudetud', body: ['Uus tekst'], fact: 'Uus märkus' })).status).toBe(200);
    expect((await agent.post('/api/admin/tags').send({ name: 'uus silt' })).status).toBe(201);
    expect((await agent.post('/api/admin/articles/1/tags').send({ tag: 'film' })).status).toBe(201);
    expect((await agent.delete('/api/admin/articles/1/tags/2')).status).toBe(200);
    expect((await agent.delete('/api/admin/tags/2')).status).toBe(200);
  });

  it('kustutab kommentaare administraatorina ja logib välja', async () => {
    const agent = request.agent(app);
    await agent.post('/api/login').send({ email: 'admin@example.com', password: 'admin123' });
    expect((await agent.get('/api/admin/comments')).status).toBe(200);
    expect((await agent.delete('/api/admin/comments/1')).status).toBe(200);
    expect((await agent.post('/api/logout').send({})).status).toBe(200);
    expect((await agent.get('/api/admin/tags')).status).toBe(401);
  });
});
