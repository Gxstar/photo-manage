// src/main/index.js
const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

// 确定是否是开发模式
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  console.log('Creating window with preload script:', path.join(__dirname, '../preload/index.js'));
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: !isDev, // 开发模式下可以禁用以方便加载本地资源
    }
  });

  if (isDev) {
    // 在开发模式下，加载 Vite 开发服务器
    mainWindow.loadURL('http://localhost:5173'); // Vite 默认端口
    mainWindow.webContents.openDevTools(); // 打开开发者工具
  } else {
    // 在生产模式下，加载打包后的 Vue 应用
    mainWindow.loadFile(path.join(__dirname, '../../dist/renderer/index.html'));
  }
}

const { ipcMain } = require('electron');
const { handleSelectDirectory, handleGetSavedDirectories, handleGetImagesInDirectory, handleRemoveDirectory, handleGetAllImages } = require('./handlers/directory');
const { initDatabase } = require('./handlers/database');

app.whenReady().then(() => {
  createWindow();
  
  // 初始化数据库
  initDatabase();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // 处理选择目录请求
  ipcMain.on('select-directory', handleSelectDirectory);

  // 发送保存的目录到渲染进程
  ipcMain.on('get-saved-directories', handleGetSavedDirectories);
  
  // 处理获取目录中图片的请求
  ipcMain.on('get-images-in-directory', handleGetImagesInDirectory);
  
  // 处理移除目录请求
  ipcMain.on('remove-directory', handleRemoveDirectory);
  
  // 处理获取所有图片请求
  ipcMain.handle('get-all-images', handleGetAllImages);
  
  // 处理获取目录图片数量请求
  // 已移除此功能
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});