// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  // 👇 Esta parte es la importante
  build: {
    rollupOptions: {
      input: '/index.html'
    }
  },
  // 👇 Esta línea permite que al recargar en cualquier ruta funcione
  resolve: {
    alias: {
      '/@': '/src'
    }
  }
});
