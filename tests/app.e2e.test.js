import http from 'node:http';
import bcrypt from 'bcryptjs';
import { chromium } from 'playwright-core';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

class E2EDatabase {
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
        image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1800&q=85',
        fact: 'Lumière’i vendade esimene avalik filmiseanss toimus Pariisis 28. detsembril 1895.',
        body: JSON.stringify([
          'Lumière’i vendade esimesed seansid olid lühikesed visandid, kuid vaataja nägi neis kohe midagi enamat kui tehnilist atraktsiooni — uut viisi maailma vaadata.',
          'Peagi läks film kaugemale pelgast jäädvustamisest. Georges Méliès muutis kaamera illusioonide lavaks.'
        ])
      },
      {
        id: 2,
        slug: 'nouvelle',
        section: '02 / Vaate vabadus',
        title: 'Kaamera läheb tänavale',
        subtitle: 'Prantsuse uus laine loobus stuudiofilmi siledusest.',
        year: '1958—1968',
        image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1800&q=85',
        fact: 'Godard’i „Hingeldades“ tegi kuulsaks jump cut’i.',
        body: JSON.stringify([
          '1950. aastate lõpus said ajakirja Cahiers du Cinéma noortest kriitikutest režissöörid.',
          'Nende filmid lubasid endale eksimusi ega peitnud montaažiõmblusi.'
        ])
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
        text: 'Tere tulemast Filmisfääri arhiivi!',
        created_at: new Date('2026-01-10T12:00:00Z')
      }
    ];

    this.nextUserId = 2;
    this.nextArticleId = 3;
    this.nextTagId = 4;
    this.nextCommentId = 2;
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

const e2eDb = new E2EDatabase();

vi.mock('../api/config.js', async () => {
  const actual = await vi.importActual('../api/config.js');
  return {
    ...actual,
    pool: {
      execute: (sql, params) => e2eDb.execute(sql, params)
    },
    initializeDatabase: vi.fn()
  };
});

const { app } = await import('../server.js');

describe('Visuaalne End-to-End (E2E) brauseritest — kasutajaliidese läbimine', () => {
  let server;
  let baseUrl;
  let browser;
  let page;

  beforeAll(async () => {
    // 1. Käivitame Express serveri dünaamilisel vabal pordil
    server = http.createServer(app);
    await new Promise((resolve) => {
      server.listen(0, '127.0.0.1', () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });

    // 2. Käivitame päris Google Chrome või Edge brauseri nähtavas režiimis (headless: false)
    const isHeadless = process.env.HEADLESS === 'true';
    const slowMoSpeed = isHeadless ? 0 : 350; // Inimsilmale jälgitav kiirus

    try {
      browser = await chromium.launch({
        channel: 'chrome',
        headless: isHeadless,
        slowMo: slowMoSpeed
      });
    } catch {
      browser = await chromium.launch({
        channel: 'msedge',
        headless: isHeadless,
        slowMo: slowMoSpeed
      });
    }

    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 }
    });
    page = await context.newPage();

    // Aktsepteerime automaatselt dialoogid (nt window.confirm kommentaari kustutamisel)
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });
  }, 30000);

  afterAll(async () => {
    if (browser) await browser.close();
    if (server) await new Promise((resolve) => server.close(resolve));
  });

  it('Visuaalne lugeja ja administraatori teekond läbi veebiliidese', async () => {
    // SAMM 1: Avalehe avamine brauseris
    await page.goto(baseUrl);
    expect(await page.title()).toMatch(/Filmisfäär/);
    await page.waitForSelector('.hero h1');

    // SAMM 2: Klõps esimesel artiklikaardil ajajoonel
    const firstCard = page.locator('.timeline-card').first();
    await firstCard.click();
    await page.waitForURL(`${baseUrl}/#/article/silent`);
    await page.waitForSelector('.article-page h1');

    // SAMM 3: Kerimine allapoole kommentaaride juurde
    await page.locator('.comments-root').scrollIntoViewIfNeeded();
    await page.waitForSelector('.comment-login-prompt');
    expect(await page.locator('.comment-login-prompt').isVisible()).toBe(true);

    // SAMM 4: Registreerimisakna avamine päises
    await page.locator('[data-auth="register"]').click();
    await page.waitForSelector('[data-auth-modal]:not([hidden])');
    expect(await page.locator('[data-auth-modal]').isVisible()).toBe(true);

    // SAMM 5: Vormi täitmine ja uue konto loomine
    await page.fill('[data-name-field] input', 'Marko Tamm');
    await page.fill('input[name="email"]', 'marko.tamm@filmisfaar.local');
    await page.fill('input[name="password"]', 'salasona123');
    await page.locator('[data-auth-submit]').click();

    // Veendume, et päisesse ilmus kasutajanimi
    await page.waitForSelector('.user-name');
    expect(await page.locator('.user-name').textContent()).toBe('Marko Tamm');

    // SAMM 6: Kommentaari kirjutamine ja postitamine (sh XSS ründekoodi testimine)
    await page.locator('[data-comment-form] textarea').fill('Tõeliselt huvitav ja visuaalselt nauditav filmiloo ülevaade! <img src="valeaadress" onerror="window.__xss_executed=true">');
    await page.locator('[data-comment-form] button[type="submit"]').click();

    // Ootame uue kommentaari ilmumist nimekirja
    const myComment = page.locator('.comment-item', { hasText: 'Marko Tamm' }).first();
    await myComment.waitFor();
    expect(await myComment.isVisible()).toBe(true);
    expect(await myComment.locator('[data-comment-text]').textContent()).toContain('Tõeliselt huvitav');

    // Veendume, et Stored XSS rünnak neutraliseeriti turvaliselt (skript ei käivitu brauseris)
    const isXssExecuted = await page.evaluate(() => window.__xss_executed);
    expect(isXssExecuted).toBeUndefined();

    // SAMM 7: Oma kommentaari muutmine (inline edit)
    await myComment.locator('[data-comment-edit]').click();
    const editArea = myComment.locator('[data-comment-edit-form] textarea');
    await editArea.fill('Tõeliselt huvitav ja visuaalselt nauditav filmiloo ülevaade! Georges Méliès oli tõeline meister.');
    await myComment.locator('[data-comment-edit-form] button[type="submit"]').click();

    // Kontrollime uuendatud teksti
    await page.waitForSelector('.comment-item', { hasText: 'Georges Méliès oli tõeline meister' });
    expect(await myComment.locator('[data-comment-text]').textContent()).toContain('Georges Méliès oli tõeline meister');

    // SAMM 8: Oma kommentaari kustutamine
    await myComment.locator('[data-comment-delete]').click();
    await page.waitForTimeout(500);
    expect(await page.locator('.comment-item', { hasText: 'Georges Méliès oli tõeline meister' }).count()).toBe(0);

    // SAMM 9: Liikumine siltide ja otsingu lehele
    await page.locator('nav.main-nav a[data-route="tags"]').click();
    await page.waitForURL(`${baseUrl}/#/tags`);

    // Otsingusõna sisestamine otsingukasti
    const searchInput = page.locator('[data-tag-search]');
    await searchInput.fill('uus laine');
    await page.waitForTimeout(800); // Ootame otsingu debounce'i
    expect(await page.locator('[data-tag-results] .tag-result').count()).toBe(1);
    expect(await page.locator('[data-tag-results]').textContent()).toContain('Kaamera läheb tänavale');

    // SAMM 10: Väljalogimine
    await page.locator('[data-auth-logout]').click();
    await page.waitForSelector('[data-auth="login"]');
    expect(await page.locator('[data-auth="login"]').isVisible()).toBe(true);

    // SAMM 11: Administraatorina sisselogimine
    await page.locator('[data-auth="login"]').click();
    await page.waitForSelector('[data-auth-modal]:not([hidden])');
    await page.fill('input[name="email"]', 'admin@filmisfaar.local');
    await page.fill('input[name="password"]', 'admin123');
    await page.locator('[data-auth-submit]').click();

    // Administraatori nupp päises ja halduspaneeli avamine
    await page.waitForSelector('[data-admin-panel]');
    expect(await page.locator('[data-admin-panel]').isVisible()).toBe(true);
    await page.locator('[data-admin-panel]').click();
    await page.waitForURL(`${baseUrl}/#/admin`);

    // Veendume, et administraatori halduspaneel on avatud
    await page.waitForSelector('.admin-header h1');
    expect(await page.locator('.admin-header h1').textContent()).toBe('Halduspaneel');
    expect(await page.locator('.admin-card h2', { hasText: 'Lisa artikkel' }).isVisible()).toBe(true);
    expect(await page.getByRole('heading', { name: 'Sildid', exact: true }).isVisible()).toBe(true);

    // SAMM 12: Kaader Päevas vaate testimine
    await page.locator('[data-route="daily"]').click();
    await page.waitForURL(`${baseUrl}/#/daily`);
    await page.waitForSelector('.daily-frame-wrapper');
    expect(await page.locator('.daily-frame-wrapper').isVisible()).toBe(true);
    expect(await page.locator('input[name="guess"]').isVisible()).toBe(true);

    // SAMM 13: Kinoarhetüübi testi vaate testimine
    await page.locator('[data-route="quiz"]').click();
    await page.waitForURL(`${baseUrl}/#/quiz`);
    await page.waitForSelector('.quiz-question-box');
    expect(await page.locator('.quiz-question-text').isVisible()).toBe(true);

    // Lühike paus, et kasutaja jõuaks näha viimast vaadet
    await page.waitForTimeout(1000);
  }, 45000);
});
