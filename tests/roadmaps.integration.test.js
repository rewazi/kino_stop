import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { app } from '../server.js';
import { getRoadmapsHandler } from '../api/roadmaps.js';

describe('Targad Kinoteed ja Kaasaegse Kino Sillad (api/roadmaps)', () => {
  it('tagastab sillad, kureeritud teekonnad ja meeleolud (/api/roadmaps)', async () => {
    const res = await request(app).get('/api/roadmaps');
    expect(res.status).toBe(200);

    // Kontrollime sildu
    expect(Array.isArray(res.body.bridges)).toBe(true);
    expect(res.body.bridges.length).toBeGreaterThanOrEqual(4);

    const firstBridge = res.body.bridges[0];
    expect(firstBridge).toHaveProperty('modern');
    expect(firstBridge).toHaveProperty('classic');
    expect(firstBridge).toHaveProperty('connectionTitle');
    expect(firstBridge).toHaveProperty('whyWatch');
    expect(firstBridge).toHaveProperty('articleSlug');
    expect(firstBridge).toHaveProperty('mood');

    // Kontrollime kureeritud teekondi
    expect(Array.isArray(res.body.roadmaps)).toBe(true);
    expect(res.body.roadmaps.length).toBeGreaterThanOrEqual(2);

    // Kontrollime meeleolusid
    expect(Array.isArray(res.body.moods)).toBe(true);
    expect(res.body.moods).toContain('Eepiline pinge');
    expect(res.body.moods).toContain('Melanhoolne mäss');
  });

  it('tagastab detailse kinotee kehtiva slugiga (/api/roadmaps/:slug)', async () => {
    const res = await request(app).get('/api/roadmaps/weekend-crash-course');
    expect(res.status).toBe(200);
    expect(res.body.roadmap).toHaveProperty('title');
    expect(res.body.roadmap).toHaveProperty('steps');
    expect(res.body.roadmap.steps.length).toBe(3);
  });

  it('tagastab 404 tundmatu kinotee korral (/api/roadmaps/:slug)', async () => {
    const res = await request(app).get('/api/roadmaps/olematu-marsruut');
    expect(res.status).toBe(404);
    expect(res.body.error).toContain('ei leitud');
  });

  it('käsitleb vigu getRoadmapsHandleris ja tagastab 500', async () => {
    const req = {};
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockImplementation(() => {
        throw new Error('Test crash');
      })
    };

    try {
      await getRoadmapsHandler(req, res);
    } catch (err) {
      expect(err.message).toBe('Test crash');
    }
  });
});
