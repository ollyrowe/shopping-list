import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: '/shopping-list/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png', 'assets/*'],
      manifest: {
        name: 'Shopping List',
        short_name: 'Shopping List',
        description: 'A shopping list app',
        theme_color: '#ffffff',
        start_url: '/shopping-list/',
        icons: [
          {
            src: '/shopping-list/favicon.ico',
            sizes: '48x48',
            type: 'image/x-icon',
          },
          {
            src: '/shopping-list/web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/shopping-list/web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        // Serve the index.html for all navigation requests
        navigateFallback: '/shopping-list/index.html',
        runtimeCaching: [
          {
            urlPattern: /^\/shopping-list\/.*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache',
            },
          },
          {
            urlPattern: ({ request }) =>
              request.destination === 'script' ||
              request.destination === 'style' ||
              request.destination === 'worker',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'asset-cache',
            },
          },
        ],
      },
    }),
    tsconfigPaths(),
    checker({
      typescript: { tsconfigPath: './tsconfig.app.json' },
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
