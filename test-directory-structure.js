const path = require('path');
const directoryModule = require('./src/main/handlers/directory');

// 测试目录路径
const testDir = path.join(__dirname, 'test-directories');

console.log('Testing directory structure for:', testDir);
const structure = directoryModule.getDirectoryStructure(testDir);
console.log('Directory structure:');
console.log(JSON.stringify(structure, null, 2));