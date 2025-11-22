import { defineConfig } from 'vite';

export default defineConfig({
  // [重要] 这里必须填写你的 GitHub 仓库名称，前后都要加斜杠
  // 根据你的截图，你的仓库名是 heat-pump-analyzer-pro
  base: '/heat-pump-analyzer-pro/', 
  
  server: {
    open: true,
  }
});