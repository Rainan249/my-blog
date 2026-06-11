<script setup>
import { ref, computed } from 'vue'
import { usePosts } from '../../composables/usePosts.js'

const { allPosts, deletePost } = usePosts()
const confirmId = ref(null)

function confirmDelete(id) {
  confirmId.value = id
}

function doDelete(id) {
  deletePost(id)
  confirmId.value = null
}

const posts = computed(() => allPosts.value)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-heading text-2xl font-bold text-primary">文章管理</h1>
      <router-link
        to="/admin/posts/new"
        class="inline-flex items-center px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors duration-200 cursor-pointer"
      >
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        新建
      </router-link>
    </div>

    <div class="bg-surface border border-border rounded-xl overflow-hidden">
      <div v-if="posts.length === 0" class="p-12 text-center">
        <p class="text-text-muted">暂无文章</p>
        <router-link to="/admin/posts/new" class="text-accent text-sm mt-2 inline-block cursor-pointer">写第一篇文章</router-link>
      </div>

      <div v-else class="divide-y divide-border">
        <div
          v-for="post in posts"
          :key="post.id"
          class="px-6 py-4 flex items-center justify-between gap-4 hover:bg-bg/50 transition-colors duration-200"
        >
          <div class="flex-1 min-w-0">
            <router-link
              :to="`/admin/posts/${post.id}/edit`"
              class="text-sm font-medium text-primary hover:text-accent transition-colors duration-200 cursor-pointer block truncate"
            >
              {{ post.title }}
            </router-link>
            <div class="flex items-center gap-3 mt-1">
              <span class="text-xs text-accent bg-accent-light px-2 py-0.5 rounded-full">{{ post.category }}</span>
              <span class="text-xs text-text-muted">{{ post.date }}</span>
            </div>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <router-link
              :to="`/admin/posts/${post.id}/edit`"
              class="px-3 py-1.5 text-xs font-medium text-text-muted border border-border rounded-md hover:border-accent hover:text-accent transition-colors duration-200 cursor-pointer"
            >
              编辑
            </router-link>
            <div v-if="confirmId === post.id" class="flex items-center gap-1">
              <button
                @click="doDelete(post.id)"
                class="px-3 py-1.5 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors duration-200 cursor-pointer"
              >
                确认
              </button>
              <button
                @click="confirmId = null"
                class="px-3 py-1.5 text-xs font-medium text-text-muted border border-border rounded-md hover:text-text transition-colors duration-200 cursor-pointer"
              >
                取消
              </button>
            </div>
            <button
              v-else
              @click="confirmDelete(post.id)"
              class="px-3 py-1.5 text-xs font-medium text-red-500 border border-red-200 rounded-md hover:bg-red-50 transition-colors duration-200 cursor-pointer"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
