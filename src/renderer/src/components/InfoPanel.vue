<template>
  <div class="info-panel w-[320px] bg-white border-l border-gray-200 h-full flex flex-col">
    <!-- 照片预览 -->
    <div class="p-4 border-b border-gray-200">
      <img src="https://ai-public.mastergo.com/ai/img_res/e3190f9763ffce64822cb32d37277258.jpg"
           class="w-full h-48 object-cover rounded-button" alt="照片预览">
    </div>
    <!-- 照片信息 -->
    <div class="p-4 border-b border-gray-200 flex flex-col space-y-3">
      <div>
        <h3 class="text-sm font-medium text-gray-500">文件名</h3>
        <p class="font-medium">sunsetMountains_2023.jpg</p>
      </div>
      <div>
        <h3 class="text-sm font-medium text-gray-500">拍摄日期</h3>
        <p>2023年7月15日 16:23</p>
      </div>
      <div>
        <h3 class="text-sm font-medium text-gray-500">文件类型</h3>
        <p>JPEG</p>
      </div>
      <div>
        <h3 class="text-sm font-medium text-gray-500">文件大小</h3>
        <p>3.2 MB</p>
      </div>
      <div>
        <h3 class="text-sm font-medium text-gray-500">尺寸</h3>
        <p>4000 × 3000</p>
      </div>
      <div>
        <h3 class="text-sm font-medium text-gray-500">拍摄地点</h3>
        <p>中国 黄山</p>
      </div>
      <div>
        <h3 class="text-sm font-medium text-gray-500">相机信息</h3>
        <p>Canon EOS R5 | 18-112mm | f8.0 | 1/100</p>
      </div>
    </div>
    <!-- 快速操作 -->
    <div class="p-4 border-b border-gray-200">
      <h3 class="font-medium mb-3">快速操作</h3>
      <div class="flex flex-col space-y-2">
        <button class="w-full py-2 rounded-button bg-white border border-gray-200 hover:border-primary hover:bg-primary/5 flex items-center justify-center space-x-2 transition-colors duration-200">
          <i class="fas fa-edit text-gray-500"></i>
          <span>编辑</span>
        </button>
        <button class="w-full py-2 rounded-button bg-white border border-gray-200 hover:border-primary hover:bg-primary/5 flex items-center justify-center space-x-2 transition-colors duration-200">
          <i class="fas fa-share-alt text-gray-500"></i>
          <span>分享</span>
        </button>
        <button class="w-full py-2 rounded-button bg-white border border-gray-200 hover:border-primary hover:bg-primary/5 flex items-center justify-center space-x-2 transition-colors duration-200">
          <i class="fas fa-trash-alt text-gray-500"></i>
          <span>删除</span>
        </button>
        <button class="w-full py-2 rounded-button bg-white border border-gray-200 hover:border-primary hover:bg-primary/5 flex items-center justify-center space-x-2 transition-colors duration-200">
          <i class="fas fa-tags text-gray-500"></i>
          <span>标签</span>
        </button>
      </div>
    </div>
    <!-- 应用标签 -->
    <div class="flex-1 overflow-y-auto p-4">
      <h3 class="font-medium mb-3">应用标签</h3>
      <div class="flex flex-wrap gap-2 mb-4">
        <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center space-x-1 cursor-pointer hover:bg-primary/20 transition-colors duration-200">
          <span>旅行记忆</span>
          <i class="fas fa-times-circle"></i>
        </span>
        <span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm flex items-center space-x-1 cursor-pointer hover:bg-gray-200 transition-colors duration-200">
          <span>美景日记</span>
          <i class="fas fa-times-circle"></i>
        </span>
        <span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm flex items-center space-x-1 cursor-pointer hover:bg-gray-200 transition-colors duration-200">
          <span>生活记录</span>
          <i class="fas fa-times-circle"></i>
        </span>
      </div>
      <button class="w-full py-2 rounded-button bg-white border border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 flex items-center justify-center space-x-2 transition-colors duration-200">
        <i class="fas fa-plus text-gray-400"></i>
        <span>新建相册</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.info-panel {
  flex-shrink: 0;
}
</style>