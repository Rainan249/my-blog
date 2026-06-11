<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { saveToken, isTokenSet } from '../../api/github.js'

const router = useRouter()
const token = ref('')
const error = ref('')
const saving = ref(false)

onMounted(() => {
  if (isTokenSet()) {
    token.value = '••••••••••••••••'
  }
})

async function handleSave() {
  if (!token.value.trim() || token.value.includes('•')) {
    router.push('/admin')
    return
  }

  error.value = ''
  saving.value = true

  try {
    const res = await fetch('https://api.github.com/user', {
      headers: { Authorization: `token ${token.value.trim()}` },
    })
    if (!res.ok) {
      error.value = 'Token 无效，请检查后重试'
      saving.value = false
      return
    }
    saveToken(token.value.trim())
    router.push('/admin')
  } catch {
    error.value = '网络错误，请重试'
    saving.value = false
  }
}
</script>

<template>
  <section class="max-w-xl mx-auto">
    <h1 class="font-heading text-2xl font-bold text-primary mb-2">GitHub Token 配置</h1>
    <p class="text-sm text-text-muted mb-8">
      配置 GitHub Personal Access Token，文章将存储在你的 GitHub 仓库中。
    </p>

    <!-- Steps -->
    <div class="bg-surface border border-border rounded-xl p-6 mb-6">
      <h2 class="text-sm font-semibold text-primary mb-3">获取 Token 步骤</h2>
      <ol class="space-y-2 text-sm text-text-muted list-decimal list-inside">
        <li>打开 <a href="https://github.com/settings/tokens" target="_blank" class="text-accent hover:underline">GitHub Settings → Tokens</a></li>
        <li>点击 <strong>Generate new token (classic)</strong></li>
        <li>Note 填 <code class="bg-bg px-1.5 py-0.5 rounded text-xs">my-blog</code>，勾选 <strong>repo</strong> 权限</li>
        <li>点击 Generate token，复制生成的 token</li>
      </ol>
    </div>

    <!-- Token input -->
    <form @submit.prevent="handleSave" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-primary mb-2">Personal Access Token</label>
        <input
          v-model="token"
          type="password"
          placeholder="ghp_xxxxxxxxxxxx"
          class="w-full px-4 py-3 bg-surface border border-border rounded-lg text-sm font-mono focus:outline-none focus:border-accent transition-colors duration-200"
        />
      </div>

      <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

      <div class="flex gap-3">
        <button
          type="submit"
          :disabled="saving"
          class="px-6 py-3 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors duration-200 cursor-pointer disabled:opacity-50"
        >
          {{ saving ? '验证中...' : '保存并继续' }}
        </button>
        <router-link
          to="/admin"
          class="px-6 py-3 border border-border text-text-muted text-sm font-medium rounded-lg hover:border-accent hover:text-accent transition-colors duration-200 cursor-pointer"
        >
          跳过
        </router-link>
      </div>
    </form>
  </section>
</template>
