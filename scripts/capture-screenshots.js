import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import { chromium } from 'playwright-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotsDir = path.join(__dirname, '..', 'docs', 'screenshots');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

class ScreenDb {
  constructor() {
    this.adminHash = bcrypt.hashSync('admin123', 4);
    this.userHash = bcrypt.hashSync('user123', 4);
    this.users = [
      { id: 1, name: 'Administraator', email: 'admin@filmisfaar.local', password_hash: this.adminHash, role: 'admin', created_at: new Date('2026-01-01') },
      { id: 2, name: 'Laura Kallas', email: 'laura@filmisfaar.local', password_hash: this.userHash, role: 'user', created_at: new Date('2026-01-15') }
    ];
    this.articles = [
      {
        id: 1,
        slug: 'silent',
        section: '01 / Algused',
        title: 'Kui kaader õppis hingama',
        subtitle: 'Tummfilm ei olnud hääletu. Ta rääkis montaaži, žesti ja valgusega — ja lõi grammatika, mida kasutame tänaseni.',
        year: '1895—1927',
        image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1800&q=85',
        fact: 'Lumière’i vendade esimene avalik filmiseanss toimus Pariisis 28. detsembril 1895.',
        body: JSON.stringify([
          'Lumière’i vendade esimesed seansid olid lühikesed visandid, kuid vaataja nägi neis kohe midagi enamat kui tehnilist atraktsiooni — uut viisi maailma vaadata.',
          'Peagi läks film kaugemale pelgast jäädvustamisest. Georges Méliès muutis kaamera illusioonide lavaks, D. W. Griffith ja Sergei Eisenstein aga hakkasid emotsiooni kokku panema kaadrite kõrvutamisest.'
        ])
      },
      {
        id: 2,
        slug: 'nouvelle',
        section: '02 / Vaate vabadus',
        title: 'Kaamera läheb tänavale',
        subtitle: 'Prantsuse uus laine loobus stuudiofilmi siledusest ja tõi filmi tagasi elava vestluse närvi.',
        year: '1958—1968',
        image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1800&q=85',
        fact: 'Godard’i „Hingeldades“ tegi kuulsaks jump cut’i.',
        body: JSON.stringify([
          '1950. aastate lõpus said ajakirja Cahiers du Cinéma noortest kriitikutest režissöörid.',
          'Nende filmid lubasid endale eksimusi, vaatasid otse objektiivi ega peitnud montaažiõmblusi.'
        ])
      },
      {
        id: 3,
        slug: 'blockbuster',
        section: '03 / Suur ekraan',
        title: 'Kuidas suvest sai esilinastus',
        subtitle: 'Põnevik-hitt muutis kinoskäigu kollektiivseks rituaaliks, turundusest aga sai osa vaatemängust endast.',
        year: '1975—1999',
        image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1800&q=85',
        fact: 'Aasta 1975 „Lõuad“ olid esimene film, mis kogus USA kinolevis üle 100 miljoni dollari.',
        body: JSON.stringify([
          'Steven Spielbergi „Lõuad“ said esimeseks tõeliseks suveblokbasteriks: film vallutas korraga ekraanid, vestlused ja reklaamikanalid.',
          'Neil kümnenditel õppisid stuudiod mõtlema sündmustena.'
        ])
      }
    ];
    this.tags = [
      { id: 1, name: 'tummfilm' },
      { id: 2, name: 'montaaž' },
      { id: 3, name: 'uus laine' },
      { id: 4, name: 'kassahitid' }
    ];
    this.article_tags = [
      { article_id: 1, tag_id: 1 },
      { article_id: 1, tag_id: 2 },
      { article_id: 2, tag_id: 3 },
      { article_id: 3, tag_id: 4 }
    ];
    this.comments = [
      { id: 1, article_key: 'silent', user_id: 1, name: 'Administraator', text: 'Tere tulemast Filmisfääri arhiivi! Ootame teie mõtteid.', created_at: new Date('2026-01-10T12:00:00Z') },
      { id: 2, article_key: 'silent', user_id: 2, name: 'Laura Kallas', text: 'Tõeliselt põnev ülevaade varajase filmikunsti montaažikeele kujunemisest.', created_at: new Date('2026-02-01T14:30:00Z') }
    ];
    this.nextCommentId = 3;
    this.nextTagId = 5;
    this.nextArticleId = 4;
  }

  async execute(sql, params = []) {
    const norm = sql.replace(/\s+/g, ' ').trim();

    if (norm.startsWith('DELETE FROM comments WHERE id = ?')) {
      const id = Number(params[0]);
      this.comments = this.comments.filter((c) => c.id !== id);
      return [{ affectedRows: 1 }];
    }
    if (norm.startsWith('DELETE FROM tags WHERE id = ?')) {
      const id = Number(params[0]);
      this.tags = this.tags.filter((t) => t.id !== id);
      this.article_tags = this.article_tags.filter((at) => at.tag_id !== id);
      return [{ affectedRows: 1 }];
    }
    if (norm.startsWith('DELETE FROM article_tags')) {
      return [{ affectedRows: 1 }];
    }
    if (norm.startsWith('UPDATE articles SET')) {
      return [{ affectedRows: 1 }];
    }
    if (norm.startsWith('UPDATE comments SET text = ? WHERE id = ?')) {
      const [text, id] = params;
      const c = this.comments.find((item) => item.id === Number(id));
      if (c) c.text = String(text);
      return [{ affectedRows: 1 }];
    }
    if (norm.startsWith('INSERT INTO users')) {
      const [name, email, passwordHash, role = 'user'] = params;
      const id = this.users.length + 1;
      this.users.push({ id, name, email: email.toLowerCase(), password_hash: passwordHash, role, created_at: new Date() });
      return [{ insertId: id, affectedRows: 1 }];
    }
    if (norm.startsWith('INSERT INTO comments')) {
      const [articleKey, userId, name, text] = params;
      const id = this.nextCommentId++;
      this.comments.push({ id, article_key: articleKey, user_id: Number(userId), name, text, created_at: new Date() });
      return [{ insertId: id, affectedRows: 1 }];
    }
    if (norm.startsWith('INSERT INTO tags')) {
      const name = String(params[0]).trim();
      const id = this.nextTagId++;
      this.tags.push({ id, name });
      return [{ insertId: id, affectedRows: 1 }];
    }
    if (norm.startsWith('INSERT INTO article_tags')) {
      return [{ affectedRows: 1 }];
    }
    if (norm.includes('FROM users WHERE email = ?')) {
      const email = String(params[0] || '').toLowerCase();
      const u = this.users.find((user) => user.email === email);
      return [u ? [{ ...u }] : []];
    }
    if (norm.includes('FROM users WHERE id = ?')) {
      const id = Number(params[0]);
      const u = this.users.find((user) => user.id === id);
      return [u ? [{ ...u }] : []];
    }
    if (norm.includes('FROM articles a') || (norm.includes('FROM articles') && norm.includes('GROUP BY'))) {
      const rows = this.articles.map((art) => {
        const tLinks = this.article_tags.filter((at) => at.article_id === art.id);
        const matched = tLinks.map((tl) => this.tags.find((t) => t.id === tl.tag_id)).filter(Boolean);
        return {
          id: art.id,
          slug: art.slug,
          section: art.section,
          title: art.title,
          subtitle: art.subtitle,
          year: art.year,
          image: art.image,
          fact: art.fact,
          body: art.body,
          tags: matched.map((t) => t.name).join(', '),
          tag_ids: matched.map((t) => t.id).join(',')
        };
      });
      return [rows];
    }
    if (norm.includes('FROM tags ORDER BY name ASC')) {
      return [[...this.tags].sort((a, b) => a.name.localeCompare(b.name)).map((t) => ({ ...t }))];
    }
    if (norm.includes('FROM tags WHERE name = ?')) {
      const name = String(params[0] || '').trim();
      return [this.tags.filter((t) => t.name === name).map((t) => ({ ...t }))];
    }
    if (norm.includes('FROM comments WHERE article_key = ?')) {
      const key = String(params[0] || '').trim();
      return [this.comments.filter((c) => c.article_key === key).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((c) => ({ ...c }))];
    }
    if (norm.includes('FROM comments WHERE id = ?')) {
      const id = Number(params[0]);
      const c = this.comments.find((item) => item.id === id);
      return [c ? [{ ...c }] : []];
    }
    if (norm.includes('FROM comments c ORDER BY c.created_at DESC')) {
      return [[...this.comments].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((c) => ({ ...c }))];
    }

    return [{ affectedRows: 1, insertId: 1 }];
  }
}

// Intercept database config pool before importing server
const screenDb = new ScreenDb();
const configMod = await import('../api/config.js');
configMod.pool.execute = (sql, params) => screenDb.execute(sql, params);

const { app } = await import('../server.js');

async function main() {
  console.log('Käivitame ajutise serveri ekraanitõmmiste tegemiseks...');
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`Server töötab pordil ${port}`);

  console.log('Käivitame brauseri...');
  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
  } catch {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  }

  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
    deviceScaleFactor: 1.5
  });
  const page = await context.newPage();

  // 1. Avaleht (Ajajoon ja päis)
  console.log('1. Ekraanitõmmis: Avaleht');
  await page.goto(baseUrl);
  await page.waitForSelector('.hero h1');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotsDir, '01_avaleht_ajajoon.png') });

  // 2. Artikli leht
  console.log('2. Ekraanitõmmis: Artikli vaade');
  await page.locator('.timeline-card').first().click();
  await page.waitForSelector('.article-page h1');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotsDir, '02_artikli_vaade.png') });

  // 3. Autentimise aken (Sisselogimine / Registreerumine)
  console.log('3. Ekraanitõmmis: Autentimise aken');
  await page.locator('[data-auth="login"]').click();
  await page.waitForSelector('[data-auth-modal]:not([hidden])');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(screenshotsDir, '03_sisselogimise_aken.png') });

  // 4. Sisselogimine ja kommentaaride sektsioon
  console.log('4. Ekraanitõmmis: Kommenteerimine ja oma kommentaari haldus');
  await page.fill('input[name="email"]', 'laura@filmisfaar.local');
  await page.fill('input[name="password"]', 'user123');
  await page.locator('[data-auth-submit]').click();
  await page.waitForSelector('.user-name');
  await page.locator('.comments-root').scrollIntoViewIfNeeded();
  await page.waitForSelector('[data-comment-form]');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(screenshotsDir, '04_kommenteerimine_ja_crud.png') });

  // 5. Siltide ja otsingu leht
  console.log('5. Ekraanitõmmis: Siltide ja otsingu leht');
  await page.locator('nav.main-nav a[data-route="tags"]').click();
  await page.waitForSelector('[data-tag-search]');
  await page.fill('[data-tag-search]', 'uus laine');
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(screenshotsDir, '05_sildid_ja_otsing.png') });

  // 6. Administraatori halduspaneel
  console.log('6. Ekraanitõmmis: Administraatori halduspaneel');
  await page.locator('[data-auth-logout]').click();
  await page.waitForSelector('[data-auth="login"]');
  await page.locator('[data-auth="login"]').click();
  await page.waitForSelector('[data-auth-modal]:not([hidden])');
  await page.fill('input[name="email"]', 'admin@filmisfaar.local');
  await page.fill('input[name="password"]', 'admin123');
  await page.locator('[data-auth-submit]').click();
  await page.waitForSelector('[data-admin-panel]');
  await page.locator('[data-admin-panel]').click();
  await page.waitForSelector('.admin-header h1');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(screenshotsDir, '06_administraatori_halduspaneel.png') });

  console.log('Kõik ekraanitõmmised on edukalt salvestatud kausta docs/screenshots/!');
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
  process.exit(0);
}

main().catch((err) => {
  console.error('Viga tõmmiste tegemisel:', err);
  process.exit(1);
});
