<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePosts } from '../../composables/usePosts.js'

const route = useRoute()
const router = useRouter()
const { allPosts, savePost, updatePost } = usePosts()

const isEdit = computed(() => !!route.params.id)
const postId = computed(() => route.params.id ? Number(route.params.id) : null)

const title = ref('')
const category = ref('')
const content = ref('')
const saved = ref(false)

const categories = computed(() => [...new Set(allPosts.value.map(p => p.category))])

onMounted(() => {
  if (isEdit.value && postId.value) {
    const post = allPosts.value.find(p => p.id === postId.value)
    if (post) {
      title.value = post.title
      category.value = post.category
      content.value = post.content
    }
  }
})

function save() {
  if (!title.value.trim() || !content.value.trim()) return

  if (isEdit.value && postId.value) {
    updatePost(postId.value, {
      title: title.value,
      category: category.value || '未分类',
      content: content.value,
    })
  } else {
    savePost({
      title: title.value,
      category: category.value || '未分类',
      content: content.value,
    })
  }

  saved.value = true
  setTimeout(() => {
    router.push('/admin/posts')
  }, 1000)
}
</script>

<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <router-link to="/admin/posts" class="text-text-muted hover:text-accent transition-colors duration-200 cursor-pointer">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </router-link>
      <h1 class="font-heading text-2xl font-bold text-primary">{{ isEdit ? '编辑文章' : '写新文章' }}</h1>
    </div>

    <div v-if="saved" class="bg-green-50 border border-green-200 rounded-xl p-6 text-center mb-6">
      <p class="text-green-600 font-medium">{{ isEdit ? '修改成功' : '发布成功' }}！正在跳转...</p>
    </div>

    <form v-else @submit.prevent="save" class="space-y-6 max-w-3xl">
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
        <div class="flex flex-wrap gap-2 mb-2">
          <button
            v-for="cat in categories"
            :key="cat"
            type="button"
            @click="category = cat"
            class="px-3 py-1 text-xs font-medium rounded-full border transition-all duration-200 cursor-pointer"
            :class="category === cat
              ? 'bg-accent text-white border-accent'
              : 'bg-surface text-text-muted border-border hover:border-accent hover:text-accent'"
          >
            {{ cat }}
          </button>
        </div>
        <input
          v-model="category"
          type="text"
          placeholder="或输入新分类"
          class="w-full px-4 py-3 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:border-accent transition-colors duration-200"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-primary mb-2">正文（支持 Markdown）</label>
        <textarea
          v-model="content"
          rows="20"
          required
          placeholder="在这里写文章内容..."
          class="w-full px-4 py-3 bg-surface border border-border rounded-lg text-sm font-mono focus:outline-none focus:border-accent transition-colors duration-200 resize-y"
        ></textarea>
      </div>

      <div class="flex gap-4">
        <button
          type="submit"
          class="px-6 py-3 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors duration-200 cursor-pointer"
        >
          {{ isEdit ? '保存修改' : '发布文章' }}
        </button>
        <router-link
          to="/admin/posts"
          class="px-6 py-3 border border-border text-text-muted text-sm font-medium rounded-lg hover:border-accent hover:text-accent transition-colors duration-200 cursor-pointer"
        >
          取消
        </router-link>
      </div>
    </form>
  </div>
</template>
