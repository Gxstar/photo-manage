// src/preload/index.js
const { contextBridge, ipcRenderer } = require('electron');

// 暴露一个安全的 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 示例：可以添加函数让 Vue 组件调用主进程的功能
  // 例如：sendNotification: (title, body) => ipcRenderer.send('show-notification', { title, body })
  // receiveFromMain: (callback) => ipcRenderer.on('some-event', (event, ...args) => callback(...args))
});