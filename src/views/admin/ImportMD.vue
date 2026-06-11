<script setup>
import { ref } from 'vue'
import { usePosts } from '../../composables/usePosts.js'

const { savePost } = usePosts()

const category = ref('')
const importing = ref(false)
const results = ref([])
const dragOver = ref(false)

function parseMdFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target.result
      const title = file.name.replace(/\.md$/i, '')
      resolve({ title, content })
    }
    reader.readAsText(file)
  })
}

async function handleFiles(files) {
  importing.value = true
  results.value = []

  for (const file of files) {
    if (!file.name.endsWith('.md')) {
      results.value.push({ name: file.name, ok: false, msg: '不是 .md 文件' })
      continue
    }
    const { title, content } = await parseMdFile(file)
    savePost({ title, category: category.value, content })
    results.value.push({ name: file.name, ok: true, msg: title })
  }

  importing.value = false
}

function onFileChange(e) {
  handleFiles(e.target.files)
}

function onDrop(e) {
  dragOver.value = false
  handleFiles(e.dataTransfer.files)
}
</script>

<template>
  <section>
    <h1 class="font-heading text-2xl font-bold text-primary mb-2">导入 Markdown</h1>
    <p class="text-sm text-text-muted mb-8">上传本地 .md 文件，自动发布为博客文章。文件名即标题。</p>

    <!-- Category -->
    <div class="mb-6 max-w-sm">
      <label class="block text-sm font-medium text-primary mb-2">统一分类（可选）</label>
      <input v-model="category" type="text" placeholder="留空则归为「未分类」"
        class="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:border-accent transition-colors duration-200" />
    </div>

    <!-- Drop zone -->
    <div
      class="border-2 border-dashed rounded-xl p-12 text-center transition-colors duration-200 cursor-pointer"
      :class="dragOver ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/40'"
      @dragover.prevent="dragOver = true"
      @dragleave="dragOver = false"
      @drop.prevent="onDrop"
      @click="$refs.fileInput.click()"
    >
      <svg class="w-10 h-10 mx-auto mb-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      <p class="text-sm text-text-muted mb-1">拖拽 .md 文件到这里，或 <span class="text-accent font-medium">点击选择</span></p>
      <p class="text-xs text-text-muted">支持批量上传</p>
      <input ref="fileInput" type="file" accept=".md" multiple class="hidden" @change="onFileChange" />
    </div>

    <!-- Importing indicator -->
    <p v-if="importing" class="text-sm text-accent mt-4">导入中...</p>

    <!-- Results -->
    <div v-if="results.length" class="mt-6 space-y-2">
      <div
        v-for="r in results"
        :key="r.name"
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm"
        :class="r.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'"
      >
        <span v-if="r.ok" class="text-green-500">&#10003;</span>
        <span v-else class="text-red-500">&#10007;</span>
        <span class="font-medium">{{ r.name }}</span>
        <span class="text-text-muted ml-auto">{{ r.msg }}</span>
      </div>
    </div>
  </section>
</template>
