const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 数据库文件路径
const dbPath = path.join(process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + '/.local/share'), 'photo-manage', 'photos.db');

// 创建数据库连接
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('连接数据库失败:', err.message);
  } else {
    console.log('成功连接到SQLite数据库');
    
    // 查询图片数据
    db.all('SELECT path FROM images LIMIT 10', (err, rows) => {
      if (err) {
        console.error('查询失败:', err.message);
      } else {
        console.log('图片数据 (前10条):');
        rows.forEach((row, index) => {
          console.log(`${index + 1}. ${row.path}`);
        });
      }
      
      // 查询目录数据
      db.all('SELECT * FROM directories', (err, rows) => {
        if (err) {
          console.error('查询目录失败:', err.message);
        } else {
          console.log('目录数据:');
          if (rows.length === 0) {
            console.log('  没有目录数据');
          } else {
            rows.forEach((row, index) => {
              console.log(`${index + 1}. 路径: ${row.path}, 最后扫描时间: ${row.last_scanned}`);
            });
          }
        }
        
        // 查询所有图片的目录路径
        db.all('SELECT DISTINCT path FROM images', (err, rows) => {
          if (err) {
            console.error('查询图片路径失败:', err.message);
          } else {
            console.log('所有图片的目录路径:');
            const directories = new Set();
            rows.forEach(row => {
              // 提取目录路径
              const dirPath = path.dirname(row.path);
              directories.add(dirPath);
            });
            
            console.log('提取的目录:');
            Array.from(directories).forEach((dir, index) => {
              console.log(`${index + 1}. ${dir}`);
            });
          }
          
          // 关闭数据库连接
          db.close();
        });
      });
    });
  }
});