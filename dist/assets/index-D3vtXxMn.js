(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={silent:{section:`01 / Истоки`,title:`Когда кадр научился дышать`,subtitle:`Немое кино не было безмолвным. Оно говорило монтажом, жестом и светом — и придумало грамматику, которой мы пользуемся до сих пор.`,year:`1895—1927`,image:`https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1800&q=85`,body:[`Первые показы братьев Люмьер были короткими зарисовками, но зритель сразу увидел в них не просто технический аттракцион, а новый способ смотреть на реальность. Поезд, прибывающий на вокзал, был событием именно потому, что двигался внутри рамки.`,`Вскоре кино вышло за пределы фиксации. Жорж Мельес превратил камеру в сцену для иллюзий, а Дэвид Уорк Гриффит и Сергей Эйзенштейн начали собирать эмоцию из соседства планов. Монтаж стал не склейкой, а мыслью.`],fact:`Первый публичный киносеанс братьев Люмьер состоялся в Париже 28 декабря 1895 года.`},nouvelle:{section:`02 / Свобода взгляда`,title:`Камера выходит на улицу`,subtitle:`Французская новая волна отказалась от гладкости студийного кино и вернула фильму нерв живого разговора.`,year:`1958—1968`,image:`https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1800&q=85`,body:[`В конце 1950-х молодые критики журнала Cahiers du Cinéma стали режиссёрами. Жан-Люк Годар, Франсуа Трюффо, Аньес Варда и их коллеги снимали там, где была жизнь: в квартирах, кафе, на улицах Парижа.`,`Их фильмы позволяли себе сбиваться, смотреть в объектив и оставлять монтажные швы видимыми. Новая волна напомнила: кино может быть не только иллюзией, но и личным высказыванием — лёгким, дерзким, несовершенным.`],fact:`«На последнем дыхании» Годара прославил резкие склейки, позже названные jump cut.`},blockbuster:{section:`03 / Большой экран`,title:`Как лето стало премьерой`,subtitle:`Блокбастер превратил поход в кино в коллективный ритуал, а маркетинг — в часть самого зрелища.`,year:`1975—1999`,image:`https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1800&q=85`,body:[`«Челюсти» Стивена Спилберга стали первым настоящим летним блокбастером: фильм одновременно захватил экраны, разговоры и рекламные каналы. Через два года «Звёздные войны» доказали, что вселенная может продолжаться за пределами финальных титров.`,`В эти десятилетия студии научились мыслить событием. Постер, трейлер, игрушка, саундтрек и сам фильм складывались в единый культурный опыт. Большой экран стал местом, где зрители приходили не только за историей, но и за масштабом.`],fact:`«Челюсти» 1975 года первыми собрали более 100 миллионов долларов в прокате США.`}},t=`
  <header class="site-header">
    <a class="brand" href="#/">КИНО<span>СФЕРА</span></a>
    <nav class="main-nav" aria-label="Основная навигация">
      <a href="#/" data-route="home">Хроника</a>
      <a href="#/article/silent" data-route="silent">Немое кино</a>
      <a href="#/article/nouvelle" data-route="nouvelle">Новая волна</a>
      <a href="#/article/blockbuster" data-route="blockbuster">Блокбастеры</a>
    </nav>
    <div class="auth-area" data-auth-area><button class="auth-button" data-auth="login">Войти</button><button class="auth-button auth-button-primary" data-auth="register">Регистрация</button></div>
  </header>`,n=`
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
  </div>`,r=`login`,i=null,a=e=>`${new URL(`api/`,window.location.href).pathname}${e}`;async function o(e,t={}){let n=await fetch(a(e.replace(/\.php$/,``)),{headers:{"Content-Type":`application/json`},credentials:`same-origin`,...t}),r=await n.json();if(!n.ok)throw Error(r.error||`Не удалось выполнить запрос.`);return r}function s(e){r=e;let t=document.querySelector(`[data-auth-modal]`);if(!t)return;let n=e===`register`;t.querySelector(`[data-auth-title]`).textContent=n?`Создать аккаунт`:`Вход в аккаунт`,t.querySelector(`[data-name-field]`).hidden=!n,t.querySelector(`[data-name-field] input`).required=n,t.querySelector(`[data-auth-submit]`).innerHTML=`${n?`Зарегистрироваться`:`Войти`} <span>↗</span>`,t.querySelector(`[data-auth-switch]`).textContent=n?`Уже есть аккаунт? Войти`:`Нет аккаунта? Зарегистрироваться`,t.querySelector(`[data-auth-error]`).textContent=``}function c(e=`login`){let t=document.querySelector(`[data-auth-modal]`);t&&(s(e),t.hidden=!1,t.querySelector(`input:not([type="hidden"])`).focus())}function l(e){i=e;let t=document.querySelector(`[data-auth-area]`);t&&(t.innerHTML=e?`<span class="user-name">${e.name}</span><button class="auth-button" data-auth-logout>Выйти</button>`:`<button class="auth-button" data-auth="login">Войти</button><button class="auth-button auth-button-primary" data-auth="register">Регистрация</button>`,t.querySelectorAll(`[data-auth]`).forEach(e=>e.addEventListener(`click`,()=>c(e.dataset.auth))),t.querySelector(`[data-auth-logout]`)?.addEventListener(`click`,async()=>{try{await o(`logout`,{method:`POST`,body:`{}`}),l(null);let e=document.querySelector(`[data-comment-form]`);e&&e.remove(),document.querySelector(`[data-comments]`)&&m()}catch{l(null)}}))}function u(){document.querySelectorAll(`[data-auth]`).forEach(e=>e.addEventListener(`click`,()=>c(e.dataset.auth)));let e=document.querySelector(`[data-auth-modal]`);e.querySelector(`[data-auth-close]`).addEventListener(`click`,()=>{e.hidden=!0}),e.addEventListener(`click`,t=>{t.target===e&&(e.hidden=!0)}),e.querySelector(`[data-auth-switch]`).addEventListener(`click`,()=>s(r===`login`?`register`:`login`)),e.querySelector(`[data-auth-form]`).addEventListener(`submit`,async t=>{t.preventDefault();let n=t.currentTarget,i=e.querySelector(`[data-auth-submit]`),a=e.querySelector(`[data-auth-error]`);i.disabled=!0,a.textContent=``;try{let t=Object.fromEntries(new FormData(n)),i=await o(r===`login`?`login`:`register`,{method:`POST`,body:JSON.stringify(t)});e.hidden=!0,n.reset(),l(i.user)}catch(e){a.textContent=e.message}finally{i.disabled=!1}}),o(`me`).then(({user:e})=>l(e)).catch(()=>l(null))}function d(e,r=`home`){document.querySelector(`#app`).innerHTML=`${t}<main>${e}</main><footer><span>КИНОСФЕРА / 001</span><span>История кино — это история взгляда</span></footer>${n}`,document.querySelectorAll(`[data-route]`).forEach(e=>e.classList.toggle(`active`,e.dataset.route===r)),u()}function f(){d(`
    <section class="hero">
      <div class="hero-copy reveal"><p class="eyebrow">Визуальная история / 1895—сегодня</p><h1>Кино — это<br><em>память</em> в движении.</h1><p class="hero-lead">Путешествие по эпохам, которые научили нас видеть больше, чем помещается в одном кадре.</p><a class="text-link" href="#/article/silent">Начать путешествие <span>↗</span></a></div>
      <div class="hero-poster reveal"><div class="poster-image"></div><div class="poster-label"><span>THE</span><strong>SEVENTH<br>SENSE</strong><small>Frames from a century</small></div><span class="poster-year">1895</span></div>
    </section>
    <section class="intro-band"><p class="section-kicker">Три поворотных момента</p><p class="intro-text">От первого мерцания плёнки до цифровых миров — кино каждый раз меняло не только экран, но и нас.</p></section>
    <section class="timeline-preview"><div class="timeline-line"></div>${Object.entries(e).map(([e,t],n)=>`<a class="timeline-card reveal" href="#/article/${e}"><span class="card-index">0${n+1}</span><div><span class="card-year">${t.year}</span><h2>${t.title}</h2><p>${t.subtitle}</p><span class="arrow">↗</span></div></a>`).join(``)}</section>
  `)}async function p(e){try{let t=await fetch(`/api/comments/${e}`,{credentials:`same-origin`}),n=await t.json();if(!t.ok)throw Error(n.error||`Не удалось загрузить комментарии.`);return n.comments||[]}catch{return[]}}async function m(){let e=document.querySelector(`[data-comments-root]`);if(!e)return;let t=e.dataset.articleKey,n=await p(t),r=!!i;e.innerHTML=`
    <div class="comments-block">
      <div class="comments-header">
        <p class="eyebrow">Комментарии</p>
        <span>${n.length} ${n.length===1?`комментарий`:n.length<5?`комментария`:`комментариев`}</span>
      </div>
      ${r?`
        <form class="comment-form" data-comment-form>
          <textarea name="text" maxlength="500" rows="4" placeholder="Напишите комментарий..." required></textarea>
          <div class="comment-actions">
            <span class="comment-status" data-comment-status></span>
            <button type="submit">Отправить</button>
          </div>
        </form>
      `:`
        <div class="comment-login-prompt">Только зарегистрированные пользователи могут оставлять комментарии.</div>
      `}
      <div class="comments-list">
        ${n.length?n.map(e=>`
            <article class="comment-item">
              <div class="comment-meta"><strong>${e.name}</strong><time>${new Date(e.created_at).toLocaleString(`ru-RU`,{dateStyle:`short`,timeStyle:`short`})}</time></div>
              <p>${e.text}</p>
            </article>
          `).join(``):`<div class="comment-empty">Пока нет комментариев. Будьте первым.</div>`}
      </div>
    </div>
  `;let a=e.querySelector(`[data-comment-form]`);a&&a.addEventListener(`submit`,async e=>{e.preventDefault();let n=a.querySelector(`textarea`),r=a.querySelector(`[data-comment-status]`),i=n.value.trim();if(!i){r.textContent=`Введите текст комментария.`;return}r.textContent=`Отправка...`;try{let e=await fetch(`/api/comments/${t}`,{method:`POST`,headers:{"Content-Type":`application/json`},credentials:`same-origin`,body:JSON.stringify({text:i})}),a=await e.json();if(!e.ok)throw Error(a.error||`Не удалось отправить комментарий.`);n.value=``,r.textContent=`Комментарий добавлен.`,await m()}catch(e){r.textContent=e.message}})}function h(t){let n=e[t]||e.silent;d(`
    <article class="article-page">
      <div class="article-heading reveal"><p class="eyebrow">${n.section}</p><h1>${n.title}</h1><p class="article-subtitle">${n.subtitle}</p><div class="article-meta"><span>${n.year}</span><span>Чтение / 04 мин</span></div></div>
      <div class="article-visual reveal"><img src="${n.image}" alt="Кинематографический кадр" /><span class="image-caption">Кадр как свидетель. Фильм как след.</span></div>
      <div class="article-grid"><div class="article-aside"><span class="vertical-label">КИНОСФЕРА / ЗАПИСКИ</span></div><div class="article-body">${n.body.map(e=>`<p>${e}</p>`).join(``)}<aside class="fact"><span class="fact-label">Заметка из архива</span><p>${n.fact}</p></aside><a class="text-link" href="#/">Вернуться к хронике <span>↗</span></a>
      <div class="comments-root" data-comments-root data-article-key="${t}"></div>
      </div></div>
    </article>
  `,t),m()}function g(){let e=(window.location.hash.replace(`#`,``)||`/`).match(/^\/article\/(silent|nouvelle|blockbuster)$/);e?h(e[1]):f(),window.scrollTo(0,0)}window.addEventListener(`hashchange`,g),g();