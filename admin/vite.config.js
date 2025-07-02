import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4002',
        changeOrigin: true,
        secure: false,
        ws: false,
        proxyTimeout: 0,
        timeout: 0,
        onProxyRes(proxyRes, req) {
          if (req.url && req.url.includes('/stream')) {
            proxyRes.headers['connection'] = 'keep-alive';
            proxyRes.headers['cache-control'] = 'no-cache';
            proxyRes.headers['content-type'] = 'text/event-stream';
          }
        }
      }
    },
    port: 5174,
    host: true
  }
})