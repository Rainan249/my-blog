<script setup>
import { computed } from 'vue'
import { usePosts } from '../../composables/usePosts.js'

const { allPosts } = usePosts()

const stats = computed(() => {
  const posts = allPosts.value
  const categories = [...new Set(posts.map(p => p.category))]
  return {
    totalPosts: posts.length,
    totalCategories: categories.length,
    latestPost: posts[0] || null,
  }
})
</script>

<template>
  <div>
    <h1 class="font-heading text-2xl font-bold text-primary mb-6">仪表盘</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div class="bg-surface border border-border rounded-xl p-5">
        <p class="text-sm text-text-muted mb-1">文章总数</p>
        <p class="font-heading text-3xl font-bold text-primary">{{ stats.totalPosts }}</p>
      </div>
      <div class="bg-surface border border-border rounded-xl p-5">
        <p class="text-sm text-text-muted mb-1">分类数</p>
        <p class="font-heading text-3xl font-bold text-primary">{{ stats.totalCategories }}</p>
      </div>
      <div class="bg-surface border border-border rounded-xl p-5">
        <p class="text-sm text-text-muted mb-1">最新文章</p>
        <p class="text-sm font-medium text-text mt-1 truncate">{{ stats.latestPost?.title || '暂无' }}</p>
      </div>
    </div>

    <div class="bg-surface border border-border rounded-xl p-6">
      <h2 class="font-heading text-lg font-semibold text-primary mb-4">快捷操作</h2>
      <div class="flex flex-wrap gap-3">
        <router-link
          to="/admin/posts/new"
          class="inline-flex items-center px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors duration-200 cursor-pointer"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          写新文章
        </router-link>
        <router-link
          to="/admin/posts"
          class="inline-flex items-center px-5 py-2.5 border border-border text-text text-sm font-medium rounded-lg hover:border-accent hover:text-accent transition-colors duration-200 cursor-pointer"
        >
          管理文章
        </router-link>
        <router-link
          to="/admin/categories"
          class="inline-flex items-center px-5 py-2.5 border border-border text-text text-sm font-medium rounded-lg hover:border-accent hover:text-accent transition-colors duration-200 cursor-pointer"
        >
          管理分类
        </router-link>
      </div>
    </div>
  </div>
</template>
