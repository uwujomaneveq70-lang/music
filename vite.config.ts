import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        tailwindcss({
          content: [
            path.resolve(__dirname, 'index.html'),
            path.resolve(__dirname, 'src/**/*.{js,ts,jsx,tsx}'),
          ],
          theme: {
            extend: {
              colors: {
                surface: {
                  DEFAULT: '#1e293b',
                  light: '#334155',
                  dark: '#0f172a',
                },
                accent: {
                  DEFAULT: '#22d3ee',
                  hover: '#67e8f9',
                },
              },
              animation: {
                'spin-slow': 'spin 8s linear infinite',
              },
            },
          },
          plugins: [],
        }),
        autoprefixer(),
      ],
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.svg', 'icons/icon-512.svg'],
      manifest: {
        name: 'FreeMusic - 免费音乐',
        short_name: 'FreeMusic',
        description: '免费正版音乐播放器，基于 Jamendo',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: 'icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' },
          { src: 'icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.jamendo\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'jamendo-api',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
          {
            urlPattern: /^https:\/\/.*\.storage\.jamendo\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'jamendo-audio',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
        ],
      },
    }),
  ],
})
