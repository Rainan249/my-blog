<script setup>
import { posts } from '../data/posts.js'
import BlogCard from '../components/BlogCard.vue'

const recentPosts = posts.slice(0, 3)
</script>

<template>
  <!-- Hero -->
  <section class="max-w-6xl mx-auto px-6 pt-20 pb-16">
    <div class="max-w-2xl">
      <p class="text-sm font-medium text-accent mb-4 tracking-wide uppercase">个人博客</p>
      <h1 class="font-heading text-4xl md:text-5xl font-bold text-primary leading-tight mb-6">
        立志成为一个<br />糕手
      </h1>
      <p class="text-lg text-text-muted leading-relaxed mb-8">
        记录学习路上的所见所闻，分享技术探索的点滴感悟。
      </p>
      <div class="flex gap-4">
        <router-link
          to="/blog"
          class="inline-flex items-center px-6 py-3 bg-primary text-white text-sm font-medium rounded-lg hover:bg-secondary transition-colors duration-200 cursor-pointer"
        >
          浏览文章
        </router-link>
        <router-link
          to="/about"
          class="inline-flex items-center px-6 py-3 border border-border text-text text-sm font-medium rounded-lg hover:border-accent hover:text-accent transition-colors duration-200 cursor-pointer"
        >
          了解更多
        </router-link>
      </div>
    </div>
  </section>

  <!-- Divider -->
  <div class="max-w-6xl mx-auto px-6">
    <hr class="border-border" />
  </div>

  <!-- Recent Posts -->
  <section class="max-w-6xl mx-auto px-6 py-16">
    <div class="flex items-center justify-between mb-8">
      <h2 class="font-heading text-2xl font-bold text-primary">最新文章</h2>
      <router-link to="/blog" class="text-sm font-medium text-accent hover:text-accent/80 transition-colors duration-200 cursor-pointer">
        查看全部 &rarr;
      </router-link>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BlogCard v-for="post in recentPosts" :key="post.id" :post="post" />
    </div>
  </section>

  <!-- About Teaser -->
  <section class="bg-surface border-y border-border">
    <div class="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div>
        <p class="text-sm font-medium text-accent mb-3 tracking-wide uppercase">关于我</p>
        <h2 class="font-heading text-2xl font-bold text-primary mb-4">热爱技术，不断学习</h2>
        <p class="text-text-muted leading-relaxed mb-6">
          一个学生，热衷于技术。喜欢探索新的东西，记录学习过程，也希望通过博客和大家交流。
        </p>
        <router-link
          to="/about"
          class="inline-flex items-center text-sm font-medium text-accent hover:text-accent/80 transition-colors duration-200 cursor-pointer"
        >
          阅读更多 &rarr;
        </router-link>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-bg border border-border rounded-xl p-5 text-center">
          <p class="font-heading text-3xl font-bold text-primary">5</p>
          <p class="text-xs text-text-muted mt-1">示例文章</p>
        </div>
        <div class="bg-bg border border-border rounded-xl p-5 text-center">
          <p class="font-heading text-3xl font-bold text-primary">Vue</p>
          <p class="text-xs text-text-muted mt-1">技术栈</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Newsletter -->
  <section class="max-w-6xl mx-auto px-6 py-16">
    <div class="max-w-xl mx-auto text-center">
      <h2 class="font-heading text-2xl font-bold text-primary mb-3">订阅更新</h2>
      <p class="text-sm text-text-muted mb-6">获取最新文章推送，不错过任何精彩内容。</p>
      <form class="flex gap-3" @submit.prevent>
        <input
          type="email"
          placeholder="your@email.com"
          class="flex-1 px-4 py-3 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:border-accent transition-colors duration-200"
        />
        <button
          type="submit"
          class="px-6 py-3 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors duration-200 cursor-pointer"
        >
          订阅
        </button>
      </form>
    </div>
  </section>
</template>
