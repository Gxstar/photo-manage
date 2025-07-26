<template>
  <div class="app-container flex h-screen bg-gray-50">
    <!-- 侧边栏 -->
    <Sidebar />
    <!-- 照片网格 -->
    <PhotoGrid />
    <!-- 信息面板 -->
    <InfoPanel />
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'
import PhotoGrid from './components/PhotoGrid.vue'
import InfoPanel from './components/InfoPanel.vue'

export default {
  name: 'App',
  components: {
    Sidebar,
    PhotoGrid,
    InfoPanel
  }
}
</script>

<style>
.app-container {
  width: 100%;
  overflow: hidden;
}
/* 全局样式 */
.rounded-button {
  border-radius: 6px;
}
</style>
