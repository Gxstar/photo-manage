// 测试子目录显示的脚本
const directoryModule = require('./src/main/handlers/directory');

// 创建一个模拟的事件对象，用于测试
const mockEvent = {
  reply: (channel, data) => {
    console.log('Reply channel:', channel);
    console.log('Reply data:', JSON.stringify(data, null, 2));
  }
};

// 测试handleGetSavedDirectories函数
console.log('Testing handleGetSavedDirectories...');
directoryModule.handleGetSavedDirectories(mockEvent);