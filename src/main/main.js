// src/main/index.js
const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const url = require('url');

// 确定是否是开发模式
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
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

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // 处理选择目录请求
  ipcMain.on('select-directory', (event) => {
    dialog.showOpenDialog({
      properties: ['openDirectory'],
      filters: [
        { name: '所有文件夹', extensions: ['*'] }
      ]
    }).then((result) => {
      if (!result.canceled && result.filePaths.length > 0) {
        event.reply('directory-selected', result.filePaths[0]);
      } else {
        event.reply('directory-selected', null);
      }
    }).catch((err) => {
      console.error(err);
      event.reply('directory-selected', null);
    });
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});