import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vue(),
      viteMockServe({
        mockPath: 'mock',
        enable: true,
        logger: true,
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // Use the modern Dart Sass API instead of the deprecated legacy JS API.
          // Silences the "[legacy-js-api]" deprecation warnings from Sass 2.0.
          api: 'modern-compiler',
        },
      },
    },
    server: {
      port: Number(env.VITE_PORT) || 9527,
      open: true,
    },
  }
})
