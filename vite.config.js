import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/users': 'http://localhost:4000',
      '/token': 'http://localhost:4000',
      '/rooms': 'http://localhost:4000',
      '/chat': 'http://localhost:4000',
      '/ws': {
        target: 'ws://localhost:4000',
        ws: true,
      },
    },
  },
});