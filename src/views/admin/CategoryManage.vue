<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePosts } from '../../composables/usePosts.js'

const { allPosts, loadPosts } = usePosts()
const newCategory = ref('')

onMounted(() => {
  if (!allPosts.value.length) loadPosts()
})

const allCategories = computed(() => {
  return [...new Set(allPosts.value.map(p => p.category))].sort()
})

function postCount(cat) {
  return allPosts.value.filter(p => p.category === cat).length
}
</script>

<template>
  <div>
    <h1 class="font-heading text-2xl font-bold text-primary mb-6">分类管理</h1>

    <p class="text-sm text-text-muted mb-6">分类由文章自动归类，写文章时指定分类即可。</p>

    <!-- Category list -->
    <div class="bg-surface border border-border rounded-xl overflow-hidden">
      <div v-if="allCategories.length === 0" class="p-12 text-center">
        <p class="text-text-muted">暂无分类</p>
      </div>
      <div v-else class="divide-y divide-border">
        <div
          v-for="cat in allCategories"
          :key="cat"
          class="px-6 py-4 flex items-center gap-4"
        >
          <span class="text-sm font-medium text-primary">{{ cat }}</span>
          <span class="text-xs text-text-muted">{{ postCount(cat) }} 篇文章</span>
        </div>
      </div>
    </div>
  </div>
</template>
