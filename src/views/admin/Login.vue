<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const password = ref('')
const error = ref(false)

const ADMIN_PASS = 'yu2024'

function login() {
  if (password.value === ADMIN_PASS) {
    sessionStorage.setItem('adminAuth', 'true')
    router.push('/admin')
  } else {
    error.value = true
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-bg px-6">
    <div class="w-full max-w-sm">
      <h1 class="font-heading text-2xl font-bold text-primary text-center mb-2">后台登录</h1>
      <p class="text-sm text-text-muted text-center mb-8">请输入管理密码</p>
      <form @submit.prevent="login" class="space-y-4">
        <input
          v-model="password"
          type="password"
          placeholder="密码"
          autofocus
          class="w-full px-4 py-3 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:border-accent transition-colors duration-200"
        />
        <p v-if="error" class="text-xs text-red-500">密码错误，请重试</p>
        <button
          type="submit"
          class="w-full px-6 py-3 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors duration-200 cursor-pointer"
        >
          登录
        </button>
      </form>
    </div>
  </div>
</template>
