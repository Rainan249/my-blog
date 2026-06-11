<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const sidebarOpen = ref(false)

onMounted(() => {
  if (!sessionStorage.getItem('adminAuth')) {
    router.push('/admin/login')
  }
})

function logout() {
  sessionStorage.removeItem('adminAuth')
  router.push('/admin/login')
}

const menuItems = [
  { name: '仪表盘', path: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4' },
  { name: '文章管理', path: '/admin/posts', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
  { name: '写文章', path: '/admin/posts/new', icon: 'M12 4v16m8-8H4' },
  { name: '分类管理', path: '/admin/categories', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z' },
]
</script>

<template>
  <div class="min-h-screen flex bg-bg">
    <!-- Sidebar -->
    <aside class="w-64 bg-surface border-r border-border flex-shrink-0 hidden md:flex flex-col">
      <div class="px-6 py-5 border-b border-border">
        <router-link to="/" class="font-heading text-lg font-bold text-primary hover:text-accent transition-colors">
          雨鹿 - 后台
        </router-link>
      </div>
      <nav class="flex-1 px-3 py-4 space-y-1">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer"
          :class="route.path === item.path ? 'bg-accent/10 text-accent' : 'text-text-muted hover:bg-bg hover:text-text'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="item.icon" />
          </svg>
          {{ item.name }}
        </router-link>
      </nav>
      <div class="px-3 py-4 border-t border-border space-y-1">
        <router-link
          to="/blog"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:bg-bg hover:text-text transition-colors duration-200 cursor-pointer"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          查看博客
        </router-link>
        <button
          @click="logout"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:bg-red-50 hover:text-red-500 transition-colors duration-200 cursor-pointer"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          退出登录
        </button>
      </div>
    </aside>

    <!-- Mobile header -->
    <div class="md:hidden fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border px-4 h-14 flex items-center justify-between">
      <router-link to="/" class="font-heading text-lg font-bold text-primary">雨鹿 - 后台</router-link>
      <button @click="sidebarOpen = !sidebarOpen" class="p-2 cursor-pointer" aria-label="菜单">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <!-- Mobile sidebar overlay -->
    <div v-if="sidebarOpen" class="md:hidden fixed inset-0 z-40 bg-black/30" @click="sidebarOpen = false"></div>
    <div v-if="sidebarOpen" class="md:hidden fixed top-14 left-0 bottom-0 z-50 w-64 bg-surface border-r border-border p-4 space-y-1">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer"
        :class="route.path === item.path ? 'bg-accent/10 text-accent' : 'text-text-muted hover:bg-bg hover:text-text'"
        @click="sidebarOpen = false"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="item.icon" />
        </svg>
        {{ item.name }}
      </router-link>
      <hr class="border-border my-2" />
      <button
        @click="logout"
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:bg-red-50 hover:text-red-500 transition-colors duration-200 cursor-pointer"
      >
        退出登录
      </button>
    </div>

    <!-- Main content -->
    <main class="flex-1 md:pt-0 pt-14 overflow-auto">
      <div class="p-6 md:p-8">
        <router-view />
      </div>
    </main>
  </div>
</template>
