import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import vercel from 'vite-plugin-vercel';

export default defineConfig({
  plugins: [vue(), vercel()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Set the alias for `@` to the `src` directory
    },
  },
  build: {
    outDir: 'dist',  // Make sure this matches your Vercel expectations
  },
});