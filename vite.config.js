import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base:process.env.NODE_ENV === 'production'
  ? 'https://micros.uz/it/solutions_our/micros.tech.support/app/dist/'
  : '',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 2004,
    proxy: {
      '/proxy': {
        target: 'https://micros.uz',
        changeOrigin: true,
        rewrite: function (path, req) {
          // const target = req.headers['x-target'] || 'https://micros.uz'; // Если x-target заголовок установлен, используем его
          return path.replace(/^\/proxy\//, '/'); // Удаляем "/proxy/" из пути
        }
      },
      '/check-image': {
        target: 'https://cp.micros.uz',
        changeOrigin: true,
        rewrite: function (path, req) {
          return path.replace(/^\/check-image\//, '/'); // Удаляем "/proxy/" из пути
        }
      },
    },
  },
})
