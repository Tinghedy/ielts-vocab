import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' 讓 build 出來的檔案可以放在任何子路徑（例如 GitHub Pages）
export default defineConfig({
  base: './',
  plugins: [react()],
});
