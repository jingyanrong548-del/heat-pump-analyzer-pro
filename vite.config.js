import { defineConfig } from 'vite';

export default defineConfig({
  // [关键修改] 必须填您的仓库名称，前后都要加斜杠
  base: '/heat-pump-analyzer-pro/', 
  
  server: {
    open: true,
  }
});