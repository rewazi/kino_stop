import { describe, expect, it, vi } from 'vitest';
import { MySQLSessionStore } from '../api/sessionStore.js';
import {
  pruneExpiredAttempts,
  resetLoginAttempts,
  loginAttempts,
  registerFailedAttempt,
  getAttemptState,
  clearAttempts,
  LOCKOUT_MS,
  MAX_CACHE_ENTRIES,
  loginHandler
} from '../api/login.js';

describe('MySQLSessionStore seansihalduri ühiktestid', () => {
  it('loob instantsi vaike- ja kohandatud parameetritega', () => {
    const store1 = new MySQLSessionStore();
    expect(store1.ttl).toBe(86400 * 7);
    expect(store1.maxMemoryEntries).toBe(10000);

    const store2 = new MySQLSessionStore({ ttl: 3600, maxMemoryEntries: 2, cleanupIntervalMinutes: 1 });
    expect(store2.ttl).toBe(3600);
    expect(store2.maxMemoryEntries).toBe(2);
  });

  it('salvestab ja loeb seanssi mälust kui andmebaasi pole määratud', async () => {
    const store = new MySQLSessionStore({ ttl: 3600 });
    const sessionData = { userId: 10, role: 'user', cookie: { expires: new Date(Date.now() + 1000000).toISOString() } };

    await new Promise((resolve) => store.set('sid-123', sessionData, resolve));

    const retrieved = await new Promise((resolve, reject) => {
      store.get('sid-123', (err, data) => (err ? reject(err) : resolve(data)));
    });

    expect(retrieved).toEqual(sessionData);

    // Kustutamine
    await new Promise((resolve) => store.destroy('sid-123', resolve));

    const afterDestroy = await new Promise((resolve, reject) => {
      store.get('sid-123', (err, data) => (err ? reject(err) : resolve(data)));
    });
    expect(afterDestroy).toBeNull();
  });

  it('salvestab ja loeb andmebaasist (pool.execute)', async () => {
    const dbStorage = new Map();
    const mockPool = {
      execute: vi.fn(async (sql, params) => {
        if (sql.includes('INSERT INTO sessions')) {
          const [sid, data, expires] = params;
          dbStorage.set(sid, { data, expires });
          return [{ affectedRows: 1 }];
        }
        if (sql.includes('SELECT data, expires FROM sessions')) {
          const [sid, nowSec] = params;
          const entry = dbStorage.get(sid);
          if (entry && entry.expires > nowSec) {
            return [[{ data: entry.data, expires: entry.expires }]];
          }
          return [[]];
        }
        if (sql.includes('DELETE FROM sessions WHERE session_id = ?')) {
          dbStorage.delete(params[0]);
          return [{ affectedRows: 1 }];
        }
        if (sql.includes('UPDATE sessions SET expires = ?')) {
          const [expires, sid] = params;
          const entry = dbStorage.get(sid);
          if (entry) entry.expires = expires;
          return [{ affectedRows: 1 }];
        }
        if (sql.includes('DELETE FROM sessions WHERE expires < ?')) {
          const [nowSec] = params;
          for (const [sid, entry] of dbStorage.entries()) {
            if (entry.expires < nowSec) dbStorage.delete(sid);
          }
          return [{ affectedRows: 1 }];
        }
        return [[]];
      })
    };

    const store = new MySQLSessionStore({ pool: mockPool, ttl: 3600 });
    const sessionData = { userId: 42, role: 'admin' };

    await new Promise((resolve) => store.set('sid-db', sessionData, resolve));
    expect(mockPool.execute).toHaveBeenCalled();

    // Tühjendame lokaalse mälukihi, et sundida lugemist andmebaasist
    store.memory.clear();

    const fromDb = await new Promise((resolve, reject) => {
      store.get('sid-db', (err, data) => (err ? reject(err) : resolve(data)));
    });
    expect(fromDb).toEqual(sessionData);

    // Testime touch
    await new Promise((resolve) => store.touch('sid-db', sessionData, resolve));

    // Lisame aegunud kirje mällu ja testime pruneExpired
    store.memory.set('old-sid', { data: {}, expires: 100 });
    await store.pruneExpired();
    expect(store.memory.has('old-sid')).toBe(false);

    // Testime destroy andmebaasist
    await new Promise((resolve) => store.destroy('sid-db', resolve));
    expect(dbStorage.has('sid-db')).toBe(false);
  });

  it('käsitleb andmebaasi vigu sujuvalt mällu langemisega', async () => {
    const errorPool = {
      execute: vi.fn(async () => {
        throw new Error('Database connection failed');
      })
    };

    const store = new MySQLSessionStore({ pool: errorPool, ttl: 3600 });
    const sessionData = { userId: 99 };

    // set ei tohi krahhida
    await new Promise((resolve) => store.set('sid-err', sessionData, resolve));
    expect(store.memory.get('sid-err').data).toEqual(sessionData);

    // get mälust töötab
    const retrieved = await new Promise((resolve) => store.get('sid-err', (err, data) => resolve(data)));
    expect(retrieved).toEqual(sessionData);

    // destroy ei krahhi
    await new Promise((resolve) => store.destroy('sid-err', resolve));
    expect(store.memory.has('sid-err')).toBe(false);

    // get andmebaasi veaga tagastab null
    const afterErr = await new Promise((resolve) => store.get('sid-err', (err, data) => resolve(data)));
    expect(afterErr).toBeNull();

    // pruneExpired ei krahhi
    await expect(store.pruneExpired()).resolves.toBeUndefined();
  });

  it('järgib mälumahu piirangut (FIFO/LRU väljaviskamine mälust)', async () => {
    const store = new MySQLSessionStore({ maxMemoryEntries: 2, ttl: 3600 });
    await new Promise((resolve) => store.set('sid-1', { id: 1 }, resolve));
    await new Promise((resolve) => store.set('sid-2', { id: 2 }, resolve));
    expect(store.memory.size).toBe(2);

    await new Promise((resolve) => store.set('sid-3', { id: 3 }, resolve));
    expect(store.memory.size).toBe(2);
    expect(store.memory.has('sid-1')).toBe(false);
    expect(store.memory.has('sid-2')).toBe(true);
    expect(store.memory.has('sid-3')).toBe(true);
  });

  it('eemaldab mälust aegunud seansi get() ajal', async () => {
    const store = new MySQLSessionStore({ ttl: -10 }); // Aegunud kohe
    await new Promise((resolve) => store.set('expired-sid', { test: true }, resolve));

    const result = await new Promise((resolve, reject) => {
      store.get('expired-sid', (err, data) => (err ? reject(err) : resolve(data)));
    });

    expect(result).toBeNull();
    expect(store.memory.has('expired-sid')).toBe(false);
  });
});

describe('Brute-force mälu ja aegumise halduse ühiktestid', () => {
  it('eemaldab aegunud kirjed pruneExpiredAttempts kaudu', () => {
    resetLoginAttempts();
    const now = Date.now();

    // Lisame aegunud kirje
    loginAttempts.set('expired@test.com:127.0.0.1', {
      count: 2,
      lockedUntil: 0,
      updatedAt: now - LOCKOUT_MS - 1000
    });

    // Lisame aktiivse blokeeringu
    loginAttempts.set('locked@test.com:127.0.0.1', {
      count: 5,
      lockedUntil: now + 50000,
      updatedAt: now
    });

    pruneExpiredAttempts(now);

    expect(loginAttempts.has('expired@test.com:127.0.0.1')).toBe(false);
    expect(loginAttempts.has('locked@test.com:127.0.0.1')).toBe(true);

    resetLoginAttempts();
  });

  it('kustutab aegunud oleku getAttemptState päringul', () => {
    resetLoginAttempts();
    const now = Date.now();

    loginAttempts.set('stale@test.com:127.0.0.1', {
      count: 1,
      lockedUntil: 0,
      updatedAt: now - LOCKOUT_MS - 2000
    });

    const state = getAttemptState('stale@test.com:127.0.0.1');
    expect(state.count).toBe(0);
    expect(loginAttempts.has('stale@test.com:127.0.0.1')).toBe(false);
  });

  it('käsitleb vigast JSON-i andmebaasis get() ajal', async () => {
    const corruptPool = {
      execute: vi.fn(async () => [[{ data: '{invalid-json', expires: Math.floor(Date.now() / 1000) + 1000 }]])
    };
    const corruptStore = new MySQLSessionStore({ pool: corruptPool });
    await expect(new Promise((resolve, reject) => {
      corruptStore.get('corrupt-sid', (err, data) => (err ? reject(err) : resolve(data)));
    })).rejects.toThrow();
  });

  it('eemaldab vanima kirje vahemälu täitumisel', () => {
    resetLoginAttempts();
    const now = Date.now();
    for (let i = 0; i < MAX_CACHE_ENTRIES; i++) {
      loginAttempts.set(`user${i}@mail.com:127.0.0.1`, {
        count: 1,
        lockedUntil: 0,
        updatedAt: now
      });
    }

    const firstKey = loginAttempts.keys().next().value;
    expect(loginAttempts.has(firstKey)).toBe(true);

    // Registreerime uue ebaõnnestunud katse, mis peab vallandama FIFO väljaviske
    registerFailedAttempt('newuser@mail.com:127.0.0.1');
    expect(loginAttempts.has(firstKey)).toBe(false);
    expect(loginAttempts.has('newuser@mail.com:127.0.0.1')).toBe(true);

    clearAttempts('newuser@mail.com:127.0.0.1');
    expect(loginAttempts.has('newuser@mail.com:127.0.0.1')).toBe(false);

    resetLoginAttempts();
  });

  it('käsitleb andmebaasi vigu loginHandleris ja tagastab 500', async () => {
    const req = {
      body: { email: 'any@mail.com', password: '123' },
      ip: '127.0.0.1',
      session: { regenerate: vi.fn() }
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };

    // Rikume pool.execute ajutiselt
    const { pool } = await import('../api/config.js');
    const originalExecute = pool.execute;
    pool.execute = vi.fn().mockRejectedValue(new Error('DB failure'));

    await loginHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Sisselogimine ebaõnnestus.' });

    // Taastame
    pool.execute = originalExecute;
    resetLoginAttempts();
  });
});
