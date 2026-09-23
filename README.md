# 🎬 Filmisfäär — Filmi ajaloo veebiportaal

**Filmisfäär** on kaasaegne veebirakendus, mis tutvustab kino visuaalset ajalugu alates tummfilmi esimestest kaadritest kuni digiajastu kassahittideni. Rakenduses on ajalooline ajajoon, artiklite ja siltide arhiiv, otsingumootor, kasutajate registreerimine ja autoriseerimine, interaktiivsed kommentaarid ning administraatori halduspaneel.

---

## 📌 Tehnoloogiapinu (Tech Stack)

* **Tagarakendus (Backend):** Node.js, Express, `express-session` (serveripoolsed seansid), `mysql2` (andmebaasiühendus), `bcryptjs` (paroolide räsimine).
* **Esirakendus (Frontend):** Vanilla JavaScript (ESM), HTML5, CSS3, Vite (kompileerimine ja pakkimine).
* **Andmebaas:** MySQL / MariaDB (XAMPP).
* **Testimine:** Vitest, V8 Coverage, Supertest (ühiktestid, integratsioonitestid ja E2E kasutajateekonnad).

---

## 💻 Süsteeminõuded enne alustamist

Enne paigaldamist veenduge, et teie arvutis on olemas järgmised programmid:

1. **Node.js** (versioon 18.0 või uuem) ja **npm**  
   *Kontrollimiseks terminalis:* `node -v` ja `npm -v`  
   *Allalaadimine vajadusel:* [nodejs.org](https://nodejs.org/)
2. **XAMPP** (MySQL / MariaDB andmebaasiserveri jaoks)  
   *Allalaadimine vajadusel:* [apachefriends.org](https://www.apachefriends.org/)
3. **Git** (koodi kloonimiseks)

---

## ⚡ Kiirkäivitus (kui olete varem seadistanud)

```bash
# 1. Paigalda sõltuvused
npm install

# 2. Loo keskkonnafail
cp .env.example .env

# 3. Ehita esirakendus
npm run build

# 4. Käivita server (veendu, et XAMPP MySQL töötab)
npm start
```
Rakendus on kättesaadav aadressil: **http://localhost:3000**

---

## 📖 Samm-sammuline paigaldusjuhend algajale

Järgige neid samme täpselt, et panna projekt tööle puhtalt lehelt:

### Samm 1: Projekti allalaadimine

Avage terminal (PowerShell, Command Prompt või Git Bash) ja kloonige koodihoidla:
```bash
git clone https://github.com/rewazi/my_project.git
cd my_project
```

### Samm 2: Sõltuvuste paigaldamine

Paigaldage kõik vajalikud Node.js teegid käsuga:
```bash
npm install
```

### Samm 3: Andmebaasi ettevalmistus (XAMPP)

1. Avage oma arvutis programm **XAMPP Control Panel**.
2. Leidke rida **MySQL** ja vajutage nupule **Start** (Apache moodulit käivitada pole vaja, kuna veebiserverit jooksutab Node.js).
3. Veenduge, et MySQL kõrvale ilmub roheline märge ja pordinumber (vaikimisi `3306`).

> [!NOTE]
> Rakendus loob andmebaasi `filmisfaar`, tabelid, vaikeartiklid ja administraatori konto **automaatselt esmakäivitusel**.  
> Käsitsi pole andmebaasi vaja importida! Kui aga soovite andmebaasi luua käsitsi, avage brauseris `http://localhost/phpmyadmin`, valige sakk **Import** ja laadige üles fail [database.sql](database.sql).

### Samm 4: Seadistusfaili (.env) loomine

Projekti juurkaustas peab olema `.env` fail. Looge see näidisfaili põhjal:

* **Windows PowerShellis:**
  ```powershell
  Copy-Item .env.example .env
  ```
* **Või Linux/Mac/Git Bashis:**
  ```bash
  cp .env.example .env
  ```

Faili `.env` vaikesisu sobib enamiku tavaliste XAMPP paigalduste jaoks (kus kasutaja on `root` ja parool on tühi):
```env
PORT=3000
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=filmisfaar
SESSION_SECRET=filmisfaar-salajane-voti-12345
ADMIN_EMAIL=admin@filmisfaar.local
ADMIN_PASSWORD=admin123
```
*Kui teie XAMPP MySQL kasutab parooli või teist porti, muutke need väärtused `.env` failis vastavaks.*

### Samm 5: Kliendirakenduse kompileerimine (Frontend Build)

Kompileerige JavaScript ja stiilifailid optimeeritud `dist/` kausta:
```bash
npm run build
```
See samm loob `dist/` kausta, mida Node.js veebiserver külastajatele serveerib.

### Samm 6: Serveri käivitamine

Käivitage rakendus käsuga:
```bash
npm start
```
Terminali ilmub teade:
```text
Filmisfäär käivitatud: http://localhost:3000
```
Nüüd avage veebibrauseris aadress: **[http://localhost:3000](http://localhost:3000)** 🎉

---

## 🔑 Vaikimisi kasutajakontod ja rollid

Süsteemis on pärast käivitamist koheselt olemas administraatori konto:

| Roll | E-post | Parool | Õigused |
| :--- | :--- | :--- | :--- |
| **Administraator** | `admin@filmisfaar.local` | `admin123` | Täielik ligipääs halduspaneelile (`#/admin`), artiklite loomine, muutmine, siltide haldus, kommentaaride modereerimine. |
| **Tavakasutaja** | *Iga registreeritud konto* | *Valitud parool* | Artiklite lugemine, otsing sildi/märksõna järgi, kommenteerimine, ainult oma kommentaaride muutmine ja kustutamine. |
| **Külaline (Anonüümne)** | — | — | Artiklite ja arhiivi lugemine, otsing. Kommenteerimiseks suunatakse sisselogimisele. |

---

## 🚀 Rakenduse võimalused ja funktsioonid

1. **Ajalooline ajajoon (Avaleht `#/`):**
   * Ülevaade kino pöördepunktidest (Tummfilm, Prantsuse uus laine, Kassahitid).
   * Visuaalsed kaardid, lühitutvustused ja sildid.

2. **Artikli lehekülg (`#/article/:slug`):**
   * Täispikk artikkel, pildimaterjal, arhiivifakt ja lugemisaeg.
   * Kommentaaride sektsioon: registreeritud kasutajad saavad postitada arvamusi ning muuta ja kustutada ainult enda kommentaare.

3. **Otsing ja siltide arhiiv (`#/tags`):**
   * Artiklite filtreerimine teemade/siltide järgi ühe klikiga.
   * Reaalajas tekstiline otsing märksõna järgi (otsib korraga pealkirjadest, kirjeldustest ja sisutekstist).

4. **Autentimine ja turvalisus:**
   * Registreerimine ja sisselogimine turvaliste paroolinõuetega.
   * Paroole hoitakse räsituna `bcrypt` algoritmiga (soolatud räsi).
   * **Brute-force kaitse:** kui ühele kontole sisestatakse 5 korda järjest vale parool, blokeerib süsteem katsed 15 minutiks (HTTP 429 Too Many Requests).
   * Seansside haldus serveripoolsete küpsistega (`HttpOnly`, `SameSite: lax`).

5. **Administraatori halduspaneel (`#/admin`):**
   * Uute artiklite lisamine (slug, pealkiri, tekstilõigud, fakt, pilt, sildid).
   * Olemasolevate artiklite teksti ja faktide muutmine reaalajas.
   * Siltide loomine, artiklitega sidumine ja eemaldamine.
   * Kommentaaride modereerimine (ebasobivate kommentaaride kustutamine).

---

## 📋 Nõuete spetsifikatsioon ja jälgitavus (ISO/IEC/IEEE 29148:2018)

Projekti analüüs, nõuete haldus ja funktsionaalsuse verifitseerimine järgivad rahvusvahelist tarkvaranõuete inseneriteaduse standardit **ISO/IEC/IEEE 29148:2018** (*Systems and software engineering — Life cycle processes — Requirements engineering*).

> [!NOTE]
> Täismahus formaalne spetsifikatsioon koos arhitektuuri ja piirangutega asub dokumendis: **[REQUIREMENTS_ISO_29148.md](REQUIREMENTS_ISO_29148.md)**.

### Standardi rakendamine projektis:
1. **Normatiivne nõuete lausestus:** Kõik funktsionaalsed nõuded on rangelt esitatud standardi nõuete kohaselt vormis **„Süsteem peab...”** (*The system shall...*).
2. **Kvaliteedikriteeriumid (Characteristics):** Iga nõue on ühemõtteline, vajalik, teostatav ja 100% verifitseeritav automatiseeritud testidega.
3. **Kahesuunaline jälgitavus (Bidirectional Traceability):** Igal nõudel on unikaalne kood (`FR-xx`, `NFR-xx`), mis seob nõude vastava koodikomponendi ja testjuhtumiga.

### Nõuete ja verifitseerimise kiirmaatriks (Traceability Matrix):

| Nõude ID | Nõude lühikirjeldus | Kategooria | Realisatsioon | Verifitseeriv testijuhtum |
| :--- | :--- | :--- | :--- | :--- |
| **FR-01** | Kasutaja registreerimine unikaalse e-postiga | Funktsionaalne | `api/register.js` | `tests/api.integration.test.js` -> registreerib uue kasutaja |
| **FR-02** | Paroolide turvaline soolatud räsimine (bcrypt) | Turvalisus | `api/config.js` | `tests/config.unit.test.js` -> parooliräsi valideerimine |
| **FR-03** | E-posti duplikaatide tõkestamine (409 Conflict) | Funktsionaalne | `api/register.js` | `tests/api.integration.test.js` -> tagastab 409 (ER_DUP_ENTRY) |
| **FR-04** | Sisselogimine ja seanss (`HttpOnly` küpsised) | Turvalisus | `api/login.js` | `tests/api.integration.test.js` -> seansi loomine |
| **FR-07** | Brute-force rünnakute tõkestus (5 katset -> 429) | Turvalisus | `api/login.js` | `tests/api.integration.test.js` -> 15 min blokeering |
| **FR-08** | Kronoloogiline kinoloo ajajoon avalehel | Funktsionaalne | `src/main.js` | `tests/app.e2e.test.js` -> Samm 1 (Avaleht) |
| **FR-09** | Artikli vaade pildi, teksti ja arhiivifaktiga | Funktsionaalne | `src/main.js` | `tests/app.e2e.test.js` -> Samm 2 (Artiklileht) |
| **FR-11** | Siltide filtreerimine (`#/tags`) | Funktsionaalne | `src/main.js` | `tests/app.e2e.test.js` -> Samm 9 (Siltide filter) |
| **FR-12** | Reaalajas märksõnaotsing (`/api/articles?q=`) | Funktsionaalne | `api/admin.js` | `tests/api.integration.test.js` -> otsingutestid |
| **FR-13** | Kommentaaride lugemine (kõik külastajad) | Funktsionaalne | `api/comments.js` | `tests/api.integration.test.js` -> GET /api/comments |
| **FR-14** | Uue kommentaari postitamine (2–500 tähemärki) | Funktsionaalne | `api/comments.js` | `tests/api.integration.test.js`, `tests/app.e2e.test.js` |
| **FR-15** | Oma kommentaari muutmine (inline edit, PUT) | Funktsionaalne | `api/comments.js` | `tests/api.integration.test.js` -> PUT /api/comments/entry/:id |
| **FR-16** | Oma kommentaari kustutamine (DELETE) | Funktsionaalne | `api/comments.js` | `tests/api.integration.test.js` -> DELETE /api/comments/entry/:id |
| **FR-17** | Võõra kommentaari muutumiskaitse (403 Forbidden)| Turvalisus | `api/comments.js` | `tests/api.integration.test.js` -> 403 õiguste kontroll |
| **FR-18** | Administraatori halduspaneeli autoriseerimine | Turvalisus | `api/admin.js` | `tests/api.integration.test.js` -> 401 volitamata päring |
| **FR-19** | Uue artikli lisamine administraatori poolt | Funktsionaalne | `api/admin.js` | `tests/api.integration.test.js` -> POST /api/admin/articles |
| **FR-20** | Artikli sisu muutmine administraatori poolt | Funktsionaalne | `api/admin.js` | `tests/api.integration.test.js` -> PUT /api/admin/articles/:id |
| **FR-21** | Siltide lisamine, sidumine ja kustutamine | Funktsionaalne | `api/admin.js` | `tests/api.integration.test.js` -> siltide haldus |
| **FR-22** | Modereerimine (kommentaari kustutamine adminina) | Funktsionaalne | `api/admin.js` | `tests/api.integration.test.js` -> DELETE /api/admin/comments/:id |
| **NFR-04** | API otspunktide madal latentsusaeg (< 100 ms) | Jõudlus | Node/Express | `tests/api.integration.test.js` -> kiire reageerimisaeg |
| **NFR-07** | 100% funktsioonide testikaetus | Hooldatavus | Kogu projekt | `npm test` -> 43/43 testi läbitud, 100% Funcs kaetus |

---

## 🧪 Automatiseeritud testide käivitamine

Projektis on põhjalik, kolmetasemeline testide komplekt (ühiktestid, integratsioonitestid ja E2E testid), mis kontrollivad rakenduse kõiki funktsioone ja turvareegleid.

Kõikide testide käivitamine koos koodikaetuse raportiga:
```bash
npm test
```

### Eraldiseisvad testikäsud:

* **Ainult ühiktestid (Unit tests):**
  ```bash
  npm run test:unit
  ```
  *Kontrollib valideerimisloogikat (`validateCredentials`) ja profiili väljade turvalisust (`publicUser`).*

* **Ainult integratsioonitestid (API Integration tests):**
  ```bash
  npm run test:integration
  ```
  *Kontrollib kõiki REST API otspunkte, andmebaasipäringuid, veastaatusi (400, 401, 403, 404, 409, 422, 429) ja seansse.*

* **Ainult täielikud kasutajateekonnad (End-to-End tests):**
  ```bash
  npm run test:e2e
  ```
  *Läbib simuleeritult terve lugeja teekonna (registreerumine -> otsing -> kommenteerimine -> muutmine -> kustutamine -> väljumine) ja administraatori tsükli.*

* **Testide automaatne jälgimisrežiim (Watch mode):**
  ```bash
  npm run test:watch
  ```

---

## 📂 Projekti failistruktuur

```text
my_project/
├── api/                       # Tagarakenduse API kontrollerid ja äriloogika
│   ├── admin.js               # Administraatori funktsioonid ja artiklite otsing
│   ├── comments.js            # Kommentaaride lugemine, lisamine ja CRUD
│   ├── config.js              # Andmebaasi ühendusbassein, initsialiseerimine ja valideerimine
│   ├── defaultArticles.js     # Esmased vaikeartiklid andmebaasi täitmiseks
│   ├── login.js               # Sisselogimine ja brute-force kaitse
│   ├── logout.js              # Väljalogimine ja seansi hävitamine
│   ├── me.js                  # Aktiivse seansi kontroll
│   └── register.js            # Uute kasutajate registreerimine ja parooliräsi
├── dist/                      # Kompileeritud staatiline esirakendus (toodang)
│   ├── assets/                # Pakitud JS ja CSS failid
│   └── index.html             # Esirakenduse peamine HTML
├── src/                       # Esirakenduse lähtekood
│   ├── main.js                # Kliendipoolne SPA loogika, komponendid ja sündmused
│   └── style.css              # Kujundus, animatsioonid ja kohalduv paigutus (responsive)
├── tests/                     # Automatiseeritud testid
│   ├── api.integration.test.js# API otspunktide integratsioonitestid
│   ├── app.e2e.test.js        # Kasutajateekondade End-to-End (E2E) testid
│   └── config.unit.test.js    # Valideerimise ja abifunktsioonide ühiktestid
├── .env.example               # Keskkonnamuutujate näidisfail
├── .gitignore                 # Gitist välja jäetavad ajutised failid
├── database.sql               # MySQL andmebaasi skeem ja tabelite loomise skript
├── index.html                 # Kliendirakenduse HTML algallikas Vite jaoks
├── package.json               # Projekti metainfo, skriptid ja sõltuvused
├── README.md                  # Projekti peamine paigaldus- ja kasutusjuhend
├── REQUIREMENTS_ISO_29148.md  # Nõuete spetsifikatsioon (ISO/IEC/IEEE 29148:2018)
├── server.js                  # Express veebiserver ja marsruutimine
└── vitest.config.js           # Vitest testiraamistiku seadistus
```

---

## ❓ Tõrkeotsing ja korduma kippuvad küsimused (FAQ)

### 1. Viga: `ECONNREFUSED 127.0.0.1:3306`
* **Põhjus:** MySQL andmebaasiserver ei tööta.
* **Lahendus:** Avage **XAMPP Control Panel** ja vajutage MySQL mooduli kõrval nuppu **Start**. Veenduge, et port 3306 ei ole hõivatud mõne muu programmi poolt.

### 2. Viga: `Port 3000 is already in use`
* **Põhjus:** Mõni teine rakendus või eelmine serveri instants juba kuulab porti 3000.
* **Lahendus:** Sulgege eelmine terminaliaken või muutke `.env` failis pordinumbrit, nt: `PORT=3001`.

### 3. Esilehel on näha vana sisu või koodimuudatused ei ilmu brauserisse
* **Põhjus:** Server kuvab `dist/` kausta staatilist paketti. Kui muudate faile kaustas `src/`, tuleb esirakendus uuesti kokku pakkida.
* **Lahendus:** Käivitage käsk `npm run build` ja laadige brauseri leht uuesti (`Ctrl + F5`).

### 4. Sisselogimisel ilmub: `Liiga palju ebaõnnestunud katseid. Proovige uuesti 15 min pärast.`
* **Põhjus:** Aktiveerus süsteemi brute-force kaitse, kuna sisestati korduvalt vale parool.
* **Lahendus:** Oodake 15 minutit või taaskäivitage server (`Ctrl + C` ja `npm start`), mis lähtestab mälupõhise katsete loenduri.

---

## 📜 Litsents

Õppeotstarbeline projekt (IVKHK). Kõik õigused kaitstud.
