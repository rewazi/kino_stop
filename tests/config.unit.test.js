import { describe, expect, it } from 'vitest';
import { validateCredentials } from '../api/config.js';

describe('validateCredentials', () => {
  it('accepts valid registration credentials', () => {
    expect(validateCredentials('Jaan', 'jaan@example.com', 'secret123', true)).toBeNull();
  });

  it('rejects short names during registration', () => {
    expect(validateCredentials('A', 'jaan@example.com', 'secret123', true)).toContain('Nimi');
  });

  it('rejects invalid email and short password', () => {
    expect(validateCredentials('Jaan', 'wrong-email', 'secret123')).toContain('e-posti');
    expect(validateCredentials('Jaan', 'jaan@example.com', '123')).toContain('Parool');
  });
});
