// src/renderer/vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './', // 确保构建后资源的相对路径正确
  build: {
    outDir: '../../dist/renderer', // 构建输出目录，相对于项目根目录
    emptyOutDir: true, // 构建前清空输出目录
    // 为Electron环境添加特殊处理
    rollupOptions: {
      external: ['electron'],
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 配置路径别名，方便导入
    },
  },
  server: {
    port: 5173, // Vite 开发服务器端口
  }
});