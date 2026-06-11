<script setup>
import { ref, computed } from 'vue'
import { usePosts } from '../../composables/usePosts.js'

const { allPosts } = usePosts()
const newCategory = ref('')
const renameTarget = ref(null)
const renameValue = ref('')

const builtInCategories = ['前端开发', 'CSS', '性能优化', '工具']

const customCategories = computed(() => {
  return JSON.parse(localStorage.getItem('customCategories') || '[]')
})

const allCategories = computed(() => {
  const used = [...new Set(allPosts.value.map(p => p.category))]
  return [...new Set([...builtInCategories, ...customCategories.value, ...used])]
})

function addCategory() {
  const name = newCategory.value.trim()
  if (!name || allCategories.value.includes(name)) return
  const cats = JSON.parse(localStorage.getItem('customCategories') || '[]')
  cats.push(name)
  localStorage.setItem('customCategories', JSON.stringify(cats))
  newCategory.value = ''
}

function startRename(cat) {
  renameTarget.value = cat
  renameValue.value = cat
}

function saveRename() {
  const oldName = renameTarget.value
  const newName = renameValue.value.trim()
  if (!newName || oldName === newName) {
    renameTarget.value = null
    return
  }

  // Update custom categories
  const cats = JSON.parse(localStorage.getItem('customCategories') || '[]')
  const idx = cats.indexOf(oldName)
  if (idx !== -1) {
    cats[idx] = newName
    localStorage.setItem('customCategories', JSON.stringify(cats))
  }

  // Update posts
  const posts = JSON.parse(localStorage.getItem('customPosts') || '[]')
  posts.forEach(p => {
    if (p.category === oldName) p.category = newName
  })
  localStorage.setItem('customPosts', JSON.stringify(posts))

  renameTarget.value = null
}

function deleteCategory(cat) {
  const cats = JSON.parse(localStorage.getItem('customCategories') || '[]')
  localStorage.setItem('customCategories', JSON.stringify(cats.filter(c => c !== cat)))
}

function postCount(cat) {
  return allPosts.value.filter(p => p.category === cat).length
}
</script>

<template>
  <div>
    <h1 class="font-heading text-2xl font-bold text-primary mb-6">分类管理</h1>

    <!-- Add new -->
    <div class="bg-surface border border-border rounded-xl p-6 mb-6">
      <h2 class="text-sm font-semibold text-primary mb-3">添加分类</h2>
      <form @submit.prevent="addCategory" class="flex gap-3">
        <input
          v-model="newCategory"
          type="text"
          placeholder="新分类名称"
          class="flex-1 px-4 py-2.5 bg-bg border border-border rounded-lg text-sm focus:outline-none focus:border-accent transition-colors duration-200"
        />
        <button
          type="submit"
          class="px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors duration-200 cursor-pointer"
        >
          添加
        </button>
      </form>
    </div>

    <!-- Category list -->
    <div class="bg-surface border border-border rounded-xl overflow-hidden">
      <div class="divide-y divide-border">
        <div
          v-for="cat in allCategories"
          :key="cat"
          class="px-6 py-4 flex items-center justify-between gap-4"
        >
          <div class="flex-1 min-w-0">
            <template v-if="renameTarget === cat">
              <form @submit.prevent="saveRename" class="flex gap-2">
                <input
                  v-model="renameValue"
                  autofocus
                  class="flex-1 px-3 py-1.5 bg-bg border border-accent rounded text-sm focus:outline-none"
                />
                <button type="submit" class="text-xs text-accent font-medium cursor-pointer">保存</button>
                <button type="button" @click="renameTarget = null" class="text-xs text-text-muted cursor-pointer">取消</button>
              </form>
            </template>
            <template v-else>
              <span class="text-sm font-medium text-primary">{{ cat }}</span>
              <span class="text-xs text-text-muted ml-2">{{ postCount(cat) }} 篇文章</span>
            </template>
          </div>
          <div v-if="renameTarget !== cat" class="flex items-center gap-2 flex-shrink-0">
            <button
              @click="startRename(cat)"
              class="px-3 py-1.5 text-xs font-medium text-text-muted border border-border rounded-md hover:border-accent hover:text-accent transition-colors duration-200 cursor-pointer"
            >
              重命名
            </button>
            <button
              v-if="customCategories.includes(cat)"
              @click="deleteCategory(cat)"
              class="px-3 py-1.5 text-xs font-medium text-red-500 border border-red-200 rounded-md hover:bg-red-50 transition-colors duration-200 cursor-pointer"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
