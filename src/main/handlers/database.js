const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// 数据库文件路径
const dbPath = path.join(process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + '/.local/share'), 'photo-manage', 'photos.db');

// 确保数据库目录存在
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// 创建数据库连接
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('连接数据库失败:', err.message);
  } else {
    console.log('成功连接到SQLite数据库');
  }
});

// 初始化数据库表
const initDatabase = () => {
  // 创建图片信息表
  db.run(`CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    path TEXT UNIQUE NOT NULL,
    size INTEGER,
    thumbnail BLOB,
    width INTEGER,
    height INTEGER,
    exif TEXT,
    rating INTEGER DEFAULT 0,
    tags TEXT,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('创建images表失败:', err.message);
    } else {
      console.log('成功创建images表');
    }
  });
  
  // 创建目录信息表
  db.run(`CREATE TABLE IF NOT EXISTS directories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT UNIQUE NOT NULL,
    last_scanned DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('创建directories表失败:', err.message);
    } else {
      console.log('成功创建directories表');
    }
  });
};

// 插入或更新图片信息
const upsertImage = (imageData, callback) => {
  const sql = `INSERT OR REPLACE INTO images (name, path, size, thumbnail, width, height, exif, rating, tags, category) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [
    imageData.name, 
    imageData.path, 
    imageData.size, 
    imageData.thumbnail, 
    imageData.width, 
    imageData.height, 
    JSON.stringify(imageData.exif),
    imageData.rating || 0,
    JSON.stringify(imageData.tags) || null,
    imageData.category || null
  ];
  
  db.run(sql, params, function(err) {
    callback(err, this ? this.lastID : null);
  });
};

// 获取目录中的所有图片
const getImagesByDirectory = (directoryPath, callback) => {
  // 使用LIKE操作符匹配目录下的所有图片
  const sql = `SELECT id, name, path, size, width, height, exif, rating, tags, category FROM images 
               WHERE path LIKE ? 
               ORDER BY name`;
  const params = [directoryPath.replace(/\\/g, '/') + '/%'];
  
  db.all(sql, params, (err, rows) => {
    // 解析EXIF数据和标签数据
    if (rows) {
      rows = rows.map(row => {
        if (row.exif) {
          try {
            row.exif = JSON.parse(row.exif);
          } catch (e) {
            console.warn('解析EXIF数据失败:', e);
            row.exif = null;
          }
        }
        if (row.tags) {
          try {
            row.tags = JSON.parse(row.tags);
          } catch (e) {
            console.warn('解析标签数据失败:', e);
            row.tags = [];
          }
        } else {
          row.tags = [];
        }
        return row;
      });
    }
    callback(err, rows);
  });
};

// 更新目录扫描时间
const updateDirectoryScanTime = (directoryPath, callback) => {
  const sql = `INSERT OR REPLACE INTO directories (path, last_scanned) 
               VALUES (?, CURRENT_TIMESTAMP)`;
  const params = [directoryPath];
  
  db.run(sql, params, function(err) {
    callback(err, this ? this.lastID : null);
  });
};

// 获取目录最后扫描时间
const getDirectoryLastScanTime = (directoryPath, callback) => {
  const sql = `SELECT last_scanned FROM directories WHERE path = ?`;
  const params = [directoryPath];
  
  db.get(sql, params, (err, row) => {
    callback(err, row ? row.last_scanned : null);
  });
};

// 导出函数
module.exports = {
  initDatabase,
  upsertImage,
  getImagesByDirectory,
  updateDirectoryScanTime,
  getDirectoryLastScanTime
};