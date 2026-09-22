import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      thresholds: {
        statements: 60,
        lines: 60,
        functions: 60,
        branches: 50
      },
      exclude: [
        'api/config.js',
        'api/defaultArticles.js',
        'src/**'
      ]
    }
  }
});
