const { ipcMain, dialog } = require('electron');
const StoreModule = require('electron-store');
const Store = StoreModule.default || StoreModule;
const fs = require('fs');
const path = require('path');

// 创建存储实例
const store = new Store({
  name: 'config',
  projectName: 'photo-manage',
  defaults: {
    directories: []
  }
});

const handleSelectDirectory = (event) => {
  dialog.showOpenDialog({
    properties: ['openDirectory'],
    filters: [
      { name: '所有文件夹', extensions: ['*'] }
    ]
  }).then((result) => {
    if (!result.canceled && result.filePaths.length > 0) {
      const selectedPath = result.filePaths[0];
      // 保存到存储中
      let directories = store.get('directories', []);
      if (!directories.includes(selectedPath)) {
        directories.push(selectedPath);
        store.set('directories', directories);
      }
      event.reply('directory-selected', selectedPath);
    } else {
      event.reply('directory-selected', null);
    }
  }).catch((err) => {
    console.error(err);
    event.reply('directory-selected', null);
  });
};

// 递归获取目录及其子目录结构
const getDirectoryStructure = (dirPath) => {
  try {
    const stats = fs.statSync(dirPath);
    if (!stats.isDirectory()) {
      return null;
    }
    
    const structure = {
      name: path.basename(dirPath),
      path: dirPath,
      subdirectories: []
    };
    
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      try {
        const itemStats = fs.statSync(itemPath);
        if (itemStats.isDirectory()) {
          const subStructure = getDirectoryStructure(itemPath);
          if (subStructure) {
            structure.subdirectories.push(subStructure);
          }
        }
      } catch (err) {
        // 忽略无法访问的子目录
        console.warn(`无法访问目录: ${itemPath}`, err);
      }
    }
    
    return structure;
  } catch (err) {
    console.error(`无法读取目录: ${dirPath}`, err);
    return null;
  }
};

const handleGetSavedDirectories = (event) => {
  const directories = store.get('directories', []);
  const directoryStructures = directories.map(dirPath => getDirectoryStructure(dirPath)).filter(Boolean);
  event.reply('saved-directories', directoryStructures);
};

module.exports = {
  handleSelectDirectory,
  handleGetSavedDirectories,
  getDirectoryStructure
};