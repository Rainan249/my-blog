<script setup>
import { ref } from 'vue'
import JSZip from 'jszip'
import { createPost, uploadImage, getImageRawUrl, isTokenSet } from '../../api/github.js'
import { usePosts } from '../../composables/usePosts.js'

const { loadPosts } = usePosts()

const category = ref('')
const importing = ref(false)
const progress = ref('')
const results = ref([])
const dragOver = ref(false)

const IMAGE_EXTS = /\.(png|jpe?g|gif|svg|webp|bmp)$/i

async function handleZip(file) {
  if (!isTokenSet()) {
    results.value = [{ name: file.name, ok: false, msg: '请先配置 GitHub Token' }]
    return
  }

  importing.value = true
  results.value = []
  progress.value = '正在解压...'

  let zip
  try {
    zip = await JSZip.loadAsync(file)
  } catch (e) {
    results.value = [{ name: file.name, ok: false, msg: '无法解析 zip 文件' }]
    importing.value = false
    return
  }

  const files = []
  zip.forEach((path, entry) => {
    if (!entry.dir) files.push({ path, entry })
  })

  const mdFiles = files.filter((f) => f.path.endsWith('.md'))
  const imageFiles = files.filter((f) => IMAGE_EXTS.test(f.path))

  if (!mdFiles.length) {
    results.value = [{ name: file.name, ok: false, msg: 'zip 中没有 .md 文件' }]
    importing.value = false
    return
  }

  // Build filename map for images (flatten to just filename)
  const imageMap = {}
  for (const img of imageFiles) {
    const filename = img.path.split('/').pop()
    imageMap[img.path] = filename
  }

  // Upload images
  const uploadedImages = {}
  for (let i = 0; i < imageFiles.length; i++) {
    const img = imageFiles[i]
    const filename = imageMap[img.path]
    progress.value = `上传图片 ${i + 1}/${imageFiles.length}: ${filename}`
    try {
      const blob = await img.entry.async('blob')
      const base64 = await blobToBase64(blob)
      await uploadImage(filename, base64)
      uploadedImages[img.path] = filename
      results.value.push({ name: filename, ok: true, msg: '图片上传成功' })
    } catch (e) {
      results.value.push({ name: filename, ok: false, msg: e.message })
    }
  }

  // Process markdown files
  for (let i = 0; i < mdFiles.length; i++) {
    const md = mdFiles[i]
    const title = md.path.split('/').pop().replace(/\.md$/i, '')
    progress.value = `上传文章 ${i + 1}/${mdFiles.length}: ${title}`
    try {
      let content = await md.entry.async('text')

      // Rewrite image paths: ![alt](path) -> ![alt](raw_url)
      content = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, imgPath) => {
        // Resolve relative path against the md file's directory
        const mdDir = md.path.substring(0, md.path.lastIndexOf('/') + 1)
        const resolved = mdDir + imgPath
        // Check if this image exists in the zip
        if (uploadedImages[resolved]) {
          const rawUrl = getImageRawUrl(uploadedImages[resolved])
          return `![${alt}](${rawUrl})`
        }
        // Also check by just the filename (in case path is simple)
        const justFilename = imgPath.split('/').pop()
        for (const [zipPath, uploadName] of Object.entries(uploadedImages)) {
          if (uploadName === justFilename) {
            return `![${alt}](${getImageRawUrl(uploadName)})`
          }
        }
        return match
      })

      await createPost({ title, category: category.value, content })
      results.value.push({ name: title, ok: true, msg: '文章发布成功' })
    } catch (e) {
      results.value.push({
        name: title,
        ok: false,
        msg: e.message === 'NO_TOKEN' ? '请先配置 GitHub Token' : e.message,
      })
    }
  }

  progress.value = ''
  importing.value = false
  await loadPosts()
}

function blobToBase64(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result.split(',')[1])
    reader.readAsDataURL(blob)
  })
}

function onFileChange(e) {
  const file = e.target.files[0]
  if (file) handleZip(file)
}

function onDrop(e) {
  dragOver.value = false
  const file = e.dataTransfer.files[0]
  if (file) handleZip(file)
}
</script>

<template>
  <section>
    <h1 class="font-heading text-2xl font-bold text-primary mb-2">导入 ZIP 包</h1>
    <p class="text-sm text-text-muted mb-8">
      上传包含 .md 文件和图片的压缩包，自动解压并发布。图片会上传到 GitHub，文章中的图片路径会自动替换。
    </p>

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
      <p class="text-sm text-text-muted mb-1">拖拽 .zip 文件到这里，或 <span class="text-accent font-medium">点击选择</span></p>
      <p class="text-xs text-text-muted">支持包含 .md 文件和图片的压缩包</p>
      <input ref="fileInput" type="file" accept=".zip" class="hidden" @change="onFileChange" />
    </div>

    <!-- Progress -->
    <p v-if="progress" class="text-sm text-accent mt-4">{{ progress }}</p>
    <p v-if="importing && !progress" class="text-sm text-accent mt-4">处理中...</p>

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
