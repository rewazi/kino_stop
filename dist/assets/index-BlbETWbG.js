(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={silent:{section:`01 / Истоки`,title:`Когда кадр научился дышать`,subtitle:`Немое кино не было безмолвным. Оно говорило монтажом, жестом и светом — и придумало грамматику, которой мы пользуемся до сих пор.`,year:`1895—1927`,image:`https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1800&q=85`,tags:[`немое кино`,`монтаж`,`первые кадры`],body:[`Первые показы братьев Люмьер были короткими зарисовками, но зритель сразу увидел в них не просто технический аттракцион, а новый способ смотреть на реальность. Поезд, прибывающий на вокзал, был событием именно потому, что двигался внутри рамки.`,`Вскоре кино вышло за пределы фиксации. Жорж Мельес превратил камеру в сцену для иллюзий, а Дэвид Уорк Гриффит и Сергей Эйзенштейн начали собирать эмоцию из соседства планов. Монтаж стал не склейкой, а мыслью.`],fact:`Первый публичный киносеанс братьев Люмьер состоялся в Париже 28 декабря 1895 года.`},nouvelle:{section:`02 / Свобода взгляда`,title:`Камера выходит на улицу`,subtitle:`Французская новая волна отказалась от гладкости студийного кино и вернула фильму нерв живого разговора.`,year:`1958—1968`,image:`https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1800&q=85`,tags:[`новая волна`,`Париж`,`свобода формы`],body:[`В конце 1950-х молодые критики журнала Cahiers du Cinéma стали режиссёрами. Жан-Люк Годар, Франсуа Трюффо, Аньес Варда и их коллеги снимали там, где была жизнь: в квартирах, кафе, на улицах Парижа.`,`Их фильмы позволяли себе сбиваться, смотреть в объектив и оставлять монтажные швы видимыми. Новая волна напомнила: кино может быть не только иллюзией, но и личным высказыванием — лёгким, дерзким, несовершенным.`],fact:`«На последнем дыхании» Годара прославил резкие склейки, позже названные jump cut.`},blockbuster:{section:`03 / Большой экран`,title:`Как лето стало премьерой`,subtitle:`Блокбастер превратил поход в кино в коллективный ритуал, а маркетинг — в часть самого зрелища.`,year:`1975—1999`,image:`https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1800&q=85`,tags:[`блокбастеры`,`прокат`,`медиафраншизы`],body:[`«Челюсти» Стивена Спилберга стали первым настоящим летним блокбастером: фильм одновременно захватил экраны, разговоры и рекламные каналы. Через два года «Звёздные войны» доказали, что вселенная может продолжаться за пределами финальных титров.`,`В эти десятилетия студии научились мыслить событием. Постер, трейлер, игрушка, саундтрек и сам фильм складывались в единый культурный опыт. Большой экран стал местом, где зрители приходили не только за историей, но и за масштабом.`],fact:`«Челюсти» 1975 года первыми собрали более 100 миллионов долларов в прокате США.`}},t=`
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
  </div>`,r=`login`,i=null,a={...e},o=!1,s=e=>`${new URL(`api/`,window.location.href).pathname}${e}`;async function c(e,t={}){let n=await fetch(e,{headers:{"Content-Type":`application/json`},credentials:`same-origin`,...t}),r=await n.json();if(!n.ok)throw Error(r.error||`Не удалось выполнить запрос.`);return r}async function l(e,t={}){let n=await fetch(s(e.replace(/\.php$/,``)),{headers:{"Content-Type":`application/json`},credentials:`same-origin`,...t}),r=await n.json();if(!n.ok)throw Error(r.error||`Не удалось выполнить запрос.`);return r}async function u(e=!1){if(!o||e)try{let e=await c(`/api/articles`),t=Object.fromEntries((e.articles||[]).map(e=>[e.slug,e]));a={...a,...t}}catch{}finally{o=!0}}function d(e){r=e;let t=document.querySelector(`[data-auth-modal]`);if(!t)return;let n=e===`register`;t.querySelector(`[data-auth-title]`).textContent=n?`Создать аккаунт`:`Вход в аккаунт`,t.querySelector(`[data-name-field]`).hidden=!n,t.querySelector(`[data-name-field] input`).required=n,t.querySelector(`[data-auth-submit]`).innerHTML=`${n?`Зарегистрироваться`:`Войти`} <span>↗</span>`,t.querySelector(`[data-auth-switch]`).textContent=n?`Уже есть аккаунт? Войти`:`Нет аккаунта? Зарегистрироваться`,t.querySelector(`[data-auth-error]`).textContent=``}function f(e=`login`){let t=document.querySelector(`[data-auth-modal]`);t&&(d(e),t.hidden=!1,t.querySelector(`input:not([type="hidden"])`).focus())}function p(e){i=e;let t=document.querySelector(`[data-auth-area]`);if(!t)return;let n=e&&e.role===`admin`;t.innerHTML=e?`
      <span class="user-name">${e.name}</span>
      ${n?`<a class="auth-button" href="#/admin" data-admin-panel>Админ</a>`:``}
      <button class="auth-button" data-auth-logout>Выйти</button>
    `:`<button class="auth-button" data-auth="login">Войти</button><button class="auth-button auth-button-primary" data-auth="register">Регистрация</button>`,t.querySelectorAll(`[data-auth]`).forEach(e=>e.addEventListener(`click`,()=>f(e.dataset.auth))),t.querySelector(`[data-auth-logout]`)?.addEventListener(`click`,async()=>{try{await l(`logout`,{method:`POST`,body:`{}`}),p(null);let e=document.querySelector(`[data-comment-form]`);e&&e.remove(),document.querySelector(`[data-comments-root]`)&&y()}catch{p(null)}}),t.querySelector(`[data-admin-panel]`)?.addEventListener(`click`,e=>{e.preventDefault(),window.location.hash=`#/admin`})}function m(){document.querySelectorAll(`[data-auth]`).forEach(e=>e.addEventListener(`click`,()=>f(e.dataset.auth)));let e=document.querySelector(`[data-auth-modal]`);e.querySelector(`[data-auth-close]`).addEventListener(`click`,()=>{e.hidden=!0}),e.addEventListener(`click`,t=>{t.target===e&&(e.hidden=!0)}),e.querySelector(`[data-auth-switch]`).addEventListener(`click`,()=>d(r===`login`?`register`:`login`)),e.querySelector(`[data-auth-form]`).addEventListener(`submit`,async t=>{t.preventDefault();let n=t.currentTarget,i=e.querySelector(`[data-auth-submit]`),a=e.querySelector(`[data-auth-error]`);i.disabled=!0,a.textContent=``;try{let t=Object.fromEntries(new FormData(n)),i=await l(r===`login`?`login`:`register`,{method:`POST`,body:JSON.stringify(t)});e.hidden=!0,n.reset(),p(i.user)}catch(e){a.textContent=e.message}finally{i.disabled=!1}}),l(`me`).then(({user:e})=>p(e)).catch(()=>p(null))}function h(e,r=`home`){document.querySelector(`#app`).innerHTML=`${t}<main>${e}</main><footer><span>КИНОСФЕРА / 001</span><span>История кино — это история взгляда</span></footer>${n}`,document.querySelectorAll(`[data-route]`).forEach(e=>e.classList.toggle(`active`,e.dataset.route===r)),m()}function g(){h(`
    <section class="hero">
      <div class="hero-copy reveal"><p class="eyebrow">Визуальная история / 1895—сегодня</p><h1>Кино — это<br><em>память</em> в движении.</h1><p class="hero-lead">Путешествие по эпохам, которые научили нас видеть больше, чем помещается в одном кадре.</p><a class="text-link" href="#/article/silent">Начать путешествие <span>↗</span></a></div>
      <div class="hero-poster reveal"><div class="poster-image"></div><div class="poster-label"><span>THE</span><strong>SEVENTH<br>SENSE</strong><small>Frames from a century</small></div><span class="poster-year">1895</span></div>
    </section>
    <section class="intro-band"><p class="section-kicker">Три поворотных момента</p><p class="intro-text">От первого мерцания плёнки до цифровых миров — кино каждый раз меняло не только экран, но и нас.</p></section>
    <section class="timeline-preview"><div class="timeline-line"></div>${Object.entries(a).map(([e,t],n)=>`<a class="timeline-card reveal" href="#/article/${e}"><span class="card-index">${String(n+1).padStart(2,`0`)}</span><div><span class="card-year">${t.year}</span><h2>${t.title}</h2><p>${t.subtitle}</p><div class="article-tags">${(t.tags||[]).map(e=>`<span class="tag-chip">${e}</span>`).join(``)}</div><span class="arrow">↗</span></div></a>`).join(``)}</section>
  `)}async function _(){if(!i||i.role!==`admin`){f(`login`);return}try{let[e,t,n]=await Promise.all([c(`/api/admin/articles`,{method:`GET`}),c(`/api/admin/comments`,{method:`GET`}),c(`/api/admin/tags`,{method:`GET`})]);h(`
      <section class="admin-panel">
        <div class="admin-header">
          <p class="eyebrow">Администратор</p>
          <h1>Панель управления</h1>
        </div>

        <div class="admin-sections">
          <div class="admin-card">
            <h2>Добавить статью</h2>
            <form class="admin-form" data-admin-article-form>
              <input name="slug" placeholder="slug (например, silent)" required>
              <input name="section" placeholder="Раздел" required>
              <input name="title" placeholder="Название статьи" required>
              <textarea name="subtitle" placeholder="Короткое описание" required></textarea>
              <input name="year" placeholder="Годы" required>
              <input name="image" placeholder="URL изображения" required>
              <textarea name="fact" placeholder="Факт из архива" required></textarea>
              <textarea name="body" placeholder="Параграфы через новую строку" required></textarea>
              <input name="tags" placeholder="Теги через запятую (например: история, монтаж)">
              <button type="submit">Сохранить статью</button>
            </form>
          </div>

          <div class="admin-card">
            <h2>Теги</h2>
            <form class="admin-form" data-admin-tag-form>
              <input name="tag" placeholder="Название тега" required>
              <button type="submit">Добавить тег</button>
            </form>
            <ul class="admin-list">${(n.tags||[]).map(e=>`<li><span>${e.name}</span><button class="tag-delete-button" type="button" data-delete-tag="${e.id}" aria-label="Удалить тег ${e.name}">×</button></li>`).join(``)}</ul>
          </div>

          <div class="admin-card admin-wide">
            <h2>Теги статей</h2>
            <ul class="admin-articles-list">
              ${(e.articles||[]).map(e=>`
                <li>
                  <div>
                    <strong>${e.title}</strong>
                    <span class="admin-article-tags">${(e.tags||[]).length?(e.tags||[]).map((t,n)=>`<span class="admin-article-tag">${t}<button class="tag-delete-button" type="button" data-delete-article-tag="${e.id}" data-tag-id="${e.tagIds[n]}">×</button></span>`).join(``):`Тегов пока нет`}</span>
                  </div>
                  <form class="admin-form admin-article-edit" data-edit-article-id="${e.id}">
                    <input name="title" value="${e.title}" placeholder="Название статьи" required>
                    <textarea name="body" placeholder="Параграфы через новую строку" required>${(e.body||[]).join(`
`)}</textarea>
                    <button type="submit">Сохранить изменения</button>
                  </form>
                  <form class="admin-tag-attach" data-article-id="${e.id}">
                    <select name="tag" required>
                      <option value="">Выберите тег</option>
                      ${(n.tags||[]).filter(t=>!(e.tags||[]).includes(t.name)).map(e=>`<option value="${e.name}">${e.name}</option>`).join(``)}
                    </select>
                    <button type="submit">Добавить тег</button>
                  </form>
                </li>
              `).join(``)||`<li>Статей из базы пока нет.</li>`}
            </ul>
          </div>

          <div class="admin-card admin-wide">
            <h2>Комментарии</h2>
            <ul class="admin-comments-list">
              ${(t.comments||[]).map(e=>`
                <li>
                  <div>
                    <strong>${e.name}</strong>
                    <span>${e.article_key}</span>
                    <small>${new Date(e.created_at).toLocaleString(`ru-RU`)}</small>
                  </div>
                  <p>${e.text}</p>
                  <button data-delete-comment="${e.id}">Удалить</button>
                </li>
              `).join(``)||`<li>Комментариев нет.</li>`}
            </ul>
          </div>
        </div>
      </section>
    `,`admin`);let r=document.querySelector(`[data-admin-article-form]`);r?.addEventListener(`submit`,async e=>{e.preventDefault();let t=Object.fromEntries(new FormData(r)),n=t.body.split(`
`).map(e=>e.trim()).filter(Boolean);try{await c(`/api/admin/articles`,{method:`POST`,body:JSON.stringify({...t,body:n})}),r.reset(),_()}catch(e){alert(e.message)}});let i=document.querySelector(`[data-admin-tag-form]`);i?.addEventListener(`submit`,async e=>{e.preventDefault();let t=Object.fromEntries(new FormData(i));try{await c(`/api/admin/tags`,{method:`POST`,body:JSON.stringify({name:t.tag})}),i.reset(),_()}catch(e){alert(e.message)}}),document.querySelectorAll(`[data-article-id]`).forEach(e=>{e.addEventListener(`submit`,async t=>{t.preventDefault();let n=new FormData(e).get(`tag`);try{await c(`/api/admin/articles/${e.dataset.articleId}/tags`,{method:`POST`,body:JSON.stringify({tag:n})}),_()}catch(e){alert(e.message)}})}),document.querySelectorAll(`[data-edit-article-id]`).forEach(e=>{e.addEventListener(`submit`,async t=>{t.preventDefault();let n=Object.fromEntries(new FormData(e)),r=n.body.split(`
`).map(e=>e.trim()).filter(Boolean);try{await c(`/api/admin/articles/${e.dataset.editArticleId}`,{method:`PUT`,body:JSON.stringify({title:n.title,body:r})}),_()}catch(e){alert(e.message)}})}),document.querySelectorAll(`[data-delete-article-tag]`).forEach(e=>{e.addEventListener(`click`,async()=>{try{await c(`/api/admin/articles/${e.dataset.deleteArticleTag}/tags/${e.dataset.tagId}`,{method:`DELETE`}),_()}catch(e){alert(e.message)}})}),document.querySelectorAll(`[data-delete-tag]`).forEach(e=>{e.addEventListener(`click`,async()=>{try{await c(`/api/admin/tags/${e.dataset.deleteTag}`,{method:`DELETE`}),_()}catch(e){alert(e.message)}})}),document.querySelectorAll(`[data-delete-comment]`).forEach(e=>{e.addEventListener(`click`,async()=>{let t=e.dataset.deleteComment;try{await c(`/api/admin/comments/${t}`,{method:`DELETE`}),_()}catch(e){alert(e.message)}})})}catch(e){alert(e.message)}}async function v(e){try{let t=await fetch(`/api/comments/${e}`,{credentials:`same-origin`}),n=await t.json();if(!t.ok)throw Error(n.error||`Не удалось загрузить комментарии.`);return n.comments||[]}catch{return[]}}async function y(){let e=document.querySelector(`[data-comments-root]`);if(!e)return;let t=e.dataset.articleKey,n=await v(t),r=!!i;e.innerHTML=`
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
  `;let a=e.querySelector(`[data-comment-form]`);a&&a.addEventListener(`submit`,async e=>{e.preventDefault();let n=a.querySelector(`textarea`),r=a.querySelector(`[data-comment-status]`),i=n.value.trim();if(!i){r.textContent=`Введите текст комментария.`;return}r.textContent=`Отправка...`;try{let e=await fetch(`/api/comments/${t}`,{method:`POST`,headers:{"Content-Type":`application/json`},credentials:`same-origin`,body:JSON.stringify({text:i})}),a=await e.json();if(!e.ok)throw Error(a.error||`Не удалось отправить комментарий.`);n.value=``,r.textContent=`Комментарий добавлен.`,await y()}catch(e){r.textContent=e.message}})}function b(e){let t=a[e]||a.silent;h(`
    <article class="article-page">
      <div class="article-heading reveal"><p class="eyebrow">${t.section}</p><h1>${t.title}</h1><p class="article-subtitle">${t.subtitle}</p><div class="article-tags article-tags-large">${(t.tags||[]).map(e=>`<span class="tag-chip">${e}</span>`).join(``)}</div><div class="article-meta"><span>${t.year}</span><span>Чтение / 04 мин</span></div></div>
      <div class="article-visual reveal"><img src="${t.image}" alt="Кинематографический кадр" /><span class="image-caption">Кадр как свидетель. Фильм как след.</span></div>
      <div class="article-grid"><div class="article-aside"><span class="vertical-label">КИНОСФЕРА / ЗАПИСКИ</span></div><div class="article-body">${t.body.map(e=>`<p>${e}</p>`).join(``)}<aside class="fact"><span class="fact-label">Заметка из архива</span><p>${t.fact}</p></aside><a class="text-link" href="#/">Вернуться к хронике <span>↗</span></a>
      <div class="comments-root" data-comments-root data-article-key="${e}"></div>
      </div></div>
    </article>
  `,e),y()}async function x(){await u(!0);let e=window.location.hash.replace(`#`,``)||`/`;if(e===`/admin`){await _(),window.scrollTo(0,0);return}let t=e.match(/^\/article\/([^/]+)$/);t?b(t[1]):g(),window.scrollTo(0,0)}window.addEventListener(`hashchange`,x),x();