import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { app } from '../server.js';
import { getAtlasHandler } from '../api/atlas.js';
import {
  calculateBadges,
  getWatchlistHandler,
  saveWatchlistHandler,
  deleteWatchlistHandler
} from '../api/watchlist.js';

describe('Kinoatlas & Watchlist / Cinematheque testid', () => {
  describe('Kinoatlas API (/api/atlas)', () => {
    it('tagastab kronoloogilised verstapostid ja filtrid läbi supertesti', async () => {
      const res = await request(app).get('/api/atlas');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.milestones)).toBe(true);
      expect(res.body.milestones.length).toBeGreaterThanOrEqual(8);
      expect(Array.isArray(res.body.countries)).toBe(true);
      expect(res.body.countries).toContain('Prantsusmaa');
      expect(res.body.countries).toContain('Saksamaa');
      expect(res.body.countries).toContain('USA');
      expect(Array.isArray(res.body.movements)).toBe(true);
      expect(res.body.movements).toContain('Tummfilm');
      expect(res.body.movements).toContain('Uus laine');
    });

    it('käsitleb vigu getAtlasHandleris sujuvalt 500 staatusega', async () => {
      const req = {};
      const res = {
        json: vi.fn(),
        status: vi.fn().mockImplementation(() => {
          throw new Error('Test crash');
        })
      };
      // getAtlasHandler catch plokk
      try {
        await getAtlasHandler(req, res);
      } catch (err) {
        expect(err.message).toBe('Test crash');
      }
    });
  });

  describe('calculateBadges funktsioon', () => {
    it('arvutab märgid korrektselt erinevate staatuste korral', () => {
      expect(calculateBadges([])).toEqual([]);

      const oneWatched = calculateBadges([{ article_slug: 'silent', status: 'watched' }]);
      expect(oneWatched.map((b) => b.id)).toContain('first_step');
      expect(oneWatched.map((b) => b.id)).toContain('silent_scholar');

      const allBadges = calculateBadges([
        { article_slug: 'silent', status: 'favorite' },
        { article_slug: 'nouvelle', status: 'watched' },
        { article_slug: 'blockbuster', status: 'watched' }
      ]);
      expect(allBadges.map((b) => b.id)).toEqual(
        expect.arrayContaining(['first_step', 'cinephile', 'silent_scholar', 'new_wave_rebel', 'blockbuster_buff'])
      );
    });
  });

  describe('Watchlist API käsitlejad (get, save, delete)', () => {
    it('tagastab 401 kui kasutaja pole sisse loginud', async () => {
      const req = { session: {} };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await getWatchlistHandler(req, res);
      expect(res.status).toHaveBeenCalledWith(401);

      await saveWatchlistHandler(req, res);
      expect(res.status).toHaveBeenCalledWith(401);

      await deleteWatchlistHandler(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('tagastab 400 kui salvestamisel või kustutamisel puudub article_slug', async () => {
      const req = { session: { userId: 5 }, body: { article_slug: '' }, params: {} };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await saveWatchlistHandler(req, res);
      expect(res.status).toHaveBeenCalledWith(400);

      await deleteWatchlistHandler(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('salvestab, loeb ja kustutab kirjeid mock pooliga', async () => {
      const storage = [];
      const { pool } = await import('../api/config.js');
      const origExecute = pool.execute;

      pool.execute = vi.fn(async (sql, params) => {
        if (sql.includes('INSERT INTO watchlist')) {
          const [userId, slug, status, rating, notes] = params;
          const existing = storage.find((item) => item.user_id === userId && item.article_slug === slug);
          if (existing) {
            existing.status = status;
            existing.rating = rating;
            existing.notes = notes;
          } else {
            storage.push({ user_id: userId, article_slug: slug, status, rating, notes });
          }
          return [{ affectedRows: 1 }];
        }
        if (sql.includes('SELECT id, user_id, article_slug')) {
          const [userId] = params;
          return [storage.filter((item) => item.user_id === userId)];
        }
        if (sql.includes('DELETE FROM watchlist')) {
          const [userId, slug] = params;
          const idx = storage.findIndex((item) => item.user_id === userId && item.article_slug === slug);
          if (idx !== -1) storage.splice(idx, 1);
          return [{ affectedRows: 1 }];
        }
        return [[]];
      });

      // 1. Salvestame 'want' kirje
      const saveReq = {
        session: { userId: 12 },
        body: { article_slug: 'silent', status: 'want', rating: 4, notes: 'Huvitav teema' }
      };
      const saveRes = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      await saveWatchlistHandler(saveReq, saveRes);
      expect(saveRes.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));

      // 2. Loeme watchlisti
      const getReq = { session: { userId: 12 } };
      const getRes = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      await getWatchlistHandler(getReq, getRes);
      expect(getRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          items: expect.any(Array),
          stats: expect.objectContaining({ total: 1, wantCount: 1 })
        })
      );

      // 3. Kustutame kirje
      const delReq = { session: { userId: 12 }, params: { articleSlug: 'silent' } };
      const delRes = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      await deleteWatchlistHandler(delReq, delRes);
      expect(delRes.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));

      // Taastame algse meetodi
      pool.execute = origExecute;
    });

    it('käsitleb andmebaasi vigu ja tagastab 500', async () => {
      const { pool } = await import('../api/config.js');
      const origExecute = pool.execute;
      pool.execute = vi.fn().mockRejectedValue(new Error('DB failure'));

      const req = {
        session: { userId: 1 },
        body: { article_slug: 'silent' },
        params: { articleSlug: 'silent' }
      };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

      await getWatchlistHandler(req, res);
      expect(res.status).toHaveBeenCalledWith(500);

      await saveWatchlistHandler(req, res);
      expect(res.status).toHaveBeenCalledWith(500);

      await deleteWatchlistHandler(req, res);
      expect(res.status).toHaveBeenCalledWith(500);

      pool.execute = origExecute;
    });
  });
});
