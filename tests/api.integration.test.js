import bcrypt from 'bcryptjs';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

class MockDatabase {
  constructor() {
    this.adminPasswordHash = bcrypt.hashSync('admin123', 4);
    this.userPasswordHash = bcrypt.hashSync('user123', 4);
    this.reset();
  }

  reset() {
    this.users = [
      {
        id: 1,
        name: 'Administraator',
        email: 'admin@filmisfaar.local',
        password_hash: this.adminPasswordHash,
        role: 'admin',
        created_at: new Date('2026-01-01T10:00:00Z')
      },
      {
        id: 2,
        name: 'Tavakasutaja',
        email: 'user@filmisfaar.local',
        password_hash: this.userPasswordHash,
        role: 'user',
        created_at: new Date('2026-01-02T10:00:00Z')
      }
    ];

    this.articles = [
      {
        id: 1,
        slug: 'silent',
        section: '01 / Algused',
        title: 'Kui kaader õppis hingama',
        subtitle: 'Tummfilm ei olnud hääletu.',
        year: '1895—1927',
        image: 'https://images.unsplash.com/silent.jpg',
        fact: 'Esimene avalik seanss 1895.',
        body: JSON.stringify(['Esimene lõik.', 'Teine lõik.'])
      },
      {
        id: 2,
        slug: 'nouvelle',
        section: '02 / Vaate vabadus',
        title: 'Kaamera läheb tänavale',
        subtitle: 'Prantsuse uus laine loobus stuudiost.',
        year: '1958—1968',
        image: 'https://images.unsplash.com/nouvelle.jpg',
        fact: 'Jump cut sünd.',
        body: JSON.stringify(['Uus laine Pariisis.'])
      }
    ];

    this.tags = [
      { id: 1, name: 'tummfilm' },
      { id: 2, name: 'montaaž' },
      { id: 3, name: 'uus laine' }
    ];

    this.article_tags = [
      { article_id: 1, tag_id: 1 },
      { article_id: 1, tag_id: 2 },
      { article_id: 2, tag_id: 3 }
    ];

    this.comments = [
      {
        id: 1,
        article_key: 'silent',
        user_id: 1,
        name: 'Administraator',
        text: 'Väga huvitav ajalugu.',
        created_at: new Date('2026-01-10T12:00:00Z')
      },
      {
        id: 2,
        article_key: 'silent',
        user_id: 2,
        name: 'Tavakasutaja',
        text: 'Mulle meeldis Mélièsi osa.',
        created_at: new Date('2026-01-11T14:00:00Z')
      }
    ];

    this.nextUserId = 3;
    this.nextArticleId = 3;
    this.nextTagId = 4;
    this.nextCommentId = 3;
  }

  async execute(sql, params = []) {
    const normalized = sql.replace(/\s+/g, ' ').trim();

    if (normalized.startsWith('DELETE FROM comments WHERE id = ?')) {
      const id = Number(params[0]);
      const initialLen = this.comments.length;
      this.comments = this.comments.filter((c) => c.id !== id);
      return [{ affectedRows: initialLen !== this.comments.length ? 1 : 0 }];
    }

    if (normalized.startsWith('DELETE FROM tags WHERE id = ?')) {
      const id = Number(params[0]);
      const initialLen = this.tags.length;
      this.tags = this.tags.filter((t) => t.id !== id);
      this.article_tags = this.article_tags.filter((at) => at.tag_id !== id);
      return [{ affectedRows: initialLen !== this.tags.length ? 1 : 0 }];
    }

    if (normalized.startsWith('DELETE FROM article_tags WHERE article_id = ? AND tag_id = ?')) {
      const [articleId, tagId] = params.map(Number);
      const initialLen = this.article_tags.length;
      this.article_tags = this.article_tags.filter(
        (at) => !(at.article_id === articleId && at.tag_id === tagId)
      );
      return [{ affectedRows: initialLen !== this.article_tags.length ? 1 : 0 }];
    }

    if (normalized.startsWith('UPDATE articles SET')) {
      const [title, body, fact, id] = params;
      const article = this.articles.find((a) => a.id === Number(id));
      if (!article) return [{ affectedRows: 0 }];
      article.title = title;
      article.body = body;
      article.fact = fact;
      return [{ affectedRows: 1 }];
    }

    if (normalized.startsWith('UPDATE comments SET text = ? WHERE id = ?')) {
      const [text, id] = params;
      const comment = this.comments.find((c) => c.id === Number(id));
      if (!comment) return [{ affectedRows: 0 }];
      comment.text = String(text);
      return [{ affectedRows: 1 }];
    }

    if (normalized.startsWith('INSERT INTO users')) {
      let name, email, passwordHash, role = 'user';
      if (params.length === 4) {
        [name, email, passwordHash, role] = params;
      } else {
        [name, email, passwordHash] = params;
      }

      if (this.users.some((u) => u.email.toLowerCase() === String(email).toLowerCase())) {
        const err = new Error('Duplicate entry for email');
        err.code = 'ER_DUP_ENTRY';
        throw err;
      }

      const id = this.nextUserId++;
      this.users.push({
        id,
        name: String(name),
        email: String(email).toLowerCase(),
        password_hash: passwordHash,
        role: role || 'user',
        created_at: new Date()
      });
      return [{ insertId: id, affectedRows: 1 }];
    }

    if (normalized.startsWith('INSERT INTO articles')) {
      const [slug, section, title, subtitle, year, image, body, fact] = params;
      const id = this.nextArticleId++;
      this.articles.push({
        id,
        slug,
        section,
        title,
        subtitle,
        year,
        image,
        body,
        fact
      });
      return [{ insertId: id, affectedRows: 1 }];
    }

    if (normalized.startsWith('INSERT INTO tags')) {
      const name = String(params[0] || '').trim();
      if (this.tags.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
        const err = new Error('Duplicate tag');
        err.code = 'ER_DUP_ENTRY';
        throw err;
      }
      const id = this.nextTagId++;
      this.tags.push({ id, name });
      return [{ insertId: id, affectedRows: 1 }];
    }

    if (normalized.startsWith('INSERT INTO article_tags')) {
      const [articleId, tagId] = params.map(Number);
      if (!this.article_tags.some((at) => at.article_id === articleId && at.tag_id === tagId)) {
        this.article_tags.push({ article_id: articleId, tag_id: tagId });
      }
      return [{ affectedRows: 1 }];
    }

    if (normalized.startsWith('INSERT INTO comments')) {
      const [articleKey, userId, name, text] = params;
      const id = this.nextCommentId++;
      const newComment = {
        id,
        article_key: String(articleKey),
        user_id: Number(userId),
        name: String(name),
        text: String(text),
        created_at: new Date()
      };
      this.comments.push(newComment);
      return [{ insertId: id, affectedRows: 1 }];
    }

    if (normalized.includes('FROM users WHERE email = ?')) {
      const email = String(params[0] || '').toLowerCase();
      const user = this.users.find((u) => u.email.toLowerCase() === email);
      return [user ? [{ ...user }] : []];
    }

    if (normalized.includes('FROM users WHERE id = ?')) {
      const id = Number(params[0]);
      const user = this.users.find((u) => u.id === id);
      return [user ? [{ ...user }] : []];
    }

    if (normalized.includes('FROM articles a') || (normalized.includes('FROM articles') && normalized.includes('GROUP BY'))) {
      const rows = this.articles.map((article) => {
        const tagLinks = this.article_tags.filter((at) => at.article_id === article.id);
        const matchedTags = tagLinks
          .map((tl) => this.tags.find((t) => t.id === tl.tag_id))
          .filter(Boolean)
          .sort((a, b) => a.name.localeCompare(b.name));

        return {
          id: article.id,
          slug: article.slug,
          section: article.section,
          title: article.title,
          subtitle: article.subtitle,
          year: article.year,
          image: article.image,
          fact: article.fact,
          body: article.body,
          tags: matchedTags.length ? matchedTags.map((t) => t.name).join(', ') : null,
          tag_ids: matchedTags.length ? matchedTags.map((t) => t.id).join(',') : null
        };
      });
      return [rows];
    }

    if (normalized.includes('FROM tags ORDER BY name ASC')) {
      const sorted = [...this.tags].sort((a, b) => a.name.localeCompare(b.name));
      return [sorted.map((t) => ({ ...t }))];
    }

    if (normalized.includes('FROM tags WHERE name = ?')) {
      const name = String(params[0] || '').trim();
      const matched = this.tags.filter((t) => t.name === name);
      return [matched.map((t) => ({ ...t }))];
    }

    if (normalized.includes('FROM comments WHERE article_key = ?')) {
      const key = String(params[0] || '').trim();
      const matched = this.comments
        .filter((c) => c.article_key === key)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      return [matched.map((c) => ({ ...c }))];
    }

    if (normalized.includes('FROM comments WHERE id = ?')) {
      const id = Number(params[0]);
      const comment = this.comments.find((c) => c.id === id);
      return [comment ? [{ ...comment }] : []];
    }

    if (normalized.includes('FROM comments c ORDER BY c.created_at DESC')) {
      const sorted = [...this.comments].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      return [sorted.map((c) => ({ ...c }))];
    }

    return [{ affectedRows: 1, insertId: 1 }];
  }
}

const mockDb = new MockDatabase();

vi.mock('../api/config.js', async () => {
  const actual = await vi.importActual('../api/config.js');
  return {
    ...actual,
    pool: {
      execute: (sql, params) => mockDb.execute(sql, params)
    },
    initializeDatabase: vi.fn()
  };
});

const { app } = await import('../server.js');

beforeEach(() => {
  mockDb.reset();
});

describe('Täielik API integratsioonitestide komplekt', () => {
  describe('Autentimine ja seansid (/api/register, /api/login, /api/me, /api/logout)', () => {
    it('registreerib uue kasutaja ja loob aktiivse seansi', async () => {
      const agent = request.agent(app);
      const res = await agent.post('/api/register').send({
        name: 'Tiina Tamm',
        email: 'tiina@filmisfaar.local',
        password: 'parool123'
      });

      expect(res.status).toBe(201);
      expect(res.body.user).toMatchObject({
        id: expect.any(Number),
        name: 'Tiina Tamm',
        email: 'tiina@filmisfaar.local'
      });

      // Seanss peab töötama ja tagastama registreeritud kasutaja
      const meRes = await agent.get('/api/me');
      expect(meRes.status).toBe(200);
      expect(meRes.body.user).toMatchObject({
        name: 'Tiina Tamm',
        email: 'tiina@filmisfaar.local'
      });
    });

    it('lükkab tagasi vigased registreerimisandmed (422)', async () => {
      const badName = await request(app).post('/api/register').send({ name: 'T', email: 't@mail.ee', password: 'parool123' });
      expect(badName.status).toBe(422);
      expect(badName.body.error).toContain('Nimi peab olema');

      const badEmail = await request(app).post('/api/register').send({ name: 'Tiina', email: 'vale-email', password: 'parool123' });
      expect(badEmail.status).toBe(422);
      expect(badEmail.body.error).toContain('kehtiv e-posti aadress');

      const badPassword = await request(app).post('/api/register').send({ name: 'Tiina', email: 'tiina2@mail.ee', password: '123' });
      expect(badPassword.status).toBe(422);
      expect(badPassword.body.error).toContain('vähemalt 6 tähemärki');
    });

    it('tagastab 409 kui kasutaja e-post on juba registreeritud (ER_DUP_ENTRY)', async () => {
      const res = await request(app).post('/api/register').send({
        name: 'Admin kloon',
        email: 'admin@filmisfaar.local',
        password: 'parool123'
      });

      expect(res.status).toBe(409);
      expect(res.body.error).toContain('juba registreeritud');
    });

    it('logib kasutaja edukalt sisse ja määrab rolli', async () => {
      const agent = request.agent(app);
      const res = await agent.post('/api/login').send({
        email: 'admin@filmisfaar.local',
        password: 'admin123'
      });

      expect(res.status).toBe(200);
      expect(res.body.user).toEqual({
        id: 1,
        name: 'Administraator',
        email: 'admin@filmisfaar.local',
        role: 'admin'
      });

      const me = await agent.get('/api/me');
      expect(me.body.user.role).toBe('admin');
    });

    it('lükkab tagasi vale parooli või olematu e-posti (401)', async () => {
      const wrongPass = await request(app).post('/api/login').send({
        email: 'admin@filmisfaar.local',
        password: 'valeParool123'
      });
      expect(wrongPass.status).toBe(401);
      expect(wrongPass.body.error).toContain('Vale e-post või parool');

      const nonExistent = await request(app).post('/api/login').send({
        email: 'puuduv@filmisfaar.local',
        password: 'admin123'
      });
      expect(nonExistent.status).toBe(401);
    });

    it('rakendab brute-force sisselogimiskaitset (429 pärast 5 järjestikust eksimust)', async () => {
      const targetEmail = 'brute-target@filmisfaar.local';
      // 5 ebaõnnestunud katset
      for (let i = 0; i < 5; i++) {
        const res = await request(app).post('/api/login').send({
          email: targetEmail,
          password: `vale${i}`
        });
        expect(res.status).toBe(401);
      }

      // 6. katse peab olema blokeeritud 429 koodiga
      const blockedRes = await request(app).post('/api/login').send({
        email: targetEmail,
        password: 'parool'
      });
      expect(blockedRes.status).toBe(429);
      expect(blockedRes.body.error).toContain('Liiga palju ebaõnnestunud katseid');
    });

    it('/api/me tagastab null anonüümse kasutaja korral', async () => {
      const res = await request(app).get('/api/me');
      expect(res.status).toBe(200);
      expect(res.body.user).toBeNull();
    });

    it('/api/logout hävitab seansi ja järgmine päring on anonüümne', async () => {
      const agent = request.agent(app);
      await agent.post('/api/login').send({ email: 'user@filmisfaar.local', password: 'user123' });
      expect((await agent.get('/api/me')).body.user).not.toBeNull();

      const logoutRes = await agent.post('/api/logout').send({});
      expect(logoutRes.status).toBe(200);
      expect(logoutRes.body.success).toBe(true);

      const meAfter = await agent.get('/api/me');
      expect(meAfter.body.user).toBeNull();
    });

    it('toetab pärand PHP-otspunkte (.php)', async () => {
      const agent = request.agent(app);
      const loginRes = await agent.post('/api/login.php').send({ email: 'user@filmisfaar.local', password: 'user123' });
      expect(loginRes.status).toBe(200);

      const meRes = await agent.get('/api/me.php');
      expect(meRes.body.user.email).toBe('user@filmisfaar.local');

      const logoutRes = await agent.post('/api/logout.php').send({});
      expect(logoutRes.status).toBe(200);
    });
  });

  describe('Kommentaaride API (/api/comments)', () => {
    it('tagastab artikli kommentaarid kuupäeva järgi sorteerituna', async () => {
      const res = await request(app).get('/api/comments/silent');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.comments)).toBe(true);
      expect(res.body.comments.length).toBe(2);
      // Uuem kommentaar esimesena
      expect(new Date(res.body.comments[0].created_at).getTime()).toBeGreaterThanOrEqual(
        new Date(res.body.comments[1].created_at).getTime()
      );
    });

    it('nõuab kommenteerimiseks sisselogimist (401)', async () => {
      const res = await request(app).post('/api/comments/silent').send({ text: 'Tere maailm' });
      expect(res.status).toBe(401);
      expect(res.body.error).toContain('Ainult registreeritud kasutajad');
    });

    it('kontrollib kommentaari teksti pikkust (422)', async () => {
      const agent = request.agent(app);
      await agent.post('/api/login').send({ email: 'user@filmisfaar.local', password: 'user123' });

      const tooShort = await agent.post('/api/comments/silent').send({ text: 'A' });
      expect(tooShort.status).toBe(422);

      const tooLong = await agent.post('/api/comments/silent').send({ text: 'X'.repeat(501) });
      expect(tooLong.status).toBe(422);
    });

    it('lisab autenditud kasutaja kommentaari ja salvestab selle andmebaasi', async () => {
      const agent = request.agent(app);
      await agent.post('/api/login').send({ email: 'user@filmisfaar.local', password: 'user123' });

      const createRes = await agent.post('/api/comments/silent').send({ text: 'Uus testkommentaar' });
      expect(createRes.status).toBe(201);
      expect(createRes.body.comment).toMatchObject({
        id: expect.any(Number),
        article_key: 'silent',
        name: 'Tavakasutaja',
        text: 'Uus testkommentaar'
      });

      // Kontrollime, et kommentaar on nüüd päringus olemas
      const listRes = await request(app).get('/api/comments/silent');
      expect(listRes.body.comments.some((c) => c.text === 'Uus testkommentaar')).toBe(true);
    });

    it('lubab autoril muuta oma kommentaari (PUT /api/comments/entry/:id)', async () => {
      const agent = request.agent(app);
      // user@filmisfaar.local on kommentaari id=2 autor
      await agent.post('/api/login').send({ email: 'user@filmisfaar.local', password: 'user123' });

      const updateRes = await agent.put('/api/comments/entry/2').send({ text: 'Täiustatud kommentaari tekst' });
      expect(updateRes.status).toBe(200);
      expect(updateRes.body.success).toBe(true);

      const listRes = await request(app).get('/api/comments/silent');
      const updated = listRes.body.comments.find((c) => c.id === 2);
      expect(updated.text).toBe('Täiustatud kommentaari tekst');
    });

    it('keelab teise kasutaja kommentaari muutmise (403)', async () => {
      const agent = request.agent(app);
      // user@filmisfaar.local proovib muuta administraatori kommentaari id=1
      await agent.post('/api/login').send({ email: 'user@filmisfaar.local', password: 'user123' });

      const res = await agent.put('/api/comments/entry/1').send({ text: 'Häkkimise katse' });
      expect(res.status).toBe(403);
      expect(res.body.error).toContain('ainult enda kommentaare');
    });

    it('tagastab 404 olematu kommentaari muutmisel ja 400 vigase ID korral', async () => {
      const agent = request.agent(app);
      await agent.post('/api/login').send({ email: 'user@filmisfaar.local', password: 'user123' });

      const notFound = await agent.put('/api/comments/entry/9999').send({ text: 'Tekst' });
      expect(notFound.status).toBe(404);

      const badId = await agent.put('/api/comments/entry/vigane').send({ text: 'Tekst' });
      expect(badId.status).toBe(400);
    });

    it('lubab autoril oma kommentaari kustutada (DELETE /api/comments/entry/:id)', async () => {
      const agent = request.agent(app);
      await agent.post('/api/login').send({ email: 'user@filmisfaar.local', password: 'user123' });

      const deleteRes = await agent.delete('/api/comments/entry/2');
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.success).toBe(true);

      const listRes = await request(app).get('/api/comments/silent');
      expect(listRes.body.comments.some((c) => c.id === 2)).toBe(false);
    });

    it('keelab võõra kommentaari kustutamise (403)', async () => {
      const agent = request.agent(app);
      await agent.post('/api/login').send({ email: 'user@filmisfaar.local', password: 'user123' });

      const deleteRes = await agent.delete('/api/comments/entry/1');
      expect(deleteRes.status).toBe(403);
    });

    it('käsitleb kommentaari kustutamisel autoriseerimata päringut (401), vigast ID-d (400) ja olematut ID-d (404)', async () => {
      const unauth = await request(app).delete('/api/comments/entry/2');
      expect(unauth.status).toBe(401);

      const agent = request.agent(app);
      await agent.post('/api/login').send({ email: 'user@filmisfaar.local', password: 'user123' });

      const badId = await agent.delete('/api/comments/entry/vigane');
      expect(badId.status).toBe(400);

      const notFound = await agent.delete('/api/comments/entry/9999');
      expect(notFound.status).toBe(404);
    });
  });

  describe('Artiklite otsing ja avalik API (/api/articles)', () => {
    it('tagastab kõik artiklid koos lahti pakitud JSON sisu ja siltidega', async () => {
      const res = await request(app).get('/api/articles');
      expect(res.status).toBe(200);
      expect(res.body.articles.length).toBe(2);

      const first = res.body.articles[0];
      expect(Array.isArray(first.body)).toBe(true);
      expect(first.tags).toContain('tummfilm');
      expect(first.tagIds).toEqual([2, 1]);
    });

    it('filtreerib artikleid sildi järgi (?tag=...)', async () => {
      const res = await request(app).get('/api/articles?tag=uus laine');
      expect(res.status).toBe(200);
      expect(res.body.articles.length).toBe(1);
      expect(res.body.articles[0].slug).toBe('nouvelle');

      const empty = await request(app).get('/api/articles?tag=olematu-silt');
      expect(empty.body.articles.length).toBe(0);
    });

    it('otsib artikleid märksõna järgi pealkirjast, lühikirjeldusest või sisust (?q=...)', async () => {
      // Pealkirja järgi
      const byTitle = await request(app).get('/api/articles?q=hingama');
      expect(byTitle.body.articles.length).toBe(1);
      expect(byTitle.body.articles[0].slug).toBe('silent');

      // Sisu (body) järgi
      const byBody = await request(app).get('/api/articles?q=Pariisis');
      expect(byBody.body.articles.length).toBe(1);
      expect(byBody.body.articles[0].slug).toBe('nouvelle');

      // Mitteleiduv
      const noMatch = await request(app).get('/api/articles?q=kosmoselaev');
      expect(noMatch.body.articles.length).toBe(0);
    });

    it('kombineerib sildi ja otsingusõna parameetreid', async () => {
      const match = await request(app).get('/api/articles?tag=tummfilm&q=kaader');
      expect(match.body.articles.length).toBe(1);

      const conflict = await request(app).get('/api/articles?tag=tummfilm&q=Pariisis');
      expect(conflict.body.articles.length).toBe(0);
    });
  });

  describe('Administraatori paneel ja haldusfunktsioonid (/api/admin/*)', () => {
    it('keelab admin-päringud ilma sisselogimiseta (401)', async () => {
      expect((await request(app).get('/api/admin/articles')).status).toBe(401);
      expect((await request(app).get('/api/admin/tags')).status).toBe(401);
      expect((await request(app).get('/api/admin/comments')).status).toBe(401);
      expect((await request(app).post('/api/admin/articles')).status).toBe(401);
    });

    it('keelab admin-päringud tavakasutajale (403 Forbidden — Broken Access Control kaitse)', async () => {
      const userAgent = request.agent(app);
      await userAgent.post('/api/login').send({ email: 'user@filmisfaar.local', password: 'user123' });

      const articlesRes = await userAgent.get('/api/admin/articles');
      expect(articlesRes.status).toBe(403);
      expect(articlesRes.body.error).toContain('administraatori õigused puuduvad');

      const tagsRes = await userAgent.get('/api/admin/tags');
      expect(tagsRes.status).toBe(403);

      const commentsRes = await userAgent.get('/api/admin/comments');
      expect(commentsRes.status).toBe(403);

      const postArticleRes = await userAgent.post('/api/admin/articles').send({ title: 'Häkk' });
      expect(postArticleRes.status).toBe(403);

      const putArticleRes = await userAgent.put('/api/admin/articles/1').send({ title: 'Häkk' });
      expect(putArticleRes.status).toBe(403);

      const deleteCommentRes = await userAgent.delete('/api/admin/comments/1');
      expect(deleteCommentRes.status).toBe(403);

      const postTagRes = await userAgent.post('/api/admin/tags').send({ name: 'Häkk' });
      expect(postTagRes.status).toBe(403);

      const deleteTagRes = await userAgent.delete('/api/admin/tags/1');
      expect(deleteTagRes.status).toBe(403);

      const attachTagRes = await userAgent.post('/api/admin/articles/1/tags').send({ tag: 'Häkk' });
      expect(attachTagRes.status).toBe(403);

      const detachTagRes = await userAgent.delete('/api/admin/articles/1/tags/1');
      expect(detachTagRes.status).toBe(403);
    });

    it('võimaldab lisada uue artikli koos siltidega', async () => {
      const agent = request.agent(app);
      await agent.post('/api/login').send({ email: 'admin@filmisfaar.local', password: 'admin123' });

      const newArticle = {
        slug: 'modern',
        section: '03 / Tänapäev',
        title: 'Digitaalne revolutsioon',
        subtitle: 'Pikslist sündinud kinokunst',
        year: '2000—praeguseni',
        image: 'https://images.unsplash.com/digital.jpg',
        fact: 'Esimene täisdigitaalne mängufilm.',
        body: ['Digitaalne kaamera asendas filmilindi.'],
        tags: 'digi, efektid'
      };

      const res = await agent.post('/api/admin/articles').send(newArticle);
      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();

      // Kontrollime artikli ilmumist avalikku nimekirja
      const articlesRes = await request(app).get('/api/articles');
      const added = articlesRes.body.articles.find((a) => a.slug === 'modern');
      expect(added).toBeDefined();
      expect(added.title).toBe('Digitaalne revolutsioon');
      expect(added.tags).toContain('digi');
    });

    it('kontrollib artikli loomisel kohustuslikke välju (422)', async () => {
      const agent = request.agent(app);
      await agent.post('/api/login').send({ email: 'admin@filmisfaar.local', password: 'admin123' });

      const res = await agent.post('/api/admin/articles').send({ slug: 'incomplete' });
      expect(res.status).toBe(422);
      expect(res.body.error).toContain('kõik artikli väljad');
    });

    it('võimaldab muuta olemasolevat artiklit (PUT /api/admin/articles/:id)', async () => {
      const agent = request.agent(app);
      await agent.post('/api/login').send({ email: 'admin@filmisfaar.local', password: 'admin123' });

      const res = await agent.put('/api/admin/articles/1').send({
        title: 'Uuendatud tummfilmi pealkiri',
        body: ['Täiesti uus sisu lõik.'],
        fact: 'Uuendatud arhiivimärkus.'
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const checkRes = await request(app).get('/api/articles');
      const article = checkRes.body.articles.find((a) => a.id === 1);
      expect(article.title).toBe('Uuendatud tummfilmi pealkiri');
      expect(article.fact).toBe('Uuendatud arhiivimärkus.');
    });

    it('tagastab 404 kui administraator proovib muuta olematut artiklit', async () => {
      const agent = request.agent(app);
      await agent.post('/api/login').send({ email: 'admin@filmisfaar.local', password: 'admin123' });

      const res = await agent.put('/api/admin/articles/9999').send({
        title: 'Pealkiri',
        body: ['Sisu'],
        fact: 'Fakt'
      });

      expect(res.status).toBe(404);
    });

    it('haldab silte: lisamine, duplikaadi keeld, kustutamine, sidumine', async () => {
      const agent = request.agent(app);
      await agent.post('/api/login').send({ email: 'admin@filmisfaar.local', password: 'admin123' });

      // 1. Siltide nimekiri
      const tagsList = await agent.get('/api/admin/tags');
      expect(tagsList.status).toBe(200);
      expect(tagsList.body.tags.length).toBe(3);

      // 2. Uue sildi loomine
      const createTag = await agent.post('/api/admin/tags').send({ name: 'ulmefilm' });
      expect(createTag.status).toBe(201);
      expect(createTag.body.name).toBe('ulmefilm');

      // 3. Duplikaadi katse -> 409
      const dupTag = await agent.post('/api/admin/tags').send({ name: 'ulmefilm' });
      expect(dupTag.status).toBe(409);

      // 4. Tühi nimi -> 422
      const emptyTag = await agent.post('/api/admin/tags').send({ name: '' });
      expect(emptyTag.status).toBe(422);

      // 5. Sildi sidumine artikliga
      const attachBad = await agent.post('/api/admin/articles/1/tags').send({ tag: '' });
      expect(attachBad.status).toBe(422);

      const attachRes = await agent.post('/api/admin/articles/1/tags').send({ tag: 'ulmefilm' });
      expect(attachRes.status).toBe(201);

      // 6. Sildi eemaldamine artiklilt
      const detachBad = await agent.delete('/api/admin/articles/vigane/tags/vigane');
      expect(detachBad.status).toBe(400);

      const detachRes = await agent.delete(`/api/admin/articles/1/tags/${createTag.body.id}`);
      expect(detachRes.status).toBe(200);

      // 7. Sildi täielik kustutamine
      const deleteBadId = await agent.delete('/api/admin/tags/vigane');
      expect(deleteBadId.status).toBe(400);

      const deleteTagRes = await agent.delete(`/api/admin/tags/${createTag.body.id}`);
      expect(deleteTagRes.status).toBe(200);
    });

    it('kuvab administraatorile kommentaaride koondloendi ja lubab kommentaari kustutada', async () => {
      const agent = request.agent(app);
      await agent.post('/api/login').send({ email: 'admin@filmisfaar.local', password: 'admin123' });

      const commentsRes = await agent.get('/api/admin/comments');
      expect(commentsRes.status).toBe(200);
      expect(commentsRes.body.comments.length).toBe(2);

      // Kustutame kommentaari id=1
      const deleteRes = await agent.delete('/api/admin/comments/1');
      expect(deleteRes.status).toBe(200);

      const afterDelete = await agent.get('/api/admin/comments');
      expect(afterDelete.body.comments.some((c) => c.id === 1)).toBe(false);
    });
  });

  describe('Staatiliste failide ja SPA marsruutimise teenindus (server.js)', () => {
    it('tagastab avalehe HTML-i juurmarsruudil GET /', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/html');
      expect(res.text).toContain('Filmisfäär');
    });

    it('suunab SPA alamlehed (nt /article/silent) samuti index.html failile', async () => {
      const res = await request(app).get('/article/silent');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/html');
    });

    it('käivitab serveri edukalt funktsiooniga startServer', async () => {
      const { startServer } = await import('../server.js');
      const listenSpy = vi.spyOn(app, 'listen').mockImplementation((port, cb) => {
        if (cb) cb();
        return { close: (fn) => fn && fn() };
      });
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await startServer();

      expect(listenSpy).toHaveBeenCalled();
      listenSpy.mockRestore();
      logSpy.mockRestore();
    });

    it('käsitleb andmebaasi initsialiseerimise viga funktsioonis startServer', async () => {
      const { startServer } = await import('../server.js');
      const { initializeDatabase } = await import('../api/config.js');
      initializeDatabase.mockRejectedValueOnce(new Error('Andmebaasi ühenduse viga'));

      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {});
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await startServer();

      expect(errorSpy).toHaveBeenCalled();
      expect(exitSpy).toHaveBeenCalledWith(1);

      exitSpy.mockRestore();
      errorSpy.mockRestore();
    });
  });
});
