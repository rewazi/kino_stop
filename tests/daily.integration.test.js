import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../server.js';
import { curatedChallenges, getTodayChallengeIndex } from '../api/daily.js';

describe('Kaader Päevas & Kinoarhetüübi testi API integratsioonitestid', () => {
  describe('GET /api/daily', () => {
    it('tagastab tänase päeva kaadri andmed ja vihjed', async () => {
      const res = await request(app).get('/api/daily');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('dayNumber');
      expect(res.body).toHaveProperty('date');
      expect(res.body).toHaveProperty('image');
      expect(res.body.maxAttempts).toBe(5);
      expect(Array.isArray(res.body.hints)).toBe(true);
      expect(res.body.hints.length).toBe(4);
      expect(Array.isArray(res.body.allTitles)).toBe(true);
      expect(res.body.allTitles.length).toBeGreaterThan(5);
    });
  });

  describe('POST /api/daily/guess', () => {
    it('tagastab isCorrect: false vale pakkumise korral', async () => {
      const res = await request(app)
        .post('/api/daily/guess')
        .send({ guess: 'Täiesti Suvaline Film 1999' });

      expect(res.status).toBe(200);
      expect(res.body.isCorrect).toBe(false);
      expect(res.body.message).toContain('Vale vastus');
    });

    it('tagastab isCorrect: true õige pakkumise korral koos filmi detailidega', async () => {
      const todayIndex = getTodayChallengeIndex();
      const currentChallenge = curatedChallenges[todayIndex];

      const res = await request(app)
        .post('/api/daily/guess')
        .send({ guess: currentChallenge.title });

      expect(res.status).toBe(200);
      expect(res.body.isCorrect).toBe(true);
      expect(res.body.title).toBe(currentChallenge.title);
      expect(res.body.year).toBe(currentChallenge.year);
      expect(res.body.director).toBe(currentChallenge.director);
      expect(res.body.message).toContain('Õige!');
    });
  });

  describe('GET /api/quiz', () => {
    it('tagastab küsimustiku ja arhetüüpide definitsioonid', async () => {
      const res = await request(app).get('/api/quiz');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.questions)).toBe(true);
      expect(res.body.questions.length).toBe(5);

      // Kontrollime küsimuste struktuuri
      for (const q of res.body.questions) {
        expect(q).toHaveProperty('id');
        expect(q).toHaveProperty('text');
        expect(Array.isArray(q.options)).toBe(true);
        expect(q.options.length).toBe(4);
        for (const opt of q.options) {
          expect(opt).toHaveProperty('text');
          expect(opt).toHaveProperty('archetype');
        }
      }

      // Kontrollime arhetüüpe
      expect(res.body).toHaveProperty('archetypes');
      const expectedKeys = ['nouvelle', 'expressionist', 'pioneer', 'maestro'];
      for (const key of expectedKeys) {
        expect(res.body.archetypes).toHaveProperty(key);
        const arch = res.body.archetypes[key];
        expect(arch).toHaveProperty('title');
        expect(arch).toHaveProperty('subtitle');
        expect(arch).toHaveProperty('motto');
        expect(arch).toHaveProperty('description');
        expect(Array.isArray(arch.strengths)).toBe(true);
      }
    });
  });
});
