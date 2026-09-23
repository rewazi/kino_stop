(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(e){return e==null?``:String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`)}var t={silent:{section:`01 / Algused`,title:`Kui kaader õppis hingama`,subtitle:`Tummfilm ei olnud hääletu. Ta rääkis montaaži, žesti ja valgusega — ja lõi grammatika, mida kasutame tänaseni.`,year:`1895—1927`,image:`https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1800&q=85`,tags:[`tummfilm`,`montaaž`,`esimesed kaadrid`],body:[`Lumière’i vendade esimesed seansid olid lühikesed visandid, kuid vaataja nägi neis kohe midagi enamat kui tehnilist atraktsiooni — uut viisi maailma vaadata. Rongi saabumine jaama oli sündmus just seepärast, et see liikus kaadri sees.`,`Peagi läks film kaugemale pelgast jäädvustamisest. Georges Méliès muutis kaamera illusioonide lavaks, D. W. Griffith ja Sergei Eisenstein aga hakkasid emotsiooni kokku panema kaadrite kõrvutamisest. Montaažist sai mitte lihtsalt liitmine, vaid mõte.`],fact:`Lumière’i vendade esimene avalik filmiseanss toimus Pariisis 28. detsembril 1895.`},nouvelle:{section:`02 / Vaate vabadus`,title:`Kaamera läheb tänavale`,subtitle:`Prantsuse uus laine loobus stuudiofilmi siledusest ja tõi filmi tagasi elava vestluse närvi.`,year:`1958—1968`,image:`https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1800&q=85`,tags:[`uus laine`,`Pariis`,`vormi vabadus`],body:[`1950. aastate lõpus said ajakirja Cahiers du Cinéma noortest kriitikutest režissöörid. Jean-Luc Godard, François Truffaut, Agnès Varda ja nende kolleegid filmisid seal, kus oli elu: korterites, kohvikutes, Pariisi tänavatel.`,`Nende filmid lubasid endale eksimusi, vaatasid otse objektiivi ega peitnud montaažiõmblusi. Uus laine tuletas meelde: film võib olla mitte ainult illusioon, vaid ka isiklik sõnavõtt — kerge, julge, ebatäiuslik.`],fact:`Godard’i „Hingeldades“ tegi kuulsaks järsud katked, mida hakati nimetama jump cut’iks.`},blockbuster:{section:`03 / Suur ekraan`,title:`Kuidas suvest sai esilinastus`,subtitle:`Põnevik-hitt muutis kinoskäigu kollektiivseks rituaaliks, turundusest aga sai osa vaatemängust endast.`,year:`1975—1999`,image:`https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1800&q=85`,tags:[`põnevik-hitid`,`kinolevi`,`meediafrantsiisid`],body:[`Steven Spielbergi „Lõuad“ said esimeseks tõeliseks suveblokbasteriks: film vallutas korraga ekraanid, vestlused ja reklaamikanalid. Kaks aastat hiljem tõestas „Tähesõjad“, et universum võib jätkuda ka lõputiitrite järel.`,`Neil kümnenditel õppisid stuudiod mõtlema sündmustena. Poster, treiler, mänguasi, saundtrack ja film ise moodustasid ühtse kultuurikogemuse. Suurest ekraanist sai koht, kuhu tuldi mitte ainult loo, vaid ka mastaabi pärast.`],fact:`Aasta 1975 „Lõuad“ olid esimene film, mis kogus USA kinolevis üle 100 miljoni dollari.`}},n=`
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
  </header>`,r=`
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
  </div>`,i=`login`,a=null,o={...t},s=!1,c=e=>`${new URL(`api/`,window.location.href).pathname}${e}`;async function l(e,t={}){let n=await fetch(e,{headers:{"Content-Type":`application/json`},credentials:`same-origin`,...t}),r=await n.json();if(!n.ok)throw Error(r.error||`Päringu täitmine ebaõnnestus.`);return r}async function u(e,t={}){let n=await fetch(c(e.replace(/\.php$/,``)),{headers:{"Content-Type":`application/json`},credentials:`same-origin`,...t}),r=await n.json();if(!n.ok)throw Error(r.error||`Päringu täitmine ebaõnnestus.`);return r}async function d(e=!1){if(!s||e)try{let e=await l(`/api/articles`),t=Object.fromEntries((e.articles||[]).map(e=>[e.slug,e]));o={...o,...t}}catch{}finally{s=!0}}async function f(e){if(!e)return Object.entries(o);try{let n=(await l(`/api/articles?q=${encodeURIComponent(e)}`)).articles||[],r=new Set(n.map(e=>e.slug)),i=Object.entries(t).filter(([t,n])=>!r.has(t)&&(n.title.toLowerCase().includes(e.toLowerCase())||n.subtitle.toLowerCase().includes(e.toLowerCase())));return[...n.map(e=>[e.slug,e]),...i]}catch{let t=e.toLowerCase();return Object.entries(o).filter(([,e])=>e.title.toLowerCase().includes(t)||e.subtitle.toLowerCase().includes(t))}}function p(e){i=e;let t=document.querySelector(`[data-auth-modal]`);if(!t)return;let n=e===`register`;t.querySelector(`[data-auth-title]`).textContent=n?`Loo konto`:`Sisselogimine`,t.querySelector(`[data-name-field]`).hidden=!n,t.querySelector(`[data-name-field] input`).required=n,t.querySelector(`[data-auth-submit]`).innerHTML=`${n?`Registreeru`:`Logi sisse`} <span>↗</span>`,t.querySelector(`[data-auth-switch]`).textContent=n?`Juba on konto? Logi sisse`:`Pole kontot? Registreeru`,t.querySelector(`[data-auth-error]`).textContent=``}function m(e=`login`){let t=document.querySelector(`[data-auth-modal]`);t&&(p(e),t.hidden=!1,t.querySelector(`input:not([type="hidden"])`).focus())}function h(t){a=t;let n=document.querySelector(`[data-auth-area]`);if(n){let r=t&&t.role===`admin`;n.innerHTML=t?`
        <span class="user-name">${e(t.name)}</span>
        ${r?`<a class="auth-button" href="#/admin" data-admin-panel>Admin</a>`:``}
        <button class="auth-button" data-auth-logout>Logi välja</button>
      `:`<button class="auth-button" data-auth="login">Logi sisse</button><button class="auth-button auth-button-primary" data-auth="register">Registreeru</button>`,n.querySelectorAll(`[data-auth]`).forEach(e=>e.addEventListener(`click`,()=>m(e.dataset.auth))),n.querySelector(`[data-auth-logout]`)?.addEventListener(`click`,async()=>{try{await u(`logout`,{method:`POST`,body:`{}`}),h(null)}catch{h(null)}}),n.querySelector(`[data-admin-panel]`)?.addEventListener(`click`,e=>{e.preventDefault(),window.location.hash=`#/admin`})}document.querySelector(`[data-comments-root]`)&&S()}function g(){document.querySelectorAll(`[data-auth]`).forEach(e=>e.addEventListener(`click`,()=>m(e.dataset.auth)));let e=document.querySelector(`[data-auth-modal]`);e.querySelector(`[data-auth-close]`).addEventListener(`click`,()=>{e.hidden=!0}),e.addEventListener(`click`,t=>{t.target===e&&(e.hidden=!0)}),e.querySelector(`[data-auth-switch]`).addEventListener(`click`,()=>p(i===`login`?`register`:`login`)),e.querySelector(`[data-auth-form]`).addEventListener(`submit`,async t=>{t.preventDefault();let n=t.currentTarget,r=e.querySelector(`[data-auth-submit]`),a=e.querySelector(`[data-auth-error]`);r.disabled=!0,a.textContent=``;try{let t=Object.fromEntries(new FormData(n)),r=await u(i===`login`?`login`:`register`,{method:`POST`,body:JSON.stringify(t)});e.hidden=!0,n.reset(),h(r.user)}catch(e){a.textContent=e.message}finally{r.disabled=!1}}),u(`me`).then(({user:e})=>h(e)).catch(()=>h(null))}function _(e,t=`home`){document.querySelector(`#app`).innerHTML=`${n}<main>${e}</main><footer><span>FILMISFÄÄR / 001</span><span>Kino ajalugu on pilgu ajalugu</span></footer>${r}`,document.querySelectorAll(`[data-route]`).forEach(e=>e.classList.toggle(`active`,e.dataset.route===t)),g()}function v(){_(`
    <section class="hero">
      <div class="hero-copy reveal"><p class="eyebrow">Visuaalne ajalugu / 1895–tänapäevani</p><h1>Film on<br><em>mälu</em> liikumises.</h1><p class="hero-lead">Teekond ajastute vahel, mis õpetasid meid nägema rohkem, kui mahub ühte kaadrisse.</p><a class="text-link" href="#/article/silent">Alusta teekonda <span>↗</span></a></div>
      <div class="hero-poster reveal"><div class="poster-image"></div><div class="poster-label"><span>THE</span><strong>SEVENTH<br>SENSE</strong><small>Frames from a century</small></div><span class="poster-year">1895</span></div>
    </section>
    <section class="intro-band"><p class="section-kicker">Kolm pöördelist hetke</p><p class="intro-text">Esimesest filmilindi virvendusest digitaalsete maailmadeni — kino on iga kord muutnud mitte ainult ekraani, vaid ka meid.</p></section>
    <section class="timeline-preview"><div class="timeline-line"></div>${Object.entries(o).map(([t,n],r)=>`<a class="timeline-card reveal" href="#/article/${t}"><span class="card-index">${String(r+1).padStart(2,`0`)}</span><div><span class="card-year">${e(n.year)}</span><h2>${e(n.title)}</h2><p>${e(n.subtitle)}</p><div class="article-tags">${(n.tags||[]).map(t=>`<span class="tag-chip">${e(t)}</span>`).join(``)}</div><span class="arrow">↗</span></div></a>`).join(``)}</section>
  `)}function y(){_(`
    <section class="tags-page">
      <div class="tags-page-header reveal">
        <p class="eyebrow">Liikumine arhiivis</p>
        <h1>Leia artikkel<br><em>sildi järgi.</em></h1>
        <p>Vali teema, et jätta lehele ainult sellega seotud materjalid.</p>
      </div>
      <input class="tag-search" type="search" data-tag-search placeholder="Otsi märksõna järgi...">
      <div class="tag-filter-list" data-tag-filters>
        <button class="tag-filter active" type="button" data-tag-filter="">Kõik artiklid</button>
        ${[...new Set(Object.values(o).flatMap(e=>e.tags||[]))].sort((e,t)=>e.localeCompare(t,`et`)).map(t=>`<button class="tag-filter" type="button" data-tag-filter="${e(t)}">${e(t)}</button>`).join(``)}
      </div>
      <div class="tag-results" data-tag-results></div>
    </section>
  `,`tags`);let t=document.querySelector(`[data-tag-results]`),n=document.querySelectorAll(`[data-tag-filter]`),r=document.querySelector(`[data-tag-search]`),i=n=>{t.innerHTML=n.length?n.map(([t,n])=>`<a class="tag-result reveal" href="#/article/${t}"><span class="card-year">${e(n.year)}</span><h2>${e(n.title)}</h2><p>${e(n.subtitle)}</p><div class="article-tags">${(n.tags||[]).map(t=>`<span class="tag-chip">${e(t)}</span>`).join(``)}</div><span class="arrow">↗</span></a>`).join(``):`<p class="tag-empty">Selle sildiga (või otsingusõnaga) artikleid veel ei ole.</p>`},a=(e=``)=>{let t=Object.entries(o).filter(([,t])=>!e||(t.tags||[]).includes(e));i(t)};n.forEach(e=>{e.addEventListener(`click`,()=>{n.forEach(t=>t.classList.toggle(`active`,t===e)),r.value=``,a(e.dataset.tagFilter)})});let s;r.addEventListener(`input`,()=>{clearTimeout(s),s=setTimeout(async()=>{let e=r.value.trim();if(!e)return a(``);n.forEach(e=>e.classList.remove(`active`)),i(await f(e))},250)}),a()}async function b(){if(!a||a.role!==`admin`){m(`login`);return}try{let[t,n,r]=await Promise.all([l(`/api/admin/articles`,{method:`GET`}),l(`/api/admin/comments`,{method:`GET`}),l(`/api/admin/tags`,{method:`GET`})]);_(`
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
            <ul class="admin-list">${(r.tags||[]).map(e=>`<li><span>${e.name}</span><button class="tag-delete-button" type="button" data-delete-tag="${e.id}" aria-label="Kustuta silt ${e.name}">×</button></li>`).join(``)}</ul>
          </div>

          <div class="admin-card admin-wide">
            <h2>Artiklite sildid</h2>
            <ul class="admin-articles-list">
              ${(t.articles||[]).map(e=>`
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
                      ${(r.tags||[]).filter(t=>!(e.tags||[]).includes(t.name)).map(e=>`<option value="${e.name}">${e.name}</option>`).join(``)}
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
              ${(n.comments||[]).map(t=>`
                <li>
                  <div>
                    <strong>${e(t.name)}</strong>
                    <span>${e(t.article_key)}</span>
                    <small>${new Date(t.created_at).toLocaleString(`et-EE`)}</small>
                  </div>
                  <p>${e(t.text)}</p>
                  <button data-delete-comment="${e(t.id)}">Kustuta</button>
                </li>
              `).join(``)||`<li>Kommentaare pole.</li>`}
            </ul>
          </div>
        </div>
      </section>
    `,`admin`);let i=document.querySelector(`[data-admin-article-form]`);i?.addEventListener(`submit`,async e=>{e.preventDefault();let t=Object.fromEntries(new FormData(i)),n=t.body.split(`
`).map(e=>e.trim()).filter(Boolean);try{await l(`/api/admin/articles`,{method:`POST`,body:JSON.stringify({...t,body:n})}),i.reset(),b()}catch(e){alert(e.message)}});let a=document.querySelector(`[data-admin-tag-form]`);a?.addEventListener(`submit`,async e=>{e.preventDefault();let t=Object.fromEntries(new FormData(a));try{await l(`/api/admin/tags`,{method:`POST`,body:JSON.stringify({name:t.tag})}),a.reset(),b()}catch(e){alert(e.message)}}),document.querySelectorAll(`[data-article-id]`).forEach(e=>{e.addEventListener(`submit`,async t=>{t.preventDefault();let n=new FormData(e).get(`tag`);try{await l(`/api/admin/articles/${e.dataset.articleId}/tags`,{method:`POST`,body:JSON.stringify({tag:n})}),b()}catch(e){alert(e.message)}})}),document.querySelectorAll(`[data-edit-article-id]`).forEach(e=>{e.addEventListener(`submit`,async t=>{t.preventDefault();let n=Object.fromEntries(new FormData(e)),r=n.body.split(`
`).map(e=>e.trim()).filter(Boolean);try{await l(`/api/admin/articles/${e.dataset.editArticleId}`,{method:`PUT`,body:JSON.stringify({title:n.title,body:r,fact:n.fact})}),b()}catch(e){alert(e.message)}})}),document.querySelectorAll(`[data-delete-article-tag]`).forEach(e=>{e.addEventListener(`click`,async()=>{try{await l(`/api/admin/articles/${e.dataset.deleteArticleTag}/tags/${e.dataset.tagId}`,{method:`DELETE`}),b()}catch(e){alert(e.message)}})}),document.querySelectorAll(`[data-delete-tag]`).forEach(e=>{e.addEventListener(`click`,async()=>{try{await l(`/api/admin/tags/${e.dataset.deleteTag}`,{method:`DELETE`}),b()}catch(e){alert(e.message)}})}),document.querySelectorAll(`[data-delete-comment]`).forEach(e=>{e.addEventListener(`click`,async()=>{let t=e.dataset.deleteComment;try{await l(`/api/admin/comments/${t}`,{method:`DELETE`}),b()}catch(e){alert(e.message)}})})}catch(e){alert(e.message)}}async function x(e){try{let t=await fetch(`/api/comments/${e}`,{credentials:`same-origin`}),n=await t.json();if(!t.ok)throw Error(n.error||`Kommentaaride laadimine ebaõnnestus.`);return n.comments||[]}catch{return[]}}async function S(){let t=document.querySelector(`[data-comments-root]`);if(!t)return;let n=t.dataset.articleKey,r=await x(n),i=!!a;t.innerHTML=`
    <div class="comments-block">
      <div class="comments-header">
        <p class="eyebrow">Kommentaarid</p>
        <span>${r.length} ${r.length===1?`kommentaar`:`kommentaari`}</span>
      </div>
      ${i?`
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
        ${r.length?r.map(t=>{let n=a&&t.user_id===a.id;return`
            <article class="comment-item" data-comment-id="${t.id}">
              <div class="comment-meta"><strong>${e(t.name)}</strong><time>${new Date(t.created_at).toLocaleString(`et-EE`,{dateStyle:`short`,timeStyle:`short`})}</time></div>
              <p data-comment-text>${e(t.text)}</p>
              ${n?`
                <div class="comment-own-actions">
                  <button type="button" data-comment-edit>Muuda</button>
                  <button type="button" data-comment-delete>Kustuta</button>
                </div>
              `:``}
            </article>
          `}).join(``):`<div class="comment-empty">Kommentaare pole veel. Ole esimene.</div>`}
      </div>
    </div>
  `;let o=t.querySelector(`[data-comment-form]`);o?.addEventListener(`submit`,async e=>{e.preventDefault();let t=o.querySelector(`textarea`),r=o.querySelector(`[data-comment-status]`),i=t.value.trim();if(!i){r.textContent=`Sisestage kommentaari tekst.`;return}r.textContent=`Saatmine...`;try{let e=await fetch(`/api/comments/${n}`,{method:`POST`,headers:{"Content-Type":`application/json`},credentials:`same-origin`,body:JSON.stringify({text:i})}),a=await e.json();if(!e.ok)throw Error(a.error||`Kommentaari saatmine ebaõnnestus.`);t.value=``,r.textContent=`Kommentaar on lisatud.`,await S()}catch(e){r.textContent=e.message}}),t.querySelectorAll(`[data-comment-edit]`).forEach(t=>{t.addEventListener(`click`,()=>{let n=t.closest(`[data-comment-id]`),r=n.querySelector(`[data-comment-text]`),i=r.textContent;r.outerHTML=`
        <form class="comment-edit-form" data-comment-edit-form>
          <textarea maxlength="500" rows="3" required>${e(i)}</textarea>
          <div class="comment-actions">
            <button type="submit">Salvesta</button>
            <button type="button" data-comment-cancel-edit>Loobu</button>
          </div>
        </form>
      `;let a=n.querySelector(`[data-comment-edit-form]`);a.querySelector(`[data-comment-cancel-edit]`).addEventListener(`click`,()=>S()),a.addEventListener(`submit`,async e=>{e.preventDefault();let t=a.querySelector(`textarea`).value.trim();try{await l(`/api/comments/entry/${n.dataset.commentId}`,{method:`PUT`,body:JSON.stringify({text:t})}),await S()}catch(e){alert(e.message)}})})}),t.querySelectorAll(`[data-comment-delete]`).forEach(e=>{e.addEventListener(`click`,async()=>{let t=e.closest(`[data-comment-id]`);if(window.confirm(`Kustutada see kommentaar?`))try{await l(`/api/comments/entry/${t.dataset.commentId}`,{method:`DELETE`}),await S()}catch(e){alert(e.message)}})})}function C(t){let n=o[t]||o.silent;_(`
    <article class="article-page">
      <div class="article-heading reveal"><p class="eyebrow">${e(n.section)}</p><h1>${e(n.title)}</h1><p class="article-subtitle">${e(n.subtitle)}</p><div class="article-tags article-tags-large">${(n.tags||[]).map(t=>`<span class="tag-chip">${e(t)}</span>`).join(``)}</div><div class="article-meta"><span>${e(n.year)}</span><span>Lugemine / 04 min</span></div></div>
      <div class="article-visual reveal"><img src="${e(n.image)}" alt="Filmikaader" /><span class="image-caption">Kaader kui tunnistaja. Film kui jälg.</span></div>
      <div class="article-grid"><div class="article-aside"><span class="vertical-label">FILMISFÄÄR / MÄRKMED</span></div><div class="article-body">${n.body.map(t=>`<p>${e(t)}</p>`).join(``)}<aside class="fact"><span class="fact-label">Märkus arhiivist</span><p>${e(n.fact)}</p></aside><a class="text-link" href="#/">Tagasi ajajoone juurde <span>↗</span></a>
      <div class="comments-root" data-comments-root data-article-key="${t}"></div>
      </div></div>
    </article>
  `,t),S()}async function w(){await d(!0);let e=window.location.hash.replace(`#`,``)||`/`;if(e===`/admin`){await b(),window.scrollTo(0,0);return}if(e===`/tags`){y(),window.scrollTo(0,0);return}let t=e.match(/^\/article\/([^/]+)$/);t?C(t[1]):v(),window.scrollTo(0,0)}window.addEventListener(`hashchange`,w),w();