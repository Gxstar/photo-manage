const { ipcMain, dialog } = require('electron');
const StoreModule = require('electron-store');
const Store = StoreModule.default || StoreModule;
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const EXIF = require('exif-parser');
const { getImagesByDirectory, upsertImage, getDirectoryLastScanTime, updateDirectoryScanTime, getImageCountByDirectory } = require('./database');

// 读取图片EXIF信息的函数
async function readExifData(imagePath) {
  try {
    const buffer = fs.readFileSync(imagePath);
    const parser = EXIF.create(buffer);
    const result = parser.parse();
    
    // 获取图片的实际尺寸
    const imageSize = await sharp(imagePath).metadata();
    
    // 合并EXIF信息和图片尺寸
    const exifData = result.tags || {};
    if (imageSize.width && imageSize.height) {
      // 如果EXIF中没有图像尺寸信息，则使用实际尺寸
      exifData.ExifImageWidth = exifData.ExifImageWidth || imageSize.width;
      exifData.ExifImageHeight = exifData.ExifImageHeight || imageSize.height;
    }
    
    return exifData;
  } catch (error) {
    console.error(`Error reading EXIF data from ${imagePath}:`, error);
    return {};
  }
}

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
        
        // 触发图片扫描，将图片信息保存到数据库
        loadImagesFromFileSystemAndCache(event, selectedPath);
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

// 移除保存的目录
const handleRemoveDirectory = (event, directoryPath) => {
  try {
    let directories = store.get('directories', []);
    directories = directories.filter(dir => dir !== directoryPath);
    store.set('directories', directories);
    
    // 重新加载目录结构
    const directoryStructures = directories.map(dirPath => getDirectoryStructure(dirPath)).filter(Boolean);
    event.reply('saved-directories', directoryStructures);
  } catch (err) {
    console.error('移除目录失败:', err);
    event.reply('directory-removed', { success: false, error: '移除目录失败' });
  }
};

// 获取目录中的图片文件
const handleGetImagesInDirectory = (event, dirPath) => {
  try {
    // 检查目录是否存在
    if (!fs.existsSync(dirPath)) {
      event.reply('images-in-directory', { error: '目录不存在' });
      return;
    }
    
    // 首先尝试从数据库获取图片信息
    getImagesByDirectory(dirPath, (dbErr, dbImages) => {
      if (dbErr) {
        console.error('从数据库获取图片信息失败:', dbErr);
        // 如果数据库查询失败，回退到文件系统读取
        loadImagesFromFileSystem(event, dirPath);
        return;
      }
      
      // 如果数据库中有数据，直接返回
      if (dbImages && dbImages.length > 0) {
        event.reply('images-in-directory', { images: dbImages });
        return;
      }
      
      // 如果数据库中没有数据，从文件系统读取并保存到数据库
      loadImagesFromFileSystemAndCache(event, dirPath);
    });
  } catch (err) {
    console.error(`无法读取目录: ${dirPath}`, err);
    event.reply('images-in-directory', { error: '读取目录时出错' });
  }
};

// 监听获取图片EXIF信息的请求
ipcMain.handle('get-exif-data', async (event, imagePath) => {
  try {
    // 从数据库获取图片信息，包括EXIF数据
    return await new Promise((resolve) => {
      // 这里我们简单地通过解析路径来获取目录路径
      const dirPath = path.dirname(imagePath);
      getImagesByDirectory(dirPath, (err, images) => {
        if (err) {
          console.error('从数据库获取图片信息失败:', err);
          resolve({ error: '获取图片信息失败' });
        } else {
          // 查找特定图片的EXIF信息
          const image = images.find(img => img.path === imagePath);
          if (image && image.exif) {
            resolve({ exif: image.exif });
          } else {
            resolve({ error: '未找到图片的EXIF信息' });
          }
        }
      });
    });
  } catch (err) {
    console.error('处理获取EXIF信息请求时出错:', err);
    return { error: '处理请求时出错' };
  }
});

// 监听更新图片信息的请求
ipcMain.handle('update-image-info', async (event, imageData) => {
  try {
    // 更新图片信息到数据库
    return await new Promise((resolve) => {
      upsertImage(imageData, (err, id) => {
        if (err) {
          console.error('更新图片信息失败:', err);
          resolve({ success: false, error: '更新图片信息失败' });
        } else {
          resolve({ success: true, id });
        }
      });
    });
  } catch (err) {
    console.error('处理更新图片信息请求时出错:', err);
    return { success: false, error: '处理请求时出错' };
  }
});

// 监听获取目录图片数量的请求
// 已移除此功能

// 处理获取所有图片的请求
const handleGetAllImages = async (event) => {
  try {
    // 从数据库获取所有图片信息
    return await new Promise((resolve) => {
      const { getAllImages } = require('./database');
      getAllImages((err, images) => {
        if (err) {
          console.error('从数据库获取所有图片信息失败:', err);
          resolve({ error: '获取图片信息失败' });
        } else {
          resolve({ images });
        }
      });
    });
  } catch (err) {
    console.error('处理获取所有图片信息请求时出错:', err);
    return { error: '处理请求时出错' };
  }
};

// 监听获取所有图片的请求
ipcMain.handle('get-all-images', handleGetAllImages);

// 递归获取目录中的所有图片文件
const getAllImageFiles = (dirPath, imageFiles = []) => {
  try {
    // 读取目录内容
    const items = fs.readdirSync(dirPath);
    
    // 支持的图片扩展名
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    
    // 遍历目录中的所有项目
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      try {
        const stats = fs.statSync(itemPath);
        if (stats.isFile()) {
          // 检查是否为图片文件
          const ext = path.extname(item).toLowerCase();
          if (imageExtensions.includes(ext)) {
            imageFiles.push({
              name: item,
              path: itemPath,
              size: stats.size
            });
          }
        } else if (stats.isDirectory()) {
          // 递归扫描子目录
          getAllImageFiles(itemPath, imageFiles);
        }
      } catch (err) {
        console.warn(`无法访问项目: ${itemPath}`, err);
      }
    }
  } catch (err) {
    console.error(`无法读取目录: ${dirPath}`, err);
  }
  
  return imageFiles;
};

// 从文件系统加载图片信息
const loadImagesFromFileSystem = (event, dirPath) => {
  try {
    // 递归获取所有图片文件
    const imageFiles = getAllImageFiles(dirPath, []);
    
    event.reply('images-in-directory', { images: imageFiles });
  } catch (err) {
    console.error(`无法读取目录: ${dirPath}`, err);
    event.reply('images-in-directory', { error: '读取目录时出错' });
  }
};

// 从文件系统加载图片信息并缓存到数据库
const loadImagesFromFileSystemAndCache = async (event, dirPath) => {
  try {
    // 递归获取所有图片文件
    const imageFiles = getAllImageFiles(dirPath, []);
    
    // 记录需要保存到数据库的图片
    const imagesToCache = [...imageFiles];
    
    // 异步处理图片信息保存到数据库，避免阻塞主进程
    Promise.all(imagesToCache.map(imageData => 
        new Promise(async (resolve) => {
          // 读取原始图片的EXIF信息
          let exifData = {};
          try {
            exifData = await readExifData(imageData.path);
          } catch (exifErr) {
            console.warn(`读取EXIF信息失败: ${imageData.path}`, exifErr);
          }
          
          // 生成缩略图
          generateThumbnail(imageData.path, (err, thumbnailData, thumbWidth, thumbHeight) => {
            if (err) {
              console.error('生成缩略图失败:', err);
              // 即使缩略图生成失败，也保存基本信息和EXIF信息
              upsertImage({...imageData, thumbnail: null, width: exifData.ExifImageWidth || null, height: exifData.ExifImageHeight || null, exif: exifData}, (err) => {
                if (err) {
                  console.error('保存图片信息到数据库失败:', err);
                }
                resolve();
              });
            } else {
              // 获取文件的创建时间
              const { birthtime } = fs.statSync(imageData.path);
              
              // 使用EXIF中的尺寸信息，如果没有则使用sharp获取的原始图片尺寸
              const imageWidth = exifData.ExifImageWidth || null;
              const imageHeight = exifData.ExifImageHeight || null;
              
              // 保存包含缩略图、EXIF信息和新字段的完整信息
              upsertImage({
                ...imageData, 
                thumbnail: thumbnailData, 
                width: imageWidth, 
                height: imageHeight, 
                exif: exifData,
                rating: 0,
                tags: [],
                category: null,
                created_at: birthtime
              }, (err) => {
                if (err) {
                  console.error('保存图片信息到数据库失败:', err);
                }
                resolve();
              });
            }
          });
        })
      )).then(() => {
      event.reply('images-in-directory', { images: imageFiles });
    });
  } catch (err) {
    console.error(`无法读取目录: ${dirPath}`, err);
    event.reply('images-in-directory', { error: '读取目录时出错' });
  }
};

// 生成缩略图
const generateThumbnail = (imagePath, callback) => {
  // 检查文件是否存在
  if (!fs.existsSync(imagePath)) {
    callback(new Error('文件不存在'));
    return;
  }
  
  sharp(imagePath)
    .resize(200, 200, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer({ resolveWithObject: true })
    .then(({ data, info }) => {
      callback(null, data, info.width, info.height);
    })
    .catch(err => {
      console.warn(`生成缩略图失败: ${imagePath}`, err);
      callback(err);
    });
};

module.exports = {
  handleSelectDirectory,
  handleGetSavedDirectories,
  handleGetImagesInDirectory,
  handleRemoveDirectory,
  handleGetAllImages,
  // handleGetImageCountInDirectory,
  getDirectoryStructure,
  generateThumbnail
};