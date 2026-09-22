import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      thresholds: {
        statements: 75,
        lines: 75,
        functions: 75,
        branches: 65
      },
      exclude: [
        'api/config.js',
        'api/defaultArticles.js',
        'src/**',
        'tests/**'
      ]
    }
  }
});
