import session from 'express-session';

/**
 * Tootmiskõlbulik (Production-ready) seansihaldur, mis salvestab seansid MySQL andmebaasi
 * ning hoiab mälus piiratud mahuga kiiret vahemälu.
 * 
 * Eelised võrreldes express-session vaike MemoryStore'iga:
 * 1. Andmete püsivus: seansid säilivad serveri taaskäivitamisel ja koodiuuendustel.
 * 2. Horisontaalne skaleeritavus: toetab mitut Node.js klastri protsessi või konteinerit.
 * 3. Mälulekete kaitse: piiratud kirjetearv (LRU) ja automaatne aegunud seansside puhastus.
 */
export class MySQLSessionStore extends session.Store {
  constructor(options = {}) {
    super();
    this.pool = options.pool;
    this.ttl = options.ttl || 86400 * 7; // Vaikimisi 7 päeva (sekundites)
    this.maxMemoryEntries = options.maxMemoryEntries || 10000;
    this.memory = new Map();

    const cleanupInterval = (options.cleanupIntervalMinutes || 15) * 60 * 1000;
    this.cleanupTimer = setInterval(() => this.pruneExpired(), cleanupInterval);
    if (this.cleanupTimer.unref) this.cleanupTimer.unref();
  }

  async pruneExpired() {
    const nowSec = Math.floor(Date.now() / 1000);

    // 1. Puhastus mälukiHist
    for (const [sid, item] of this.memory.entries()) {
      if (item.expires <= nowSec) {
        this.memory.delete(sid);
      }
    }

    // 2. Puhastus andmebaasist
    if (this.pool && typeof this.pool.execute === 'function') {
      try {
        await this.pool.execute('DELETE FROM sessions WHERE expires < ?', [nowSec]);
      } catch {
        // Eirame kui andmebaas pole veel kättesaadav või tabel puudub
      }
    }
  }

  get(sid, callback) {
    const nowSec = Math.floor(Date.now() / 1000);

    // 1. Kontrollime kiiret mälukihti
    const cached = this.memory.get(sid);
    if (cached) {
      if (cached.expires > nowSec) {
        return callback(null, cached.data);
      }
      this.memory.delete(sid);
    }

    // 2. Pärime andmebaasist
    if (!this.pool || typeof this.pool.execute !== 'function') {
      return callback(null, null);
    }

    this.pool.execute('SELECT data, expires FROM sessions WHERE session_id = ? AND expires > ?', [sid, nowSec])
      .then(([rows]) => {
        if (!rows || !rows.length || !rows[0].data) {
          return callback(null, null);
        }
        try {
          const sessionData = typeof rows[0].data === 'string' ? JSON.parse(rows[0].data) : rows[0].data;
          this.memory.set(sid, { data: sessionData, expires: Number(rows[0].expires) });
          callback(null, sessionData);
        } catch (err) {
          callback(err);
        }
      })
      .catch(() => callback(null, null));
  }

  set(sid, sessionData, callback) {
    const nowSec = Math.floor(Date.now() / 1000);
    let expires = nowSec + this.ttl;

    if (sessionData && sessionData.cookie && sessionData.cookie.expires) {
      expires = Math.floor(new Date(sessionData.cookie.expires).getTime() / 1000);
    }

    // Kui mälupiirang on käes, vabastame vanima kirje (LRU / FIFO kaitse)
    if (this.memory.size >= this.maxMemoryEntries) {
      const oldestSid = this.memory.keys().next().value;
      if (oldestSid) this.memory.delete(oldestSid);
    }

    this.memory.set(sid, { data: sessionData, expires });

    if (!this.pool || typeof this.pool.execute !== 'function') {
      if (typeof callback === 'function') callback(null);
      return;
    }

    const payload = JSON.stringify(sessionData);
    this.pool.execute(
      'INSERT INTO sessions (session_id, data, expires) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE data = VALUES(data), expires = VALUES(expires)',
      [sid, payload, expires]
    )
      .then(() => {
        if (typeof callback === 'function') callback(null);
      })
      .catch(() => {
        // Vigade korral jääb seanss mällu kättesaadavaks
        if (typeof callback === 'function') callback(null);
      });
  }

  destroy(sid, callback) {
    this.memory.delete(sid);

    if (!this.pool || typeof this.pool.execute !== 'function') {
      if (typeof callback === 'function') callback(null);
      return;
    }

    this.pool.execute('DELETE FROM sessions WHERE session_id = ?', [sid])
      .then(() => {
        if (typeof callback === 'function') callback(null);
      })
      .catch(() => {
        if (typeof callback === 'function') callback(null);
      });
  }

  touch(sid, sessionData, callback) {
    const nowSec = Math.floor(Date.now() / 1000);
    let expires = nowSec + this.ttl;

    if (sessionData && sessionData.cookie && sessionData.cookie.expires) {
      expires = Math.floor(new Date(sessionData.cookie.expires).getTime() / 1000);
    }

    const cached = this.memory.get(sid);
    if (cached) {
      cached.expires = expires;
    }

    if (this.pool && typeof this.pool.execute === 'function') {
      this.pool.execute('UPDATE sessions SET expires = ? WHERE session_id = ?', [expires, sid]).catch(() => {});
    }

    if (typeof callback === 'function') callback(null);
  }
}

export default MySQLSessionStore;
