# Käivitamine (Node.js rakendus + XAMPP MySQL)

## 1. Andmebaas — XAMPP

1. Käivitage XAMPP-i juhtpaneelil moodul **MySQL** (Apache moodulit pole vaja, kuna veebirakendus ise töötab Node.js peal, mitte XAMPP alt).
2. Vajadusel avage andmebaasi haldamiseks `http://localhost/phpmyadmin` — näiteks olemasoleva `database.sql` importimiseks vahekaardil **Impordi**.
3. Vaikimisi kasutab MySQL ühendus kasutajat `root` ilma paroolita. Kui teie XAMPP seadistus on erinev, pange need väärtused kirja järgmises sammus kirjeldatud `.env` faili.

Rakendus loob andmebaasi ja tabelid käivitamisel ka ise automaatselt, kui neid veel olemas pole — käsitsi importimine on vajalik ainult siis, kui soovite kasutada valmis andmestikku.

## 2. Rakendus — Node.js

1. Veenduge, et arvutis on paigaldatud Node.js.
2. Looge projekti juurkausta `.env` fail ja määrake `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `SESSION_SECRET`, `ADMIN_EMAIL` ja `ADMIN_PASSWORD` — vastavalt oma XAMPP MySQL-i seadistusele (samm 1).
3. Paigaldage sõltuvused käsuga `npm install`.
4. Käivitage server käsuga `npm start` (või `node server.js`). Rakendus on vaikimisi saadaval aadressil `http://localhost:3000`.

Paroole ei hoita avatekstina: API kasutab `bcrypt`-räsimist, parametriseeritud SQL-päringuid ja serveripoolseid seansse (`express-session`).
