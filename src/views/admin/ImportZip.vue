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
      console.log(`[ImportZip] Uploading: ${filename}, size=${blob.size}, b64len=${base64.length}`)
      await uploadImage(filename, base64)
      uploadedImages[img.path] = filename
      console.log(`[ImportZip] OK: ${filename}`)
      results.value.push({ name: filename, ok: true, msg: '图片上传成功' })
    } catch (e) {
      console.error(`[ImportZip] FAIL: ${filename}`, e.message, e)
      results.value.push({ name: filename, ok: false, msg: e.message })
    }
  }

  // Build a flat filename -> rawUrl lookup for fallback matching
  const filenameToUrl = {}
  for (const [zipPath, uploadName] of Object.entries(uploadedImages)) {
    filenameToUrl[uploadName] = getImageRawUrl(uploadName)
  }

  // Debug: log all zip files and image mappings
  console.log('[ImportZip] All zip files:', files.map(f => f.path))
  console.log('[ImportZip] Image map:', uploadedImages)
  console.log('[ImportZip] Filename lookup:', filenameToUrl)

  // Process markdown files
  for (let i = 0; i < mdFiles.length; i++) {
    const md = mdFiles[i]
    const title = md.path.split('/').pop().replace(/\.md$/i, '')
    progress.value = `上传文章 ${i + 1}/${mdFiles.length}: ${title}`
    try {
      let content = await md.entry.async('text')
      const mdDir = md.path.substring(0, md.path.lastIndexOf('/') + 1)

      function resolveImagePath(imgPath) {
        if (!imgPath || imgPath.startsWith('http') || imgPath.startsWith('data:')) return null
        // Decode URL-encoded characters (e.g. %20 -> space)
        const decoded = decodeURIComponent(imgPath)
        // Try resolving relative to md file directory
        const resolved = mdDir + decoded
        if (uploadedImages[resolved]) return getImageRawUrl(uploadedImages[resolved])
        // Try resolving ../ prefix
        const parts = mdDir.split('/').filter(Boolean)
        const upParts = decoded.split('/')
        let baseParts = [...parts]
        for (const p of upParts) {
          if (p === '..') baseParts.pop()
          else if (p !== '.') baseParts.push(p)
        }
        const resolved2 = baseParts.join('/')
        if (uploadedImages[resolved2]) return getImageRawUrl(uploadedImages[resolved2])
        // Fallback: match by filename only
        const justFilename = decoded.split('/').pop()
        if (filenameToUrl[justFilename]) return filenameToUrl[justFilename]
        console.warn('[ImportZip] Image not found:', { imgPath, decoded, mdDir, resolved, resolved2, justFilename })
        return null
      }

      // Standard markdown: ![alt](path)
      content = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, imgPath) => {
        const url = resolveImagePath(imgPath)
        return url ? `![${alt}](${url})` : match
      })

      // Obsidian wiki links: ![[filename]] or ![[filename|alias]]
      content = content.replace(/!\[\[([^\]|]+?)(?:\|[^\]]+)?\]\]/g, (match, filename) => {
        const url = resolveImagePath(filename.trim())
        return url ? `![](${url})` : match
      })

      // HTML img tags: <img src="path" ...>
      content = content.replace(/(<img\s+[^>]*src=")([^"]+)(")/gi, (match, prefix, src, suffix) => {
        const url = resolveImagePath(src)
        return url ? `${prefix}${url}${suffix}` : match
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
