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
  },
  // 更新图片信息
  updateImageInfo: (imageData) => {
    return ipcRenderer.invoke('update-image-info', imageData);
  },
  // 获取保存的目录
  getSavedDirectories: () => {
    return new Promise((resolve) => {
      ipcRenderer.send('get-saved-directories');
      ipcRenderer.once('saved-directories', (event, directories) => {
        resolve(directories);
      });
    });
  },
  // 添加目录
  addDirectory: () => {
    return new Promise((resolve) => {
      ipcRenderer.send('select-directory');
      ipcRenderer.once('directory-selected', (event, path) => {
        resolve(path);
      });
    });
  },
  // 获取目录中的图片
  getImagesInDirectory: (directoryPath) => {
    return new Promise((resolve) => {
      ipcRenderer.send('get-images-in-directory', directoryPath);
      ipcRenderer.once('images-in-directory', (event, data) => {
        resolve(data);
      });
    });
  },
  // 移除目录
  removeDirectory: (directoryPath) => {
    return new Promise((resolve) => {
      ipcRenderer.send('remove-directory', directoryPath);
      ipcRenderer.once('saved-directories', (event, directories) => {
        resolve(directories);
      });
    });
  },
  // 获取目录图片数量
  getImageCountInDirectory: (directoryPath) => {
    return new Promise((resolve) => {
      ipcRenderer.send('get-image-count-in-directory', directoryPath);
      ipcRenderer.once('image-count-in-directory', (event, data) => {
        resolve(data);
      });
    });
  }
});