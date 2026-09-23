import './style.css';

export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const articles = {
  silent: {
    section: '01 / Algused',
    title: 'Kui kaader õppis hingama',
    subtitle: 'Tummfilm ei olnud hääletu. Ta rääkis montaaži, žesti ja valgusega — ja lõi grammatika, mida kasutame tänaseni.',
    year: '1895—1927',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1800&q=85',
    tags: ['tummfilm', 'montaaž', 'esimesed kaadrid'],
    body: [
      'Lumière’i vendade esimesed seansid olid lühikesed visandid, kuid vaataja nägi neis kohe midagi enamat kui tehnilist atraktsiooni — uut viisi maailma vaadata. Rongi saabumine jaama oli sündmus just seepärast, et see liikus kaadri sees.',
      'Peagi läks film kaugemale pelgast jäädvustamisest. Georges Méliès muutis kaamera illusioonide lavaks, D. W. Griffith ja Sergei Eisenstein aga hakkasid emotsiooni kokku panema kaadrite kõrvutamisest. Montaažist sai mitte lihtsalt liitmine, vaid mõte.'
    ],
    fact: 'Lumière’i vendade esimene avalik filmiseanss toimus Pariisis 28. detsembril 1895.'
  },
  nouvelle: {
    section: '02 / Vaate vabadus',
    title: 'Kaamera läheb tänavale',
    subtitle: 'Prantsuse uus laine loobus stuudiofilmi siledusest ja tõi filmi tagasi elava vestluse närvi.',
    year: '1958—1968',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1800&q=85',
    tags: ['uus laine', 'Pariis', 'vormi vabadus'],
    body: [
      '1950. aastate lõpus said ajakirja Cahiers du Cinéma noortest kriitikutest režissöörid. Jean-Luc Godard, François Truffaut, Agnès Varda ja nende kolleegid filmisid seal, kus oli elu: korterites, kohvikutes, Pariisi tänavatel.',
      'Nende filmid lubasid endale eksimusi, vaatasid otse objektiivi ega peitnud montaažiõmblusi. Uus laine tuletas meelde: film võib olla mitte ainult illusioon, vaid ka isiklik sõnavõtt — kerge, julge, ebatäiuslik.'
    ],
    fact: 'Godard’i „Hingeldades“ tegi kuulsaks järsud katked, mida hakati nimetama jump cut’iks.'
  },
  blockbuster: {
    section: '03 / Suur ekraan',
    title: 'Kuidas suvest sai esilinastus',
    subtitle: 'Põnevik-hitt muutis kinoskäigu kollektiivseks rituaaliks, turundusest aga sai osa vaatemängust endast.',
    year: '1975—1999',
    image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1800&q=85',
    tags: ['põnevik-hitid', 'kinolevi', 'meediafrantsiisid'],
    body: [
      'Steven Spielbergi „Lõuad“ said esimeseks tõeliseks suveblokbasteriks: film vallutas korraga ekraanid, vestlused ja reklaamikanalid. Kaks aastat hiljem tõestas „Tähesõjad“, et universum võib jätkuda ka lõputiitrite järel.',
      'Neil kümnenditel õppisid stuudiod mõtlema sündmustena. Poster, treiler, mänguasi, saundtrack ja film ise moodustasid ühtse kultuurikogemuse. Suurest ekraanist sai koht, kuhu tuldi mitte ainult loo, vaid ka mastaabi pärast.'
    ],
    fact: 'Aasta 1975 „Lõuad“ olid esimene film, mis kogus USA kinolevis üle 100 miljoni dollari.'
  }
};

const nav = `
  <header class="site-header">
    <a class="brand" href="#/">FILMI<span>SFÄÄR</span></a>
    <nav class="main-nav" aria-label="Peamine navigatsioon">
      <a href="#/" data-route="home">Ajajoon</a>
      <a href="#/article/silent" data-route="silent">Tummfilm</a>
      <a href="#/article/nouvelle" data-route="nouvelle">Uus laine</a>
      <a href="#/article/blockbuster" data-route="blockbuster">Kassahitid</a>
      <a href="#/tags" data-route="tags">Sildid</a>
    </nav>
    <div class="auth-area" data-auth-area><button class="auth-button" data-auth="login">Logi sisse</button><button class="auth-button auth-button-primary" data-auth="register">Registreeru</button></div>
  </header>`;

const authModal = `
  <div class="auth-modal" data-auth-modal hidden>
    <div class="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <button class="auth-close" type="button" data-auth-close aria-label="Sulge">×</button>
      <p class="eyebrow">Isiklik arhiiv</p>
      <h2 id="auth-title" data-auth-title>Sisselogimine</h2>
      <form data-auth-form>
        <label data-name-field hidden>Nimi<input type="text" name="name" autocomplete="name"></label>
        <label>E-post<input type="email" name="email" autocomplete="email" required></label>
        <label>Parool<input type="password" name="password" autocomplete="current-password" minlength="6" required></label>
        <p class="auth-error" data-auth-error role="alert"></p>
        <button class="auth-submit" type="submit" data-auth-submit>Logi sisse <span>↗</span></button>
      </form>
      <button class="auth-switch" type="button" data-auth-switch>Pole kontot? Registreeru</button>
    </div>
  </div>`;

let authMode = 'login';
let currentUser = null;
let articleStore = { ...articles };
let articlesLoaded = false;
const apiUrl = (file) => `${new URL('api/', window.location.href).pathname}${file}`;

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    ...options
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Päringu täitmine ebaõnnestus.');
  return data;
}

async function authRequest(file, options = {}) {
  const response = await fetch(apiUrl(file.replace(/\.php$/, '')), {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    ...options
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Päringu täitmine ebaõnnestus.');
  return data;
}

async function loadArticles(force = false) {
  if (articlesLoaded && !force) return;

  try {
    const data = await fetchJson('/api/articles');
    const databaseArticles = Object.fromEntries((data.articles || []).map((article) => [article.slug, article]));
    articleStore = { ...articleStore, ...databaseArticles };
  } catch {
    // Staatilised artiklid jäävad kättesaadavaks, kui andmebaas on ajutiselt saadaval.
  } finally {
    articlesLoaded = true;
  }
}

// --- UUS FUNKTSIONAALSUS 2: artiklite otsimine märksõna järgi (kasutab /api/articles?q=) ---
async function searchArticles(query) {
  if (!query) return Object.entries(articleStore);
  try {
    const data = await fetchJson(`/api/articles?q=${encodeURIComponent(query)}`);
    const remoteMatches = data.articles || [];
    const remoteSlugSet = new Set(remoteMatches.map((article) => article.slug));
    const localMatches = Object.entries(articles).filter(([slug, article]) =>
      !remoteSlugSet.has(slug) && (
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    );
    return [...remoteMatches.map((article) => [article.slug, article]), ...localMatches];
  } catch {
    const lowered = query.toLowerCase();
    return Object.entries(articleStore).filter(([, article]) =>
      article.title.toLowerCase().includes(lowered) || article.subtitle.toLowerCase().includes(lowered)
    );
  }
}

function setAuthMode(mode) {
  authMode = mode;
  const modal = document.querySelector('[data-auth-modal]');
  if (!modal) return;
  const isRegister = mode === 'register';
  modal.querySelector('[data-auth-title]').textContent = isRegister ? 'Loo konto' : 'Sisselogimine';
  modal.querySelector('[data-name-field]').hidden = !isRegister;
  modal.querySelector('[data-name-field] input').required = isRegister;
  modal.querySelector('[data-auth-submit]').innerHTML = `${isRegister ? 'Registreeru' : 'Logi sisse'} <span>↗</span>`;
  modal.querySelector('[data-auth-switch]').textContent = isRegister ? 'Juba on konto? Logi sisse' : 'Pole kontot? Registreeru';
  modal.querySelector('[data-auth-error]').textContent = '';
}

function openAuth(mode = 'login') {
  const modal = document.querySelector('[data-auth-modal]');
  if (!modal) return;
  setAuthMode(mode);
  modal.hidden = false;
  modal.querySelector('input:not([type="hidden"])').focus();
}

function updateAuthArea(user) {
  currentUser = user;
  const area = document.querySelector('[data-auth-area]');
  if (area) {
    const isAdmin = user && user.role === 'admin';
    area.innerHTML = user
      ? `
        <span class="user-name">${escapeHtml(user.name)}</span>
        ${isAdmin ? '<a class="auth-button" href="#/admin" data-admin-panel>Admin</a>' : ''}
        <button class="auth-button" data-auth-logout>Logi välja</button>
      `
      : '<button class="auth-button" data-auth="login">Logi sisse</button><button class="auth-button auth-button-primary" data-auth="register">Registreeru</button>';

    area.querySelectorAll('[data-auth]').forEach((button) => button.addEventListener('click', () => openAuth(button.dataset.auth)));
    area.querySelector('[data-auth-logout]')?.addEventListener('click', async () => {
      try {
        await authRequest('logout', { method: 'POST', body: '{}' });
        updateAuthArea(null);
      } catch {
        updateAuthArea(null);
      }
    });

    area.querySelector('[data-admin-panel]')?.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.hash = '#/admin';
    });
  }

  const activeComments = document.querySelector('[data-comments-root]');
  if (activeComments) {
    renderCommentsFromState();
  }
}

function bindAuth() {
  document.querySelectorAll('[data-auth]').forEach((button) => button.addEventListener('click', () => openAuth(button.dataset.auth)));
  const modal = document.querySelector('[data-auth-modal]');
  modal.querySelector('[data-auth-close]').addEventListener('click', () => { modal.hidden = true; });
  modal.addEventListener('click', (event) => { if (event.target === modal) modal.hidden = true; });
  modal.querySelector('[data-auth-switch]').addEventListener('click', () => setAuthMode(authMode === 'login' ? 'register' : 'login'));
  modal.querySelector('[data-auth-form]').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const submit = modal.querySelector('[data-auth-submit]');
    const error = modal.querySelector('[data-auth-error]');
    submit.disabled = true;
    error.textContent = '';
    try {
      const data = Object.fromEntries(new FormData(form));
      const result = await authRequest(authMode === 'login' ? 'login' : 'register', { method: 'POST', body: JSON.stringify(data) });
      modal.hidden = true;
      form.reset();
      updateAuthArea(result.user);
    } catch (requestError) {
      error.textContent = requestError.message;
    } finally {
      submit.disabled = false;
    }
  });
  authRequest('me').then(({ user }) => updateAuthArea(user)).catch(() => updateAuthArea(null));
}

function layout(content, route = 'home') {
  document.querySelector('#app').innerHTML = `${nav}<main>${content}</main><footer><span>FILMISFÄÄR / 001</span><span>Kino ajalugu on pilgu ajalugu</span></footer>${authModal}`;
  document.querySelectorAll('[data-route]').forEach((link) => link.classList.toggle('active', link.dataset.route === route));
  bindAuth();
}

function home() {
  layout(`
    <section class="hero">
      <div class="hero-copy reveal"><p class="eyebrow">Visuaalne ajalugu / 1895–tänapäevani</p><h1>Film on<br><em>mälu</em> liikumises.</h1><p class="hero-lead">Teekond ajastute vahel, mis õpetasid meid nägema rohkem, kui mahub ühte kaadrisse.</p><a class="text-link" href="#/article/silent">Alusta teekonda <span>↗</span></a></div>
      <div class="hero-poster reveal"><div class="poster-image"></div><div class="poster-label"><span>THE</span><strong>SEVENTH<br>SENSE</strong><small>Frames from a century</small></div><span class="poster-year">1895</span></div>
    </section>
    <section class="intro-band"><p class="section-kicker">Kolm pöördelist hetke</p><p class="intro-text">Esimesest filmilindi virvendusest digitaalsete maailmadeni — kino on iga kord muutnud mitte ainult ekraani, vaid ka meid.</p></section>
    <section class="timeline-preview"><div class="timeline-line"></div>${Object.entries(articleStore).map(([key, article], index) => `<a class="timeline-card reveal" href="#/article/${key}"><span class="card-index">${String(index + 1).padStart(2, '0')}</span><div><span class="card-year">${escapeHtml(article.year)}</span><h2>${escapeHtml(article.title)}</h2><p>${escapeHtml(article.subtitle)}</p><div class="article-tags">${(article.tags || []).map((tag) => `<span class="tag-chip">${escapeHtml(tag)}</span>`).join('')}</div><span class="arrow">↗</span></div></a>`).join('')}</section>
  `);
}

function tagsPage() {
  const allTags = [...new Set(Object.values(articleStore).flatMap((article) => article.tags || []))].sort((first, second) => first.localeCompare(second, 'et'));

  layout(`
    <section class="tags-page">
      <div class="tags-page-header reveal">
        <p class="eyebrow">Liikumine arhiivis</p>
        <h1>Leia artikkel<br><em>sildi järgi.</em></h1>
        <p>Vali teema, et jätta lehele ainult sellega seotud materjalid.</p>
      </div>
      <input class="tag-search" type="search" data-tag-search placeholder="Otsi märksõna järgi...">
      <div class="tag-filter-list" data-tag-filters>
        <button class="tag-filter active" type="button" data-tag-filter="">Kõik artiklid</button>
        ${allTags.map((tag) => `<button class="tag-filter" type="button" data-tag-filter="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`).join('')}
      </div>
      <div class="tag-results" data-tag-results></div>
    </section>
  `, 'tags');

  const results = document.querySelector('[data-tag-results]');
  const filters = document.querySelectorAll('[data-tag-filter]');
  const searchInput = document.querySelector('[data-tag-search]');

  const renderList = (entries) => {
    results.innerHTML = entries.length
      ? entries.map(([key, article]) => `<a class="tag-result reveal" href="#/article/${key}"><span class="card-year">${escapeHtml(article.year)}</span><h2>${escapeHtml(article.title)}</h2><p>${escapeHtml(article.subtitle)}</p><div class="article-tags">${(article.tags || []).map((tag) => `<span class="tag-chip">${escapeHtml(tag)}</span>`).join('')}</div><span class="arrow">↗</span></a>`).join('')
      : '<p class="tag-empty">Selle sildiga (või otsingusõnaga) artikleid veel ei ole.</p>';
  };

  const renderResults = (selectedTag = '') => {
    const matchingArticles = Object.entries(articleStore).filter(([, article]) => !selectedTag || (article.tags || []).includes(selectedTag));
    renderList(matchingArticles);
  };

  filters.forEach((filter) => {
    filter.addEventListener('click', () => {
      filters.forEach((item) => item.classList.toggle('active', item === filter));
      searchInput.value = '';
      renderResults(filter.dataset.tagFilter);
    });
  });

  let searchTimeout;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
      const query = searchInput.value.trim();
      if (!query) return renderResults('');
      filters.forEach((item) => item.classList.remove('active'));
      renderList(await searchArticles(query));
    }, 250);
  });

  renderResults();
}

async function layoutAdmin() {
  if (!currentUser || currentUser.role !== 'admin') {
    openAuth('login');
    return;
  }

  try {
    const [articlesData, commentsData, tagsData] = await Promise.all([
      fetchJson('/api/admin/articles', { method: 'GET' }),
      fetchJson('/api/admin/comments', { method: 'GET' }),
      fetchJson('/api/admin/tags', { method: 'GET' })
    ]);

    const content = `
      <section class="admin-panel">
        <div class="admin-header">
          <p class="eyebrow">Administraator</p>
          <h1>Halduspaneel</h1>
        </div>

        <div class="admin-sections">
          <div class="admin-card">
            <h2>Lisa artikkel</h2>
            <form class="admin-form" data-admin-article-form>
              <input name="slug" placeholder="slug (nt silent)" required>
              <input name="section" placeholder="Osa" required>
              <input name="title" placeholder="Artikli pealkiri" required>
              <textarea name="subtitle" placeholder="Lühikirjeldus" required></textarea>
              <input name="year" placeholder="Aastad" required>
              <input name="image" placeholder="Pildi URL" required>
              <textarea name="fact" placeholder="Fakt arhiivist" required></textarea>
              <textarea name="body" placeholder="Lõigud, iga uuel real" required></textarea>
              <input name="tags" placeholder="Sildid komadega eraldatult (nt: ajalugu, montaaž)">
              <button type="submit">Salvesta artikkel</button>
            </form>
          </div>

          <div class="admin-card">
            <h2>Sildid</h2>
            <form class="admin-form" data-admin-tag-form>
              <input name="tag" placeholder="Sildi nimi" required>
              <button type="submit">Lisa silt</button>
            </form>
            <ul class="admin-list">${(tagsData.tags || []).map((tag) => `<li><span>${tag.name}</span><button class="tag-delete-button" type="button" data-delete-tag="${tag.id}" aria-label="Kustuta silt ${tag.name}">×</button></li>`).join('')}</ul>
          </div>

          <div class="admin-card admin-wide">
            <h2>Artiklite sildid</h2>
            <ul class="admin-articles-list">
              ${(articlesData.articles || []).map((article) => `
                <li>
                  <div>
                    <strong>${article.title}</strong>
                    <span class="admin-article-tags">${(article.tags || []).length ? (article.tags || []).map((tag, index) => `<span class="admin-article-tag">${tag}<button class="tag-delete-button" type="button" data-delete-article-tag="${article.id}" data-tag-id="${article.tagIds[index]}">×</button></span>`).join('') : 'Silte pole veel'}</span>
                  </div>
                  <form class="admin-form admin-article-edit" data-edit-article-id="${article.id}">
                    <input name="title" value="${article.title}" placeholder="Artikli pealkiri" required>
                    <textarea name="body" placeholder="Lõigud, iga uuel real" required>${(article.body || []).join('\n')}</textarea>
                    <textarea name="fact" placeholder="Märkus arhiivist" required>${article.fact || ''}</textarea>
                    <button type="submit">Salvesta muudatused</button>
                  </form>
                  <form class="admin-tag-attach" data-article-id="${article.id}">
                    <select name="tag" required>
                      <option value="">Vali silt</option>
                      ${(tagsData.tags || []).filter((tag) => !(article.tags || []).includes(tag.name)).map((tag) => `<option value="${tag.name}">${tag.name}</option>`).join('')}
                    </select>
                    <button type="submit">Lisa silt</button>
                  </form>
                </li>
              `).join('') || '<li>Andmebaasis pole veel artikleid.</li>'}
            </ul>
          </div>

          <div class="admin-card admin-wide">
            <h2>Kommentaarid</h2>
            <ul class="admin-comments-list">
              ${(commentsData.comments || []).map((comment) => `
                <li>
                  <div>
                    <strong>${escapeHtml(comment.name)}</strong>
                    <span>${escapeHtml(comment.article_key)}</span>
                    <small>${new Date(comment.created_at).toLocaleString('et-EE')}</small>
                  </div>
                  <p>${escapeHtml(comment.text)}</p>
                  <button data-delete-comment="${escapeHtml(comment.id)}">Kustuta</button>
                </li>
              `).join('') || '<li>Kommentaare pole.</li>'}
            </ul>
          </div>
        </div>
      </section>
    `;

    layout(content, 'admin');

    const articleForm = document.querySelector('[data-admin-article-form]');
    articleForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(articleForm));
      const body = data.body.split('\n').map((line) => line.trim()).filter(Boolean);
      try {
        await fetchJson('/api/admin/articles', {
          method: 'POST',
          body: JSON.stringify({ ...data, body })
        });
        articleForm.reset();
        layoutAdmin();
      } catch (error) {
        alert(error.message);
      }
    });

    const tagForm = document.querySelector('[data-admin-tag-form]');
    tagForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(tagForm));
      try {
        await fetchJson('/api/admin/tags', {
          method: 'POST',
          body: JSON.stringify({ name: data.tag })
        });
        tagForm.reset();
        layoutAdmin();
      } catch (error) {
        alert(error.message);
      }
    });

    document.querySelectorAll('[data-article-id]').forEach((form) => {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const tag = new FormData(form).get('tag');
        try {
          await fetchJson(`/api/admin/articles/${form.dataset.articleId}/tags`, {
            method: 'POST',
            body: JSON.stringify({ tag })
          });
          layoutAdmin();
        } catch (error) {
          alert(error.message);
        }
      });
    });

    document.querySelectorAll('[data-edit-article-id]').forEach((form) => {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        const body = data.body.split('\n').map((line) => line.trim()).filter(Boolean);
        try {
          await fetchJson(`/api/admin/articles/${form.dataset.editArticleId}`, {
            method: 'PUT',
            body: JSON.stringify({ title: data.title, body, fact: data.fact })
          });
          layoutAdmin();
        } catch (error) {
          alert(error.message);
        }
      });
    });

    document.querySelectorAll('[data-delete-article-tag]').forEach((button) => {
      button.addEventListener('click', async () => {
        try {
          await fetchJson(`/api/admin/articles/${button.dataset.deleteArticleTag}/tags/${button.dataset.tagId}`, { method: 'DELETE' });
          layoutAdmin();
        } catch (error) {
          alert(error.message);
        }
      });
    });

    document.querySelectorAll('[data-delete-tag]').forEach((button) => {
      button.addEventListener('click', async () => {
        try {
          await fetchJson(`/api/admin/tags/${button.dataset.deleteTag}`, { method: 'DELETE' });
          layoutAdmin();
        } catch (error) {
          alert(error.message);
        }
      });
    });

    document.querySelectorAll('[data-delete-comment]').forEach((button) => {
      button.addEventListener('click', async () => {
        const id = button.dataset.deleteComment;
        try {
          await fetchJson(`/api/admin/comments/${id}`, { method: 'DELETE' });
          layoutAdmin();
        } catch (error) {
          alert(error.message);
        }
      });
    });
  } catch (error) {
    alert(error.message);
  }
}

async function fetchComments(articleKey) {
  try {
    const response = await fetch(`/api/comments/${articleKey}`, { credentials: 'same-origin' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Kommentaaride laadimine ebaõnnestus.');
    return data.comments || [];
  } catch {
    return [];
  }
}

async function renderCommentsFromState() {
  const commentsRoot = document.querySelector('[data-comments-root]');
  if (!commentsRoot) return;

  const articleKey = commentsRoot.dataset.articleKey;
  const comments = await fetchComments(articleKey);
  const isLoggedIn = Boolean(currentUser);

  commentsRoot.innerHTML = `
    <div class="comments-block">
      <div class="comments-header">
        <p class="eyebrow">Kommentaarid</p>
        <span>${comments.length} ${comments.length === 1 ? 'kommentaar' : 'kommentaari'}</span>
      </div>
      ${isLoggedIn ? `
        <form class="comment-form" data-comment-form>
          <textarea name="text" maxlength="500" rows="4" placeholder="Kirjutage kommentaar..." required></textarea>
          <div class="comment-actions">
            <span class="comment-status" data-comment-status></span>
            <button type="submit">Saada</button>
          </div>
        </form>
      ` : `
        <div class="comment-login-prompt">Ainult registreeritud kasutajad saavad kommenteerida.</div>
      `}
      <div class="comments-list">
        ${comments.length
          ? comments.map((comment) => {
            const isOwn = currentUser && comment.user_id === currentUser.id;
            return `
            <article class="comment-item" data-comment-id="${comment.id}">
              <div class="comment-meta"><strong>${escapeHtml(comment.name)}</strong><time>${new Date(comment.created_at).toLocaleString('et-EE', { dateStyle: 'short', timeStyle: 'short' })}</time></div>
              <p data-comment-text>${escapeHtml(comment.text)}</p>
              ${isOwn ? `
                <div class="comment-own-actions">
                  <button type="button" data-comment-edit>Muuda</button>
                  <button type="button" data-comment-delete>Kustuta</button>
                </div>
              ` : ''}
            </article>
          `;
          }).join('')
          : `<div class="comment-empty">Kommentaare pole veel. Ole esimene.</div>`}
      </div>
    </div>
  `;

  const form = commentsRoot.querySelector('[data-comment-form]');
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const textarea = form.querySelector('textarea');
    const status = form.querySelector('[data-comment-status]');
    const text = textarea.value.trim();

    if (!text) {
      status.textContent = 'Sisestage kommentaari tekst.';
      return;
    }

    status.textContent = 'Saatmine...';
    try {
      const response = await fetch(`/api/comments/${articleKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Kommentaari saatmine ebaõnnestus.');
      textarea.value = '';
      status.textContent = 'Kommentaar on lisatud.';
      await renderCommentsFromState();
    } catch (error) {
      status.textContent = error.message;
    }
  });

  // --- UUS FUNKTSIONAALSUS 3: enda kommentaari muutmine ja kustutamine ---
  commentsRoot.querySelectorAll('[data-comment-edit]').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('[data-comment-id]');
      const textEl = item.querySelector('[data-comment-text]');
      const currentText = textEl.textContent;
      textEl.outerHTML = `
        <form class="comment-edit-form" data-comment-edit-form>
          <textarea maxlength="500" rows="3" required>${escapeHtml(currentText)}</textarea>
          <div class="comment-actions">
            <button type="submit">Salvesta</button>
            <button type="button" data-comment-cancel-edit>Loobu</button>
          </div>
        </form>
      `;

      const editForm = item.querySelector('[data-comment-edit-form]');
      editForm.querySelector('[data-comment-cancel-edit]').addEventListener('click', () => renderCommentsFromState());
      editForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const newText = editForm.querySelector('textarea').value.trim();
        try {
          await fetchJson(`/api/comments/entry/${item.dataset.commentId}`, {
            method: 'PUT',
            body: JSON.stringify({ text: newText })
          });
          await renderCommentsFromState();
        } catch (error) {
          alert(error.message);
        }
      });
    });
  });

  commentsRoot.querySelectorAll('[data-comment-delete]').forEach((button) => {
    button.addEventListener('click', async () => {
      const item = button.closest('[data-comment-id]');
      if (!window.confirm('Kustutada see kommentaar?')) return;
      try {
        await fetchJson(`/api/comments/entry/${item.dataset.commentId}`, { method: 'DELETE' });
        await renderCommentsFromState();
      } catch (error) {
        alert(error.message);
      }
    });
  });
}

function articlePage(key) {
  const article = articleStore[key] || articleStore.silent;
  layout(`
    <article class="article-page">
      <div class="article-heading reveal"><p class="eyebrow">${escapeHtml(article.section)}</p><h1>${escapeHtml(article.title)}</h1><p class="article-subtitle">${escapeHtml(article.subtitle)}</p><div class="article-tags article-tags-large">${(article.tags || []).map((tag) => `<span class="tag-chip">${escapeHtml(tag)}</span>`).join('')}</div><div class="article-meta"><span>${escapeHtml(article.year)}</span><span>Lugemine / 04 min</span></div></div>
      <div class="article-visual reveal"><img src="${escapeHtml(article.image)}" alt="Filmikaader" /><span class="image-caption">Kaader kui tunnistaja. Film kui jälg.</span></div>
      <div class="article-grid"><div class="article-aside"><span class="vertical-label">FILMISFÄÄR / MÄRKMED</span></div><div class="article-body">${article.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}<aside class="fact"><span class="fact-label">Märkus arhiivist</span><p>${escapeHtml(article.fact)}</p></aside><a class="text-link" href="#/">Tagasi ajajoone juurde <span>↗</span></a>
      <div class="comments-root" data-comments-root data-article-key="${key}"></div>
      </div></div>
    </article>
  `, key);

  renderCommentsFromState();
}

async function render() {
  await loadArticles(true);
  const path = window.location.hash.replace('#', '') || '/';
  if (path === '/admin') {
    await layoutAdmin();
    window.scrollTo(0, 0);
    return;
  }
  if (path === '/tags') {
    tagsPage();
    window.scrollTo(0, 0);
    return;
  }
  const match = path.match(/^\/article\/([^/]+)$/);
  match ? articlePage(match[1]) : home();
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
render();
