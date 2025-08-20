import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'fs';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        https: {
            key: fs.readFileSync(path.resolve(__dirname, 'localhost-key.pem')),
            cert: fs.readFileSync(path.resolve(__dirname, 'localhost.pem')),
        },
        host: 'localhost',
    },
    build: {
        rollupOptions: {
            input: '/index.html',
        },
    },
    resolve: {
        alias: {
            '/@': '/src',
        },
    },
})
