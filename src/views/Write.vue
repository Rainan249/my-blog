<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const title = ref('')
const category = ref('')
const content = ref('')
const saved = ref(false)

function save() {
  if (!title.value.trim() || !content.value.trim()) return

  const customPosts = JSON.parse(localStorage.getItem('customPosts') || '[]')
  const newPost = {
    id: Date.now(),
    slug: title.value
      .toLowerCase()
      .replace(/[^a-z0-9一-龥]+/g, '-')
      .replace(/^-|-$/g, ''),
    title: title.value,
    excerpt: content.value.replace(/[#*`>\-\n]/g, ' ').slice(0, 120) + '...',
    date: new Date().toISOString().split('T')[0],
    category: category.value || '未分类',
    readTime: Math.max(1, Math.ceil(content.value.length / 500)) + ' 分钟',
    content: content.value,
  }

  customPosts.unshift(newPost)
  localStorage.setItem('customPosts', JSON.stringify(customPosts))

  saved.value = true
  setTimeout(() => {
    router.push('/blog')
  }, 1200)
}
</script>

<template>
  <section class="max-w-3xl mx-auto px-6 py-16">
    <h1 class="font-heading text-3xl font-bold text-primary mb-8">写文章</h1>

    <div v-if="saved" class="bg-accent-light border border-accent/20 rounded-xl p-8 text-center mb-8">
      <p class="text-accent font-medium">发布成功！正在跳转...</p>
    </div>

    <form v-else @submit.prevent="save" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-primary mb-2">标题</label>
        <input
          v-model="title"
          type="text"
          required
          placeholder="文章标题"
          class="w-full px-4 py-3 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:border-accent transition-colors duration-200"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-primary mb-2">分类</label>
        <input
          v-model="category"
          type="text"
          placeholder="例如：前端开发、CSS、JavaScript"
          class="w-full px-4 py-3 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:border-accent transition-colors duration-200"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-primary mb-2">正文（支持 Markdown）</label>
        <textarea
          v-model="content"
          rows="16"
          required
          placeholder="在这里写文章内容，支持 Markdown 语法&#10;&#10;## 标题&#10;正文内容...&#10;&#10;- 列表项&#10;`代码`"
          class="w-full px-4 py-3 bg-surface border border-border rounded-lg text-sm font-mono focus:outline-none focus:border-accent transition-colors duration-200 resize-y"
        ></textarea>
        <p class="text-xs text-text-muted mt-2">
          支持 Markdown：## 标题、**粗体**、*斜体*、`代码`、```代码块```、- 列表
        </p>
      </div>

      <div class="flex gap-4">
        <button
          type="submit"
          class="px-6 py-3 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors duration-200 cursor-pointer"
        >
          发布文章
        </button>
        <router-link
          to="/blog"
          class="px-6 py-3 border border-border text-text-muted text-sm font-medium rounded-lg hover:border-accent hover:text-accent transition-colors duration-200 cursor-pointer"
        >
          取消
        </router-link>
      </div>
    </form>
  </section>
</template>
