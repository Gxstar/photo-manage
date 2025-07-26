<template>
  <div class="sidebar bg-white border-r border-gray-200 flex flex-col h-full">
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-primary rounded-button flex items-center justify-center">
          <i class="fas fa-camera text-white text-sm"></i>
        </div>
        <span class="font-['Pacifico'] text-xl text-gray-800">照片管理器</span>
      </div>
    </div>
    <div class="flex-1 overflow-y-auto py-4">
      <div class="px-4 space-y-1">
        <button class="w-full flex items-center space-x-3 px-3 py-2 rounded-button hover:bg-gray-100 text-left">
          <div class="icon-wrapper">
            <i class="fas fa-images text-gray-500"></i>
          </div>
          <span>全部照片</span>
        </button>
        <button class="w-full flex items-center space-x-3 px-3 py-2 rounded-button hover:bg-gray-100 text-left">
          <div class="icon-wrapper">
            <i class="fas fa-clock text-gray-500"></i>
          </div>
          <span>最近导入</span>
        </button>
        <button class="w-full flex items-center space-x-3 px-3 py-2 rounded-button hover:bg-gray-100 text-left">
          <div class="icon-wrapper">
            <i class="fas fa-star text-gray-500"></i>
          </div>
          <span>收藏夹</span>
        </button>
      </div>
      <div class="px-4 mt-6">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">本地目录</h3>
          <button class="text-primary hover:text-primary-dark" @click="addLocalDirectory">
            <i class="fas fa-folder-plus"></i>
          </button>
        </div>
        <div class="space-y-1">
          <button v-for="(dir, dirName) in directories" :key="dirName" class="w-full flex items-center space-x-3 px-3 py-2 rounded-button hover:bg-gray-100 text-left" @click="toggleDirectory(dirName)" v-if="dir">
            <div class="icon-wrapper">
              <i class="fas fa-folder text-gray-500"></i>
            </div>
            <span>{{ dirName }}</span>
            <i :class="{ 'fas fa-chevron-down': dir.expanded, 'fas fa-chevron-right': !dir.expanded }" class="ml-auto text-xs text-gray-400"></i>
          </button>
          <div v-for="(dir, dirName) in directories" :key="`subdir-${dirName}`" v-if="dir && dir.expanded" class="pl-8 space-y-1">
            <button v-for="subdir in dir.subdirectories" :key="subdir.name" class="w-full flex items-center space-x-3 px-3 py-2 rounded-button hover:bg-gray-100 text-left">
              <div class="icon-wrapper">
                <i class="fas fa-folder text-gray-500"></i>
              </div>
              <span>{{ subdir.name }}</span>
            </button>
          </div>
        </div>
      </div>
      <div class="px-4 mt-6">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">我的相册</h3>
          <button class="text-primary hover:text-primary-dark">
            <i class="fas fa-plus"></i>
          </button>
        </div>
        <div class="space-y-1">
          <button class="w-full flex items-center space-x-3 px-3 py-2 rounded-button hover:bg-gray-100 text-left">
            <div class="icon-wrapper">
              <i class="fas fa-mountain text-gray-500"></i>
            </div>
            <span>旅行记忆</span>
            <span class="ml-auto text-xs text-gray-400">128</span>
          </button>
          <button class="w-full flex items-center space-x-3 px-3 py-2 rounded-button hover:bg-gray-100 text-left">
            <div class="icon-wrapper">
              <i class="fas fa-utensils text-gray-500"></i>
            </div>
            <span>美食日记</span>
            <span class="ml-auto text-xs text-gray-400">56</span>
          </button>
          <button class="w-full flex items-center space-x-3 px-3 py-2 rounded-button hover:bg-gray-100 text-left">
            <div class="icon-wrapper">
              <i class="fas fa-birthday-cake text-gray-500"></i>
            </div>
            <span>生日派对</span>
            <span class="ml-auto text-xs text-gray-400">42</span>
          </button>
        </div>
      </div>
      <div class="px-4 mt-6">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">智能分类</h3>
        </div>
        <div class="space-y-1">
          <button class="w-full flex items-center space-x-3 px-3 py-2 rounded-button hover:bg-gray-100 text-left">
            <div class="icon-wrapper">
              <i class="fas fa-user text-gray-500"></i>
            </div>
            <span>人物</span>
          </button>
          <button class="w-full flex items-center space-x-3 px-3 py-2 rounded-button hover:bg-gray-100 text-left">
            <div class="icon-wrapper">
              <i class="fas fa-map-marker-alt text-gray-500"></i>
            </div>
            <span>地点</span>
          </button>
          <button class="w-full flex items-center space-x-3 px-3 py-2 rounded-button hover:bg-gray-100 text-left">
            <div class="icon-wrapper">
              <i class="fas fa-calendar-alt text-gray-500"></i>
            </div>
            <span>时间线</span>
          </button>
        </div>
      </div>
    </div>
    <div class="p-4 border-t border-gray-200">
      <button class="w-full flex items-center space-x-3 px-3 py-2 rounded-button hover:bg-gray-100 text-left">
        <div class="icon-wrapper">
          <i class="fas fa-cog text-gray-500"></i>
        </div>
        <span>设置</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 目录结构数据
const directories = ref({})

// 从后端加载目录结构
onMounted(async () => {
  // 检查electronAPI是否存在
  console.log('Checking for electronAPI...');
  console.log('Window object keys:', Object.keys(window));
  console.log('electronAPI:', window.electronAPI);
  
  if (!window.electronAPI) {
    console.error('electronAPI is not available. Make sure the preload script is properly configured.');
    console.error('Current window object:', window);
    return;
  }
  
  // 检查getSavedDirectories方法是否存在
  if (!window.electronAPI.getSavedDirectories) {
    console.error('getSavedDirectories method is not available on electronAPI');
    return;
  }
  
  // 从主进程获取保存的目录
  try {
    const savedDirs = await window.electronAPI.getSavedDirectories();
    if (savedDirs && Array.isArray(savedDirs)) {
      // 转换为所需格式
      directories.value = {};
      savedDirs.forEach(dirPath => {
        const dirName = window.path.basename(dirPath);
        directories.value[dirName] = {
          path: dirPath,
          expanded: false,
          subdirectories: []
        };
      });
    }
  } catch (error) {
    console.error('Failed to load saved directories:', error);
  }
})

// 切换目录展开状态
function toggleDirectory(directoryName) {
  directories.value[directoryName].expanded = !directories.value[directoryName].expanded
}

// 添加本地目录
function addLocalDirectory() {
  // 调用Electron的API选择目录
  window.electronAPI.selectDirectory().then(path => {
    if (path) {
      console.log('选择的目录:', path)
      // 提取目录名称
      const dirName = path.split('\\').pop()
      // 添加到目录结构
      directories.value[dirName] = {
        path: path,
        expanded: true,
        subdirectories: []
      }
    }
  })
}
</script>

<style scoped>
.sidebar {
  width: 280px;
}
.icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
}
</style>