const directoryModule = require('./src/main/handlers/directory');

// 创建一个模拟的event对象来测试handleGetSavedDirectories
const mockEvent = {
  reply: (channel, data) => {
    console.log('Reply channel:', channel);
    console.log('Reply data:');
    console.log(JSON.stringify(data, null, 2));
  }
};

console.log('Testing handleGetSavedDirectories...');
directoryModule.handleGetSavedDirectories(mockEvent);