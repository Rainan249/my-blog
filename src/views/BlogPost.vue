<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePosts } from '../composables/usePosts.js'

const route = useRoute()
const { findBySlug } = usePosts()
const post = computed(() => findBySlug(route.params.slug))

const formattedContent = computed(() => {
  if (!post.value) return ''
  let html = post.value.content
    .replace(/## (.*)/g, '<h2 class="font-heading text-xl font-bold text-primary mt-8 mb-4">$1</h2>')
    .replace(/### (.*)/g, '<h3 class="font-heading text-lg font-semibold text-primary mt-6 mb-3">$1</h3>')
    .replace(/```js\n([\s\S]*?)```/g, '<pre class="bg-primary text-white/90 rounded-lg p-4 my-4 overflow-x-auto text-sm"><code>$1</code></pre>')
    .replace(/```css\n([\s\S]*?)```/g, '<pre class="bg-primary text-white/90 rounded-lg p-4 my-4 overflow-x-auto text-sm"><code>$1</code></pre>')
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-primary text-white/90 rounded-lg p-4 my-4 overflow-x-auto text-sm"><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-accent-light text-accent px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    .replace(/- (.*)/g, '<li class="ml-4 mb-1 text-text-muted">$1</li>')
    .replace(/\n\n/g, '</p><p class="text-text-muted leading-relaxed mb-4">')
    .replace(/^/, '<p class="text-text-muted leading-relaxed mb-4">')
    .replace(/$/, '</p>')
  return html
})
</script>

<template>
  <article v-if="post" class="max-w-3xl mx-auto px-6 py-16">
    <!-- Back -->
    <router-link
      to="/blog"
      class="inline-flex items-center text-sm text-text-muted hover:text-accent transition-colors duration-200 mb-8 cursor-pointer"
    >
      &larr; 返回博客
    </router-link>

    <!-- Header -->
    <header class="mb-10">
      <div class="flex items-center gap-3 mb-4">
        <span class="text-xs font-medium text-accent bg-accent-light px-2.5 py-1 rounded-full">
          {{ post.category }}
        </span>
        <span class="text-xs text-text-muted">{{ post.readTime }}</span>
      </div>
      <h1 class="font-heading text-3xl md:text-4xl font-bold text-primary leading-tight mb-4">
        {{ post.title }}
      </h1>
      <time class="text-sm text-text-muted">{{ post.date }}</time>
    </header>

    <hr class="border-border mb-10" />

    <!-- Content -->
    <div class="prose-custom" v-html="formattedContent"></div>

    <!-- Back bottom -->
    <div class="mt-12 pt-8 border-t border-border">
      <router-link
        to="/blog"
        class="inline-flex items-center text-sm font-medium text-accent hover:text-accent/80 transition-colors duration-200 cursor-pointer"
      >
        &larr; 返回博客列表
      </router-link>
    </div>
  </article>

  <div v-else class="max-w-3xl mx-auto px-6 py-20 text-center">
    <h1 class="font-heading text-2xl font-bold text-primary mb-4">文章未找到</h1>
    <p class="text-text-muted mb-6">你访问的文章不存在。</p>
    <router-link to="/blog" class="text-accent hover:text-accent/80 transition-colors duration-200 cursor-pointer">
      返回博客列表
    </router-link>
  </div>
</template>
