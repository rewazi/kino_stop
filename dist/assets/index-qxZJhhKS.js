(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={silent:{section:`01 / Algused`,title:`Kui kaader õppis hingama`,subtitle:`Tummfilm ei olnud hääletu. Ta rääkis montaaži, žesti ja valgusega — ja lõi grammatika, mida kasutame tänaseni.`,year:`1895—1927`,image:`https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1800&q=85`,tags:[`tummfilm`,`montaaž`,`esimesed kaadrid`],body:[`Lumière’i vendade esimesed seansid olid lühikesed visandid, kuid vaataja nägi neis kohe midagi enamat kui tehnilist atraktsiooni — uut viisi maailma vaadata. Rongi saabumine jaama oli sündmus just seepärast, et see liikus kaadri sees.`,`Peagi läks film kaugemale pelgast jäädvustamisest. Georges Méliès muutis kaamera illusioonide lavaks, D. W. Griffith ja Sergei Eisenstein aga hakkasid emotsiooni kokku panema kaadrite kõrvutamisest. Montaažist sai mitte lihtsalt liitmine, vaid mõte.`],fact:`Lumière’i vendade esimene avalik filmiseanss toimus Pariisis 28. detsembril 1895.`},nouvelle:{section:`02 / Vaate vabadus`,title:`Kaamera läheb tänavale`,subtitle:`Prantsuse uus laine loobus stuudiofilmi siledusest ja tõi filmi tagasi elava vestluse närvi.`,year:`1958—1968`,image:`https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1800&q=85`,tags:[`uus laine`,`Pariis`,`vormi vabadus`],body:[`1950. aastate lõpus said ajakirja Cahiers du Cinéma noortest kriitikutest režissöörid. Jean-Luc Godard, François Truffaut, Agnès Varda ja nende kolleegid filmisid seal, kus oli elu: korterites, kohvikutes, Pariisi tänavatel.`,`Nende filmid lubasid endale eksimusi, vaatasid otse objektiivi ega peitnud montaažiõmblusi. Uus laine tuletas meelde: film võib olla mitte ainult illusioon, vaid ka isiklik sõnavõtt — kerge, julge, ebatäiuslik.`],fact:`Godard’i „Hingeldades“ tegi kuulsaks järsud katked, mida hakati nimetama jump cut’iks.`},blockbuster:{section:`03 / Suur ekraan`,title:`Kuidas suvest sai esilinastus`,subtitle:`Põnevik-hitt muutis kinoskäigu kollektiivseks rituaaliks, turundusest aga sai osa vaatemängust endast.`,year:`1975—1999`,image:`https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1800&q=85`,tags:[`põnevik-hitid`,`kinolevi`,`meediafrantsiisid`],body:[`Steven Spielbergi „Lõuad“ said esimeseks tõeliseks suveblokbasteriks: film vallutas korraga ekraanid, vestlused ja reklaamikanalid. Kaks aastat hiljem tõestas „Tähesõjad“, et universum võib jätkuda ka lõputiitrite järel.`,`Neil kümnenditel õppisid stuudiod mõtlema sündmustena. Poster, treiler, mänguasi, saundtrack ja film ise moodustasid ühtse kultuurikogemuse. Suurest ekraanist sai koht, kuhu tuldi mitte ainult loo, vaid ka mastaabi pärast.`],fact:`Aasta 1975 „Lõuad“ olid esimene film, mis kogus USA kinolevis üle 100 miljoni dollari.`}},t=`
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
  </header>`,n=`
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
  </div>`,r=`login`,i=null,a={...e},o=!1,s=e=>`${new URL(`api/`,window.location.href).pathname}${e}`;async function c(e,t={}){let n=await fetch(e,{headers:{"Content-Type":`application/json`},credentials:`same-origin`,...t}),r=await n.json();if(!n.ok)throw Error(r.error||`Päringu täitmine ebaõnnestus.`);return r}async function l(e,t={}){let n=await fetch(s(e.replace(/\.php$/,``)),{headers:{"Content-Type":`application/json`},credentials:`same-origin`,...t}),r=await n.json();if(!n.ok)throw Error(r.error||`Päringu täitmine ebaõnnestus.`);return r}async function u(e=!1){if(!o||e)try{let e=await c(`/api/articles`),t=Object.fromEntries((e.articles||[]).map(e=>[e.slug,e]));a={...a,...t}}catch{}finally{o=!0}}async function d(t){if(!t)return Object.entries(a);try{let n=(await c(`/api/articles?q=${encodeURIComponent(t)}`)).articles||[],r=new Set(n.map(e=>e.slug)),i=Object.entries(e).filter(([e,n])=>!r.has(e)&&(n.title.toLowerCase().includes(t.toLowerCase())||n.subtitle.toLowerCase().includes(t.toLowerCase())));return[...n.map(e=>[e.slug,e]),...i]}catch{let e=t.toLowerCase();return Object.entries(a).filter(([,t])=>t.title.toLowerCase().includes(e)||t.subtitle.toLowerCase().includes(e))}}function f(e){r=e;let t=document.querySelector(`[data-auth-modal]`);if(!t)return;let n=e===`register`;t.querySelector(`[data-auth-title]`).textContent=n?`Loo konto`:`Sisselogimine`,t.querySelector(`[data-name-field]`).hidden=!n,t.querySelector(`[data-name-field] input`).required=n,t.querySelector(`[data-auth-submit]`).innerHTML=`${n?`Registreeru`:`Logi sisse`} <span>↗</span>`,t.querySelector(`[data-auth-switch]`).textContent=n?`Juba on konto? Logi sisse`:`Pole kontot? Registreeru`,t.querySelector(`[data-auth-error]`).textContent=``}function p(e=`login`){let t=document.querySelector(`[data-auth-modal]`);t&&(f(e),t.hidden=!1,t.querySelector(`input:not([type="hidden"])`).focus())}function m(e){i=e;let t=document.querySelector(`[data-auth-area]`);if(t){let n=e&&e.role===`admin`;t.innerHTML=e?`
        <span class="user-name">${e.name}</span>
        ${n?`<a class="auth-button" href="#/admin" data-admin-panel>Admin</a>`:``}
        <button class="auth-button" data-auth-logout>Logi välja</button>
      `:`<button class="auth-button" data-auth="login">Logi sisse</button><button class="auth-button auth-button-primary" data-auth="register">Registreeru</button>`,t.querySelectorAll(`[data-auth]`).forEach(e=>e.addEventListener(`click`,()=>p(e.dataset.auth))),t.querySelector(`[data-auth-logout]`)?.addEventListener(`click`,async()=>{try{await l(`logout`,{method:`POST`,body:`{}`}),m(null)}catch{m(null)}}),t.querySelector(`[data-admin-panel]`)?.addEventListener(`click`,e=>{e.preventDefault(),window.location.hash=`#/admin`})}document.querySelector(`[data-comments-root]`)&&x()}function h(){document.querySelectorAll(`[data-auth]`).forEach(e=>e.addEventListener(`click`,()=>p(e.dataset.auth)));let e=document.querySelector(`[data-auth-modal]`);e.querySelector(`[data-auth-close]`).addEventListener(`click`,()=>{e.hidden=!0}),e.addEventListener(`click`,t=>{t.target===e&&(e.hidden=!0)}),e.querySelector(`[data-auth-switch]`).addEventListener(`click`,()=>f(r===`login`?`register`:`login`)),e.querySelector(`[data-auth-form]`).addEventListener(`submit`,async t=>{t.preventDefault();let n=t.currentTarget,i=e.querySelector(`[data-auth-submit]`),a=e.querySelector(`[data-auth-error]`);i.disabled=!0,a.textContent=``;try{let t=Object.fromEntries(new FormData(n)),i=await l(r===`login`?`login`:`register`,{method:`POST`,body:JSON.stringify(t)});e.hidden=!0,n.reset(),m(i.user)}catch(e){a.textContent=e.message}finally{i.disabled=!1}}),l(`me`).then(({user:e})=>m(e)).catch(()=>m(null))}function g(e,r=`home`){document.querySelector(`#app`).innerHTML=`${t}<main>${e}</main><footer><span>FILMISFÄÄR / 001</span><span>Kino ajalugu on pilgu ajalugu</span></footer>${n}`,document.querySelectorAll(`[data-route]`).forEach(e=>e.classList.toggle(`active`,e.dataset.route===r)),h()}function _(){g(`
    <section class="hero">
      <div class="hero-copy reveal"><p class="eyebrow">Visuaalne ajalugu / 1895–tänapäevani</p><h1>Film on<br><em>mälu</em> liikumises.</h1><p class="hero-lead">Teekond ajastute vahel, mis õpetasid meid nägema rohkem, kui mahub ühte kaadrisse.</p><a class="text-link" href="#/article/silent">Alusta teekonda <span>↗</span></a></div>
      <div class="hero-poster reveal"><div class="poster-image"></div><div class="poster-label"><span>THE</span><strong>SEVENTH<br>SENSE</strong><small>Frames from a century</small></div><span class="poster-year">1895</span></div>
    </section>
    <section class="intro-band"><p class="section-kicker">Kolm pöördelist hetke</p><p class="intro-text">Esimesest filmilindi virvendusest digitaalsete maailmadeni — kino on iga kord muutnud mitte ainult ekraani, vaid ka meid.</p></section>
    <section class="timeline-preview"><div class="timeline-line"></div>${Object.entries(a).map(([e,t],n)=>`<a class="timeline-card reveal" href="#/article/${e}"><span class="card-index">${String(n+1).padStart(2,`0`)}</span><div><span class="card-year">${t.year}</span><h2>${t.title}</h2><p>${t.subtitle}</p><div class="article-tags">${(t.tags||[]).map(e=>`<span class="tag-chip">${e}</span>`).join(``)}</div><span class="arrow">↗</span></div></a>`).join(``)}</section>
  `)}function v(){g(`
    <section class="tags-page">
      <div class="tags-page-header reveal">
        <p class="eyebrow">Liikumine arhiivis</p>
        <h1>Leia artikkel<br><em>sildi järgi.</em></h1>
        <p>Vali teema, et jätta lehele ainult sellega seotud materjalid.</p>
      </div>
      <input class="tag-search" type="search" data-tag-search placeholder="Otsi märksõna järgi...">
      <div class="tag-filter-list" data-tag-filters>
        <button class="tag-filter active" type="button" data-tag-filter="">Kõik artiklid</button>
        ${[...new Set(Object.values(a).flatMap(e=>e.tags||[]))].sort((e,t)=>e.localeCompare(t,`et`)).map(e=>`<button class="tag-filter" type="button" data-tag-filter="${e}">${e}</button>`).join(``)}
      </div>
      <div class="tag-results" data-tag-results></div>
    </section>
  `,`tags`);let e=document.querySelector(`[data-tag-results]`),t=document.querySelectorAll(`[data-tag-filter]`),n=document.querySelector(`[data-tag-search]`),r=t=>{e.innerHTML=t.length?t.map(([e,t])=>`<a class="tag-result reveal" href="#/article/${e}"><span class="card-year">${t.year}</span><h2>${t.title}</h2><p>${t.subtitle}</p><div class="article-tags">${(t.tags||[]).map(e=>`<span class="tag-chip">${e}</span>`).join(``)}</div><span class="arrow">↗</span></a>`).join(``):`<p class="tag-empty">Selle sildiga (või otsingusõnaga) artikleid veel ei ole.</p>`},i=(e=``)=>{let t=Object.entries(a).filter(([,t])=>!e||(t.tags||[]).includes(e));r(t)};t.forEach(e=>{e.addEventListener(`click`,()=>{t.forEach(t=>t.classList.toggle(`active`,t===e)),n.value=``,i(e.dataset.tagFilter)})});let o;n.addEventListener(`input`,()=>{clearTimeout(o),o=setTimeout(async()=>{let e=n.value.trim();if(!e)return i(``);t.forEach(e=>e.classList.remove(`active`)),r(await d(e))},250)}),i()}async function y(){if(!i||i.role!==`admin`){p(`login`);return}try{let[e,t,n]=await Promise.all([c(`/api/admin/articles`,{method:`GET`}),c(`/api/admin/comments`,{method:`GET`}),c(`/api/admin/tags`,{method:`GET`})]);g(`
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
            <ul class="admin-list">${(n.tags||[]).map(e=>`<li><span>${e.name}</span><button class="tag-delete-button" type="button" data-delete-tag="${e.id}" aria-label="Kustuta silt ${e.name}">×</button></li>`).join(``)}</ul>
          </div>

          <div class="admin-card admin-wide">
            <h2>Artiklite sildid</h2>
            <ul class="admin-articles-list">
              ${(e.articles||[]).map(e=>`
                <li>
                  <div>
                    <strong>${e.title}</strong>
                    <span class="admin-article-tags">${(e.tags||[]).length?(e.tags||[]).map((t,n)=>`<span class="admin-article-tag">${t}<button class="tag-delete-button" type="button" data-delete-article-tag="${e.id}" data-tag-id="${e.tagIds[n]}">×</button></span>`).join(``):`Silte pole veel`}</span>
                  </div>
                  <form class="admin-form admin-article-edit" data-edit-article-id="${e.id}">
                    <input name="title" value="${e.title}" placeholder="Artikli pealkiri" required>
                    <textarea name="body" placeholder="Lõigud, iga uuel real" required>${(e.body||[]).join(`
`)}</textarea>
                    <textarea name="fact" placeholder="Märkus arhiivist" required>${e.fact||``}</textarea>
                    <button type="submit">Salvesta muudatused</button>
                  </form>
                  <form class="admin-tag-attach" data-article-id="${e.id}">
                    <select name="tag" required>
                      <option value="">Vali silt</option>
                      ${(n.tags||[]).filter(t=>!(e.tags||[]).includes(t.name)).map(e=>`<option value="${e.name}">${e.name}</option>`).join(``)}
                    </select>
                    <button type="submit">Lisa silt</button>
                  </form>
                </li>
              `).join(``)||`<li>Andmebaasis pole veel artikleid.</li>`}
            </ul>
          </div>

          <div class="admin-card admin-wide">
            <h2>Kommentaarid</h2>
            <ul class="admin-comments-list">
              ${(t.comments||[]).map(e=>`
                <li>
                  <div>
                    <strong>${e.name}</strong>
                    <span>${e.article_key}</span>
                    <small>${new Date(e.created_at).toLocaleString(`et-EE`)}</small>
                  </div>
                  <p>${e.text}</p>
                  <button data-delete-comment="${e.id}">Kustuta</button>
                </li>
              `).join(``)||`<li>Kommentaare pole.</li>`}
            </ul>
          </div>
        </div>
      </section>
    `,`admin`);let r=document.querySelector(`[data-admin-article-form]`);r?.addEventListener(`submit`,async e=>{e.preventDefault();let t=Object.fromEntries(new FormData(r)),n=t.body.split(`
`).map(e=>e.trim()).filter(Boolean);try{await c(`/api/admin/articles`,{method:`POST`,body:JSON.stringify({...t,body:n})}),r.reset(),y()}catch(e){alert(e.message)}});let i=document.querySelector(`[data-admin-tag-form]`);i?.addEventListener(`submit`,async e=>{e.preventDefault();let t=Object.fromEntries(new FormData(i));try{await c(`/api/admin/tags`,{method:`POST`,body:JSON.stringify({name:t.tag})}),i.reset(),y()}catch(e){alert(e.message)}}),document.querySelectorAll(`[data-article-id]`).forEach(e=>{e.addEventListener(`submit`,async t=>{t.preventDefault();let n=new FormData(e).get(`tag`);try{await c(`/api/admin/articles/${e.dataset.articleId}/tags`,{method:`POST`,body:JSON.stringify({tag:n})}),y()}catch(e){alert(e.message)}})}),document.querySelectorAll(`[data-edit-article-id]`).forEach(e=>{e.addEventListener(`submit`,async t=>{t.preventDefault();let n=Object.fromEntries(new FormData(e)),r=n.body.split(`
`).map(e=>e.trim()).filter(Boolean);try{await c(`/api/admin/articles/${e.dataset.editArticleId}`,{method:`PUT`,body:JSON.stringify({title:n.title,body:r,fact:n.fact})}),y()}catch(e){alert(e.message)}})}),document.querySelectorAll(`[data-delete-article-tag]`).forEach(e=>{e.addEventListener(`click`,async()=>{try{await c(`/api/admin/articles/${e.dataset.deleteArticleTag}/tags/${e.dataset.tagId}`,{method:`DELETE`}),y()}catch(e){alert(e.message)}})}),document.querySelectorAll(`[data-delete-tag]`).forEach(e=>{e.addEventListener(`click`,async()=>{try{await c(`/api/admin/tags/${e.dataset.deleteTag}`,{method:`DELETE`}),y()}catch(e){alert(e.message)}})}),document.querySelectorAll(`[data-delete-comment]`).forEach(e=>{e.addEventListener(`click`,async()=>{let t=e.dataset.deleteComment;try{await c(`/api/admin/comments/${t}`,{method:`DELETE`}),y()}catch(e){alert(e.message)}})})}catch(e){alert(e.message)}}async function b(e){try{let t=await fetch(`/api/comments/${e}`,{credentials:`same-origin`}),n=await t.json();if(!t.ok)throw Error(n.error||`Kommentaaride laadimine ebaõnnestus.`);return n.comments||[]}catch{return[]}}async function x(){let e=document.querySelector(`[data-comments-root]`);if(!e)return;let t=e.dataset.articleKey,n=await b(t),r=!!i;e.innerHTML=`
    <div class="comments-block">
      <div class="comments-header">
        <p class="eyebrow">Kommentaarid</p>
        <span>${n.length} ${n.length===1?`kommentaar`:`kommentaari`}</span>
      </div>
      ${r?`
        <form class="comment-form" data-comment-form>
          <textarea name="text" maxlength="500" rows="4" placeholder="Kirjutage kommentaar..." required></textarea>
          <div class="comment-actions">
            <span class="comment-status" data-comment-status></span>
            <button type="submit">Saada</button>
          </div>
        </form>
      `:`
        <div class="comment-login-prompt">Ainult registreeritud kasutajad saavad kommenteerida.</div>
      `}
      <div class="comments-list">
        ${n.length?n.map(e=>{let t=i&&e.user_id===i.id;return`
            <article class="comment-item" data-comment-id="${e.id}">
              <div class="comment-meta"><strong>${e.name}</strong><time>${new Date(e.created_at).toLocaleString(`et-EE`,{dateStyle:`short`,timeStyle:`short`})}</time></div>
              <p data-comment-text>${e.text}</p>
              ${t?`
                <div class="comment-own-actions">
                  <button type="button" data-comment-edit>Muuda</button>
                  <button type="button" data-comment-delete>Kustuta</button>
                </div>
              `:``}
            </article>
          `}).join(``):`<div class="comment-empty">Kommentaare pole veel. Ole esimene.</div>`}
      </div>
    </div>
  `;let a=e.querySelector(`[data-comment-form]`);a?.addEventListener(`submit`,async e=>{e.preventDefault();let n=a.querySelector(`textarea`),r=a.querySelector(`[data-comment-status]`),i=n.value.trim();if(!i){r.textContent=`Sisestage kommentaari tekst.`;return}r.textContent=`Saatmine...`;try{let e=await fetch(`/api/comments/${t}`,{method:`POST`,headers:{"Content-Type":`application/json`},credentials:`same-origin`,body:JSON.stringify({text:i})}),a=await e.json();if(!e.ok)throw Error(a.error||`Kommentaari saatmine ebaõnnestus.`);n.value=``,r.textContent=`Kommentaar on lisatud.`,await x()}catch(e){r.textContent=e.message}}),e.querySelectorAll(`[data-comment-edit]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.closest(`[data-comment-id]`),n=t.querySelector(`[data-comment-text]`);n.outerHTML=`
        <form class="comment-edit-form" data-comment-edit-form>
          <textarea maxlength="500" rows="3" required>${n.textContent}</textarea>
          <div class="comment-actions">
            <button type="submit">Salvesta</button>
            <button type="button" data-comment-cancel-edit>Loobu</button>
          </div>
        </form>
      `;let r=t.querySelector(`[data-comment-edit-form]`);r.querySelector(`[data-comment-cancel-edit]`).addEventListener(`click`,()=>x()),r.addEventListener(`submit`,async e=>{e.preventDefault();let n=r.querySelector(`textarea`).value.trim();try{await c(`/api/comments/entry/${t.dataset.commentId}`,{method:`PUT`,body:JSON.stringify({text:n})}),await x()}catch(e){alert(e.message)}})})}),e.querySelectorAll(`[data-comment-delete]`).forEach(e=>{e.addEventListener(`click`,async()=>{let t=e.closest(`[data-comment-id]`);if(window.confirm(`Kustutada see kommentaar?`))try{await c(`/api/comments/entry/${t.dataset.commentId}`,{method:`DELETE`}),await x()}catch(e){alert(e.message)}})})}function S(e){let t=a[e]||a.silent;g(`
    <article class="article-page">
      <div class="article-heading reveal"><p class="eyebrow">${t.section}</p><h1>${t.title}</h1><p class="article-subtitle">${t.subtitle}</p><div class="article-tags article-tags-large">${(t.tags||[]).map(e=>`<span class="tag-chip">${e}</span>`).join(``)}</div><div class="article-meta"><span>${t.year}</span><span>Lugemine / 04 min</span></div></div>
      <div class="article-visual reveal"><img src="${t.image}" alt="Filmikaader" /><span class="image-caption">Kaader kui tunnistaja. Film kui jälg.</span></div>
      <div class="article-grid"><div class="article-aside"><span class="vertical-label">FILMISFÄÄR / MÄRKMED</span></div><div class="article-body">${t.body.map(e=>`<p>${e}</p>`).join(``)}<aside class="fact"><span class="fact-label">Märkus arhiivist</span><p>${t.fact}</p></aside><a class="text-link" href="#/">Tagasi ajajoone juurde <span>↗</span></a>
      <div class="comments-root" data-comments-root data-article-key="${e}"></div>
      </div></div>
    </article>
  `,e),x()}async function C(){await u(!0);let e=window.location.hash.replace(`#`,``)||`/`;if(e===`/admin`){await y(),window.scrollTo(0,0);return}if(e===`/tags`){v(),window.scrollTo(0,0);return}let t=e.match(/^\/article\/([^/]+)$/);t?S(t[1]):_(),window.scrollTo(0,0)}window.addEventListener(`hashchange`,C),C();