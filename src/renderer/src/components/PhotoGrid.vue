<template>
  <div class="content flex flex-col h-full">
    <!-- 顶部工具栏 -->
    <div class="bg-white border-b border-gray-200 p-3 flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <button class="px-3 py-1.5 rounded-button hover:bg-gray-100 flex items-center space-x-2">
          <i class="fas fa-th-large text-gray-500"></i>
          <span>网格视图</span>
        </button>
        <button class="px-3 py-1.5 rounded-button hover:bg-gray-100 flex items-center space-x-2">
          <i class="fas fa-list text-gray-500"></i>
          <span>列表视图</span>
        </button>
      </div>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <input type="text" placeholder="搜索照片..." class="pl-9 pr-4 py-1.5 border border-gray-300 rounded-button focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm w-64">
          <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
        <div class="flex items-center space-x-2">
          <button class="px-3 py-1.5 rounded-button hover:bg-gray-100 flex items-center space-x-2">
            <i class="fas fa-sort-amount-down text-gray-500"></i>
            <span>按日期</span>
          </button>
          <button class="px-3 py-1.5 rounded-button hover:bg-gray-100 flex items-center space-x-2">
            <i class="fas fa-filter text-gray-500"></i>
            <span>筛选</span>
          </button>
        </div>
      </div>
    </div>
    <!-- 照片网格 -->
    <div class="flex-1 overflow-y-auto p-6">
      <div class="photo-grid grid gap-4">
        <div class="photo-thumbnail bg-white rounded-button overflow-hidden border border-gray-200 hover:border-primary cursor-pointer relative group">
          <img src="https://ai-public.mastergo.com/ai/img_res/e3190f9763ffce64822cb32d37277258.jpg"
               class="w-full h-full object-cover" alt="照片">
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200"></div>
          <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <button class="bg-white p-1 rounded-full shadow-sm">
              <i class="fas fa-star text-gray-400 hover:text-yellow-400"></i>
            </button>
          </div>
        </div>
        <div class="photo-thumbnail bg-white rounded-button overflow-hidden border border-gray-200 hover:border-primary cursor-pointer relative group">
          <img src="https://ai-public.mastergo.com/ai/img_res/ca0281e8c672d8a21479dc481fa7a22f.jpg"
               class="w-full h-full object-cover" alt="照片">
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200"></div>
          <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <button class="bg-white p-1 rounded-full shadow-sm">
              <i class="fas fa-star text-gray-400 hover:text-yellow-400"></i>
            </button>
          </div>
        </div>
        <div class="photo-thumbnail bg-white rounded-button overflow-hidden border border-gray-200 hover:border-primary cursor-pointer relative group">
          <img src="https://ai-public.mastergo.com/ai/img_res/bc8152173a3b4c196e43f4437c19c380.jpg"
               class="w-full h-full object-cover" alt="照片">
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200"></div>
          <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <button class="bg-white p-1 rounded-full shadow-sm">
              <i class="fas fa-star text-gray-400 hover:text-yellow-400"></i>
            </button>
          </div>
        </div>
        <div class="photo-thumbnail bg-white rounded-button overflow-hidden border border-gray-200 hover:border-primary cursor-pointer relative group">
          <img src="https://ai-public.mastergo.com/ai/img_res/6708234212a52f45b15b0ee7fc6cef49.jpg"
               class="w-full h-full object-cover" alt="照片">
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200"></div>
          <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <button class="bg-white p-1 rounded-full shadow-sm">
              <i class="fas fa-star text-gray-400 hover:text-yellow-400"></i>
            </button>
          </div>
        </div>
        <div class="photo-thumbnail bg-white rounded-button overflow-hidden border border-gray-200 hover:border-primary cursor-pointer relative group">
          <img src="https://ai-public.mastergo.com/ai/img_res/e00afc85e24ab4a2d63652cee4c3910a.jpg"
               class="w-full h-full object-cover" alt="照片">
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200"></div>
          <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <button class="bg-white p-1 rounded-full shadow-sm">
              <i class="fas fa-star text-gray-400 hover:text-yellow-400"></i>
            </button>
          </div>
        </div>
        <div class="photo-thumbnail bg-white rounded-button overflow-hidden border border-gray-200 hover:border-primary cursor-pointer relative group">
          <img src="https://ai-public.mastergo.com/ai/img_res/7e44e1e4a813123bed84277d8ecf3111.jpg"
               class="w-full h-full object-cover" alt="照片">
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200"></div>
          <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <button class="bg-white p-1 rounded-full shadow-sm">
              <i class="fas fa-star text-gray-400 hover:text-yellow-400"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content {
  width: calc(100% - 280px - 320px);
}
.photo-grid {
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
}
.photo-thumbnail {
  aspect-ratio: 1/1;
}
</style>