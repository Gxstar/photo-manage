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
    <div class="flex-1 overflow-y-auto p-6" ref="photoGrid">
      <div v-if="loading" class="text-center py-4">
        <p>正在加载图片...</p>
      </div>
      <div v-else-if="error" class="text-center py-4 text-red-500">
        <p>{{ error }}</p>
      </div>
      <div v-else class="photo-grid grid gap-4">
        <div 
          v-for="image in displayedImages" 
          :key="image.path" 
          class="photo-thumbnail bg-white rounded-button overflow-hidden border border-gray-200 hover:border-primary cursor-pointer relative group"
          @click="selectImage(image)"
        >
          <img 
            v-if="image.thumbnail" 
            :src="`data:image/jpeg;base64,${image.thumbnail}`" 
            class="w-full h-full object-cover" 
            :alt="image.name"
          >
          <img 
            v-else
            :src="`file://${image.path}`" 
            class="w-full h-full object-cover" 
            :alt="image.name"
          >
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200"></div>
          <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <button class="bg-white p-1 rounded-full shadow-sm">
              <i class="fas fa-star text-gray-400 hover:text-yellow-400"></i>
            </button>
          </div>
        </div>
      </div>
      <!-- 加载更多按钮 -->
      <div v-if="hasMoreImages && !loading" class="text-center py-4">
        <button @click="loadMore" class="px-4 py-2 bg-primary text-white rounded-button hover:bg-primary-dark">
          加载更多
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PhotoGrid',
  props: {
    directoryPath: {
      type: String,
      default: ''
    },
    hasInfoPanel: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      images: [],
      displayedImages: [],
      loading: false,
      error: null,
      currentPage: 0,
      pageSize: 50  // 每页显示50张图片
    };
  },
  watch: {
    directoryPath: {
      handler(newPath) {
        this.loadImages(newPath);
      },
      immediate: true
    }
  },
  methods: {
    async loadImages(directoryPath) {
      // 如果没有选择目录，清空图片列表
      if (!directoryPath) {
        this.images = [];
        this.displayedImages = [];
        this.loading = false;
        this.error = null;
        this.currentPage = 0;
        return;
      }
      
      // 开始加载
      this.loading = true;
      this.error = null;
      
      try {
        // 检查electronAPI是否存在
        if (!window.electronAPI || !window.electronAPI.getImagesInDirectory) {
          throw new Error('electronAPI或getImagesInDirectory方法不可用');
        }
        
        // 从主进程获取图片
        const result = await window.electronAPI.getImagesInDirectory(directoryPath);
        
        // 检查是否有错误
        if (result.error) {
          throw new Error(result.error);
        }
        
        // 更新图片列表，并处理缩略图数据
        this.images = (result.images || []).map(image => ({
          ...image,
          thumbnail: image.thumbnail ? image.thumbnail.toString('base64') : null
        }));
        
        // 重置分页
        this.currentPage = 0;
        this.loadMore();
      } catch (err) {
        console.error('加载图片时出错:', err);
        this.error = err.message || '加载图片时出错';
        this.images = [];
        this.displayedImages = [];
      } finally {
        this.loading = false;
      }
    },
    async selectImage(image) {
      // 获取EXIF信息
      let exifData = null;
      try {
        if (window.electronAPI && window.electronAPI.getExifData) {
          const result = await window.electronAPI.getExifData(image.path);
          if (!result.error) {
            exifData = result.exif;
          }
        }
      } catch (err) {
        console.error('获取EXIF信息时出错:', err);
      }
      
      // 发射事件，将选中的图片信息和EXIF信息传递给父组件
      this.$emit('select-image', { ...image, exif: exifData });
    },
    updateInfoPanelWidth() {
      // 根据hasInfoPanel属性设置CSS变量
      const contentElement = this.$el;
      if (contentElement) {
        if (this.hasInfoPanel) {
          contentElement.style.setProperty('--info-panel-width', '320px');
        } else {
          contentElement.style.setProperty('--info-panel-width', '0px');
        }
      }
    },
    // 加载更多图片
    loadMore() {
      const start = this.currentPage * this.pageSize;
      const end = start + this.pageSize;
      const newImages = this.images.slice(start, end);
      
      this.displayedImages = [...this.displayedImages, ...newImages];
      this.currentPage++;
    },
    
    // 处理滚动事件，实现无限滚动加载
    handleScroll(event) {
      const { scrollTop, scrollHeight, clientHeight } = event.target;
      // 当滚动到底部时自动加载更多
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        if (!this.loading && this.hasMoreImages) {
          this.loadMore();
        }
      }
    }
  },
  mounted() {
    this.updateInfoPanelWidth();
    // 监听滚动事件，实现无限滚动加载
    this.$refs.photoGrid.addEventListener('scroll', this.handleScroll);
  },
  updated() {
    this.updateInfoPanelWidth();
  },
  beforeDestroy() {
    // 移除滚动事件监听
    if (this.$refs.photoGrid) {
      this.$refs.photoGrid.removeEventListener('scroll', this.handleScroll);
    }
  },
  
  // 计算属性
  computed: {
    hasMoreImages() {
      return this.displayedImages.length < this.images.length;
    }
  },
    

}
</script>

<style scoped>
.content {
  width: calc(100% - 280px - var(--info-panel-width, 0px));
}
.photo-grid {
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
}
.photo-thumbnail {
  aspect-ratio: 1/1;
}
</style>