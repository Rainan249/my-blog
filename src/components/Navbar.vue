<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const mobileOpen = ref(false)
const route = useRoute()

const navLinks = [
  { name: '首页', path: '/' },
  { name: '博客', path: '/blog' },
  { name: '关于', path: '/about' },
  { name: '联系', path: '/contact' },
]
</script>

<template>
  <header class="sticky top-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border">
    <nav class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
      <router-link to="/" class="font-heading text-xl font-bold text-primary tracking-tight hover:text-accent transition-colors duration-200">
        雨鹿
      </router-link>

      <!-- Desktop nav -->
      <ul class="hidden md:flex items-center gap-8">
        <li v-for="link in navLinks" :key="link.path">
          <router-link
            :to="link.path"
            class="text-sm font-medium transition-colors duration-200 cursor-pointer"
            :class="route.path === link.path ? 'text-accent' : 'text-text-muted hover:text-text'"
          >
            {{ link.name }}
          </router-link>
        </li>
      </ul>

      <!-- Mobile hamburger -->
      <button
        class="md:hidden p-2 cursor-pointer"
        @click="mobileOpen = !mobileOpen"
        :aria-label="mobileOpen ? '关闭菜单' : '打开菜单'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="!mobileOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </nav>

    <!-- Mobile menu -->
    <div v-if="mobileOpen" class="md:hidden border-t border-border bg-surface">
      <ul class="px-6 py-4 space-y-3">
        <li v-for="link in navLinks" :key="link.path">
          <router-link
            :to="link.path"
            class="block text-sm font-medium py-2 transition-colors duration-200 cursor-pointer"
            :class="route.path === link.path ? 'text-accent' : 'text-text-muted hover:text-text'"
            @click="mobileOpen = false"
          >
            {{ link.name }}
          </router-link>
        </li>
      </ul>
    </div>
  </header>
</template>
