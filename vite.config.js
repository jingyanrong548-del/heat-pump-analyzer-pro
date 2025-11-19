import { defineConfig } from 'vite';

export default defineConfig({
  // Tailwind CSS v3 会通过 postcss.config.js 自动工作
  // 这里不需要配置任何 Tailwind 相关的插件
  server: {
    open: true, // 启动后自动打开浏览器
  }
});