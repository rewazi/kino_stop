import { describe, expect, it } from 'vitest';
import { publicUser, validateCredentials } from '../api/config.js';

describe('Konfiguratsiooni ja valideerimise ühiktestid (config.unit)', () => {
  describe('validateCredentials', () => {
    it('aktsepteerib kehtivad andmed registreerimisel', () => {
      expect(validateCredentials('Mari Maasikas', 'mari@example.ee', 'salasona123', true)).toBeNull();
    });

    it('aktsepteerib piiripealseid nimepikkusi (2 ja 80 märki)', () => {
      expect(validateCredentials('AB', 'ab@example.ee', 'parool1', true)).toBeNull();
      expect(validateCredentials('A'.repeat(80), 'ab@example.ee', 'parool1', true)).toBeNull();
    });

    it('lükkab tagasi liiga lühikese või pika nime registreerimisel', () => {
      expect(validateCredentials('A', 'user@example.ee', 'parool1', true)).toBe('Nimi peab olema 2–80 tähemärki pikk.');
      expect(validateCredentials('A'.repeat(81), 'user@example.ee', 'parool1', true)).toBe('Nimi peab olema 2–80 tähemärki pikk.');
    });

    it('ignoreerib nime pikkust, kui isRegistration = false', () => {
      expect(validateCredentials('A', 'user@example.ee', 'parool1', false)).toBeNull();
      expect(validateCredentials('', 'user@example.ee', 'parool1', false)).toBeNull();
    });

    it('kontrollib e-posti formaadi korrektsust', () => {
      expect(validateCredentials('Jüri', 'vigane-epost', 'parool1', true)).toBe('Sisestage kehtiv e-posti aadress.');
      expect(validateCredentials('Jüri', 'vale@ilma-punktita', 'parool1', true)).toBe('Sisestage kehtiv e-posti aadress.');
      expect(validateCredentials('Jüri', 'tyhik epost@mail.ee', 'parool1', true)).toBe('Sisestage kehtiv e-posti aadress.');
      expect(validateCredentials('Jüri', '', 'parool1', true)).toBe('Sisestage kehtiv e-posti aadress.');
    });

    it('kontrollib parooli miinimumpikkust (vähemalt 6 märki)', () => {
      expect(validateCredentials('Jüri', 'juri@example.ee', '12345', true)).toBe('Parool peab sisaldama vähemalt 6 tähemärki.');
      expect(validateCredentials('Jüri', 'juri@example.ee', '123456', true)).toBeNull();
    });
  });

  describe('publicUser', () => {
    it('tagastab ainult avalikud väljad ega avalda parooliräsi', () => {
      const dbUser = {
        id: 42,
        name: 'Kodanik',
        email: 'kodanik@filmisfaar.local',
        password_hash: '$2a$12$secretHashValue',
        role: 'admin',
        extraField: 'secret'
      };

      const result = publicUser(dbUser);
      expect(result).toEqual({
        id: 42,
        name: 'Kodanik',
        email: 'kodanik@filmisfaar.local',
        role: 'admin'
      });
      expect(result.password_hash).toBeUndefined();
      expect(result.extraField).toBeUndefined();
    });

    it('määrab vaikimisi rolliks "user", kui roll puudub', () => {
      const userWithoutRole = { id: 7, name: 'Kasutaja', email: 'k@mail.ee' };
      expect(publicUser(userWithoutRole).role).toBe('user');
    });
  });
});
