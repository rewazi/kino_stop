import { describe, expect, it } from 'vitest';
import { validateCredentials } from '../api/config.js';

describe('validateCredentials', () => {
  it('accepts valid registration credentials', () => {
    expect(validateCredentials('Иван', 'ivan@example.com', 'secret123', true)).toBeNull();
  });

  it('rejects short names during registration', () => {
    expect(validateCredentials('A', 'ivan@example.com', 'secret123', true)).toContain('Имя');
  });

  it('rejects invalid email and short password', () => {
    expect(validateCredentials('Иван', 'wrong-email', 'secret123')).toContain('email');
    expect(validateCredentials('Иван', 'ivan@example.com', '123')).toContain('Пароль');
  });
});