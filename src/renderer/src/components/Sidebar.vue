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
          <button class="w-full flex items-center space-x-3 px-3 py-2 rounded-button hover:bg-gray-100 text-left" @click="toggleDirectory('myPictures')">
            <div class="icon-wrapper">
              <i class="fas fa-folder text-gray-500"></i>
            </div>
            <span>我的图片</span>
            <i :class="{ 'fas fa-chevron-down': directories.myPictures.expanded, 'fas fa-chevron-right': !directories.myPictures.expanded }" class="ml-auto text-xs text-gray-400"></i>
          </button>
          <div v-if="directories.myPictures.expanded" class="pl-8 space-y-1">
            <button v-for="subdir in directories.myPictures.subdirectories" :key="subdir.name" class="w-full flex items-center space-x-3 px-3 py-2 rounded-button hover:bg-gray-100 text-left">
              <div class="icon-wrapper">
                <i class="fas fa-folder text-gray-500"></i>
              </div>
              <span>{{ subdir.name }}</span>
            </button>
          </div>
          <button class="w-full flex items-center space-x-3 px-3 py-2 rounded-button hover:bg-gray-100 text-left" @click="toggleDirectory('cameraImport')">
            <div class="icon-wrapper">
              <i class="fas fa-folder text-gray-500"></i>
            </div>
            <span>相机导入</span>
            <i :class="{ 'fas fa-chevron-down': directories.cameraImport.expanded, 'fas fa-chevron-right': !directories.cameraImport.expanded }" class="ml-auto text-xs text-gray-400"></i>
          </button>
          <div v-if="directories.cameraImport.expanded" class="pl-8 space-y-1">
            <button v-for="subdir in directories.cameraImport.subdirectories" :key="subdir.name" class="w-full flex items-center space-x-3 px-3 py-2 rounded-button hover:bg-gray-100 text-left">
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
const directories = ref({
  myPictures: {
    expanded: true,
    subdirectories: [
      { name: '2023' },
      { name: '2022' }
    ]
  },
  cameraImport: {
    expanded: true,
    subdirectories: [
      { name: '佳能 EOS R5' },
      { name: 'iPhone 14 Pro' }
    ]
  }
})

// 从后端加载目录结构
onMounted(() => {
  // 这里应该从后端数据库加载目录结构
  // 为了演示，我们使用硬编码的数据
  console.log('加载目录结构')
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
      // 这里应该将目录路径保存到后端数据库
      // 然后更新前端目录结构
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