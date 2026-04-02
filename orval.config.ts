import { defineConfig } from 'orval';

export default defineConfig({
  thinkeasy: {
    input: {
      target: './api-json.json',
    },
    output: {
      mode: 'tags-split',
      target: './src/api',
      schemas: './src/api/model',
      client: 'react-query',
      httpClient: 'fetch',
      override: {
        mutator: {
          path: './src/api/custom-fetch.ts',
          name: 'customFetch',
        },
      },
    },
  },
});
