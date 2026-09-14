import './style.css';

const articles = {
  silent: {
    section: '01 / Истоки',
    title: 'Когда кадр научился дышать',
    subtitle: 'Немое кино не было безмолвным. Оно говорило монтажом, жестом и светом — и придумало грамматику, которой мы пользуемся до сих пор.',
    year: '1895—1927',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1800&q=85',
    body: [
      'Первые показы братьев Люмьер были короткими зарисовками, но зритель сразу увидел в них не просто технический аттракцион, а новый способ смотреть на реальность. Поезд, прибывающий на вокзал, был событием именно потому, что двигался внутри рамки.',
      'Вскоре кино вышло за пределы фиксации. Жорж Мельес превратил камеру в сцену для иллюзий, а Дэвид Уорк Гриффит и Сергей Эйзенштейн начали собирать эмоцию из соседства планов. Монтаж стал не склейкой, а мыслью.'
    ],
    fact: 'Первый публичный киносеанс братьев Люмьер состоялся в Париже 28 декабря 1895 года.'
  },
  nouvelle: {
    section: '02 / Свобода взгляда',
    title: 'Камера выходит на улицу',
    subtitle: 'Французская новая волна отказалась от гладкости студийного кино и вернула фильму нерв живого разговора.',
    year: '1958—1968',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1800&q=85',
    body: [
      'В конце 1950-х молодые критики журнала Cahiers du Cinéma стали режиссёрами. Жан-Люк Годар, Франсуа Трюффо, Аньес Варда и их коллеги снимали там, где была жизнь: в квартирах, кафе, на улицах Парижа.',
      'Их фильмы позволяли себе сбиваться, смотреть в объектив и оставлять монтажные швы видимыми. Новая волна напомнила: кино может быть не только иллюзией, но и личным высказыванием — лёгким, дерзким, несовершенным.'
    ],
    fact: '«На последнем дыхании» Годара прославил резкие склейки, позже названные jump cut.'
  },
  blockbuster: {
    section: '03 / Большой экран',
    title: 'Как лето стало премьерой',
    subtitle: 'Блокбастер превратил поход в кино в коллективный ритуал, а маркетинг — в часть самого зрелища.',
    year: '1975—1999',
    image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1800&q=85',
    body: [
      '«Челюсти» Стивена Спилберга стали первым настоящим летним блокбастером: фильм одновременно захватил экраны, разговоры и рекламные каналы. Через два года «Звёздные войны» доказали, что вселенная может продолжаться за пределами финальных титров.',
      'В эти десятилетия студии научились мыслить событием. Постер, трейлер, игрушка, саундтрек и сам фильм складывались в единый культурный опыт. Большой экран стал местом, где зрители приходили не только за историей, но и за масштабом.'
    ],
    fact: '«Челюсти» 1975 года первыми собрали более 100 миллионов долларов в прокате США.'
  }
};

const nav = `
  <header class="site-header">
    <a class="brand" href="#/">КИНО<span>СФЕРА</span></a>
    <nav class="main-nav" aria-label="Основная навигация">
      <a href="#/" data-route="home">Хроника</a>
      <a href="#/article/silent" data-route="silent">Немое кино</a>
      <a href="#/article/nouvelle" data-route="nouvelle">Новая волна</a>
      <a href="#/article/blockbuster" data-route="blockbuster">Блокбастеры</a>
    </nav>
    <div class="auth-area" data-auth-area><button class="auth-button" data-auth="login">Войти</button><button class="auth-button auth-button-primary" data-auth="register">Регистрация</button></div>
  </header>`;

const authModal = `
  <div class="auth-modal" data-auth-modal hidden>
    <div class="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <button class="auth-close" type="button" data-auth-close aria-label="Закрыть">×</button>
      <p class="eyebrow">Личный архив</p>
      <h2 id="auth-title" data-auth-title>Вход в аккаунт</h2>
      <form data-auth-form>
        <label data-name-field hidden>Имя<input type="text" name="name" autocomplete="name"></label>
        <label>Email<input type="email" name="email" autocomplete="email" required></label>
        <label>Пароль<input type="password" name="password" autocomplete="current-password" minlength="6" required></label>
        <p class="auth-error" data-auth-error role="alert"></p>
        <button class="auth-submit" type="submit" data-auth-submit>Войти <span>↗</span></button>
      </form>
      <button class="auth-switch" type="button" data-auth-switch>Нет аккаунта? Зарегистрироваться</button>
    </div>
  </div>`;

let authMode = 'login';
let currentUser = null;
const apiUrl = (file) => `${new URL('api/', window.location.href).pathname}${file}`;

async function authRequest(file, options = {}) {
  const response = await fetch(apiUrl(file.replace(/\.php$/, '')), {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    ...options
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Не удалось выполнить запрос.');
  return data;
}

function setAuthMode(mode) {
  authMode = mode;
  const modal = document.querySelector('[data-auth-modal]');
  if (!modal) return;
  const isRegister = mode === 'register';
  modal.querySelector('[data-auth-title]').textContent = isRegister ? 'Создать аккаунт' : 'Вход в аккаунт';
  modal.querySelector('[data-name-field]').hidden = !isRegister;
  modal.querySelector('[data-name-field] input').required = isRegister;
  modal.querySelector('[data-auth-submit]').innerHTML = `${isRegister ? 'Зарегистрироваться' : 'Войти'} <span>↗</span>`;
  modal.querySelector('[data-auth-switch]').textContent = isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться';
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
  if (!area) return;
  area.innerHTML = user
    ? `<span class="user-name">${user.name}</span><button class="auth-button" data-auth-logout>Выйти</button>`
    : '<button class="auth-button" data-auth="login">Войти</button><button class="auth-button auth-button-primary" data-auth="register">Регистрация</button>';
  area.querySelectorAll('[data-auth]').forEach((button) => button.addEventListener('click', () => openAuth(button.dataset.auth)));
  area.querySelector('[data-auth-logout]')?.addEventListener('click', async () => {
    try {
      await authRequest('logout', { method: 'POST', body: '{}' });
      updateAuthArea(null);
      const activeCommentForm = document.querySelector('[data-comment-form]');
      if (activeCommentForm) activeCommentForm.remove();
      const activeComments = document.querySelector('[data-comments]');
      if (activeComments) renderCommentsFromState();
    } catch {
      updateAuthArea(null);
    }
  });
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
  document.querySelector('#app').innerHTML = `${nav}<main>${content}</main><footer><span>КИНОСФЕРА / 001</span><span>История кино — это история взгляда</span></footer>${authModal}`;
  document.querySelectorAll('[data-route]').forEach((link) => link.classList.toggle('active', link.dataset.route === route));
  bindAuth();
}

function home() {
  layout(`
    <section class="hero">
      <div class="hero-copy reveal"><p class="eyebrow">Визуальная история / 1895—сегодня</p><h1>Кино — это<br><em>память</em> в движении.</h1><p class="hero-lead">Путешествие по эпохам, которые научили нас видеть больше, чем помещается в одном кадре.</p><a class="text-link" href="#/article/silent">Начать путешествие <span>↗</span></a></div>
      <div class="hero-poster reveal"><div class="poster-image"></div><div class="poster-label"><span>THE</span><strong>SEVENTH<br>SENSE</strong><small>Frames from a century</small></div><span class="poster-year">1895</span></div>
    </section>
    <section class="intro-band"><p class="section-kicker">Три поворотных момента</p><p class="intro-text">От первого мерцания плёнки до цифровых миров — кино каждый раз меняло не только экран, но и нас.</p></section>
    <section class="timeline-preview"><div class="timeline-line"></div>${Object.entries(articles).map(([key, article], index) => `<a class="timeline-card reveal" href="#/article/${key}"><span class="card-index">0${index + 1}</span><div><span class="card-year">${article.year}</span><h2>${article.title}</h2><p>${article.subtitle}</p><span class="arrow">↗</span></div></a>`).join('')}</section>
  `);
}

async function fetchComments(articleKey) {
  try {
    const response = await fetch(`/api/comments/${articleKey}`, { credentials: 'same-origin' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Не удалось загрузить комментарии.');
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
        <p class="eyebrow">Комментарии</p>
        <span>${comments.length} ${comments.length === 1 ? 'комментарий' : comments.length < 5 ? 'комментария' : 'комментариев'}</span>
      </div>
      ${isLoggedIn ? `
        <form class="comment-form" data-comment-form>
          <textarea name="text" maxlength="500" rows="4" placeholder="Напишите комментарий..." required></textarea>
          <div class="comment-actions">
            <span class="comment-status" data-comment-status></span>
            <button type="submit">Отправить</button>
          </div>
        </form>
      ` : `
        <div class="comment-login-prompt">Только зарегистрированные пользователи могут оставлять комментарии.</div>
      `}
      <div class="comments-list">
        ${comments.length
          ? comments.map((comment) => `
            <article class="comment-item">
              <div class="comment-meta"><strong>${comment.name}</strong><time>${new Date(comment.created_at).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' })}</time></div>
              <p>${comment.text}</p>
            </article>
          `).join('')
          : `<div class="comment-empty">Пока нет комментариев. Будьте первым.</div>`}
      </div>
    </div>
  `;

  const form = commentsRoot.querySelector('[data-comment-form]');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const textarea = form.querySelector('textarea');
    const status = form.querySelector('[data-comment-status]');
    const text = textarea.value.trim();

    if (!text) {
      status.textContent = 'Введите текст комментария.';
      return;
    }

    status.textContent = 'Отправка...';
    try {
      const response = await fetch(`/api/comments/${articleKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Не удалось отправить комментарий.');
      textarea.value = '';
      status.textContent = 'Комментарий добавлен.';
      await renderCommentsFromState();
    } catch (error) {
      status.textContent = error.message;
    }
  });
}

function articlePage(key) {
  const article = articles[key] || articles.silent;
  layout(`
    <article class="article-page">
      <div class="article-heading reveal"><p class="eyebrow">${article.section}</p><h1>${article.title}</h1><p class="article-subtitle">${article.subtitle}</p><div class="article-meta"><span>${article.year}</span><span>Чтение / 04 мин</span></div></div>
      <div class="article-visual reveal"><img src="${article.image}" alt="Кинематографический кадр" /><span class="image-caption">Кадр как свидетель. Фильм как след.</span></div>
      <div class="article-grid"><div class="article-aside"><span class="vertical-label">КИНОСФЕРА / ЗАПИСКИ</span></div><div class="article-body">${article.body.map((paragraph) => `<p>${paragraph}</p>`).join('')}<aside class="fact"><span class="fact-label">Заметка из архива</span><p>${article.fact}</p></aside><a class="text-link" href="#/">Вернуться к хронике <span>↗</span></a>
      <div class="comments-root" data-comments-root data-article-key="${key}"></div>
      </div></div>
    </article>
  `, key);

  renderCommentsFromState();
}

function render() {
  const path = window.location.hash.replace('#', '') || '/';
  const match = path.match(/^\/article\/(silent|nouvelle|blockbuster)$/);
  match ? articlePage(match[1]) : home();
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
render();