// vite.config.js
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(), // 在这里告诉 Vite 使用 Tailwind CSS 插件
  ],
})