<script setup>
import { ref, computed } from 'vue'
import { posts } from '../data/posts.js'
import BlogCard from '../components/BlogCard.vue'

const activeCategory = ref('全部')
const categories = ['全部', ...new Set(posts.map(p => p.category))]

const filteredPosts = computed(() => {
  if (activeCategory.value === '全部') return posts
  return posts.filter(p => p.category === activeCategory.value)
})
</script>

<template>
  <section class="max-w-6xl mx-auto px-6 py-16">
    <div class="mb-10">
      <h1 class="font-heading text-3xl md:text-4xl font-bold text-primary mb-3">博客</h1>
      <p class="text-text-muted">探索前端开发的世界，分享技术见解与实践经验。</p>
    </div>

    <!-- Category filter -->
    <div class="flex flex-wrap gap-2 mb-8">
      <button
        v-for="cat in categories"
        :key="cat"
        @click="activeCategory = cat"
        class="px-4 py-1.5 text-sm font-medium rounded-full border transition-all duration-200 cursor-pointer"
        :class="activeCategory === cat
          ? 'bg-primary text-white border-primary'
          : 'bg-surface text-text-muted border-border hover:border-accent hover:text-accent'"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Posts grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BlogCard v-for="post in filteredPosts" :key="post.id" :post="post" />
    </div>

    <div v-if="filteredPosts.length === 0" class="text-center py-20">
      <p class="text-text-muted">该分类下暂无文章。</p>
    </div>
  </section>
</template>
