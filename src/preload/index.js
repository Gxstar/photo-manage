// src/preload/index.js
const { contextBridge, ipcRenderer } = require('electron');

// 暴露一个安全的 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 选择目录
  selectDirectory: () => {
    return new Promise((resolve) => {
      ipcRenderer.send('select-directory');
      ipcRenderer.once('directory-selected', (event, path) => {
        resolve(path);
      });
    });
  }
});