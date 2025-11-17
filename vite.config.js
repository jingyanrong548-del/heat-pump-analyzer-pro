// vite.config.js (FINAL CORRECTED VERSION)
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  /**
   * base: 这是部署到 GitHub Pages 的关键配置。
   * 它的值必须是 "/你的GitHub仓库名/"。
   */
  base: '/heat-pump-analyzer-pro/',

  /**
   * plugins: 在这里使用我们之前安装的 @tailwindcss/vite 插件。
   * 这是集成 Tailwind CSS 最现代、最简单的方式。
   * 它会自动处理所有 PostCSS 相关的配置。
   */
  plugins: [
    tailwindcss(),
  ],
})