import { ref } from 'vue'
import {
  fetchAllPosts,
  fetchPostBySlug,
  createPost,
  updatePost,
  deletePost as apiDeletePost,
  isTokenSet,
  toSlug,
} from '../api/github.js'

const allPosts = ref([])
const loading = ref(false)
const loaded = ref(false)

async function loadPosts() {
  loading.value = true
  try {
    allPosts.value = await fetchAllPosts()
  } catch (e) {
    console.error('Failed to load posts:', e)
    allPosts.value = []
  } finally {
    loading.value = false
    loaded.value = true
  }
}

export function usePosts() {
  function findBySlug(slug) {
    return allPosts.value.find((p) => p.slug === slug)
  }

  function findById(id) {
    return allPosts.value.find((p) => p.id === id)
  }

  async function savePost({ title, category, content }) {
    if (!isTokenSet()) throw new Error('NO_TOKEN')
    await createPost({ title, category, content })
    await loadPosts()
  }

  async function savePostWithId(id, { title, category, content, slug, date }) {
    if (!isTokenSet()) throw new Error('NO_TOKEN')
    const post = allPosts.value.find((p) => p.id === id)
    if (!post) throw new Error('Post not found')
    await updatePost(post._path, post._sha, {
      id,
      slug: slug || toSlug(title),
      title,
      category,
      content,
      date,
    })
    await loadPosts()
  }

  async function deletePost(id) {
    if (!isTokenSet()) throw new Error('NO_TOKEN')
    const post = allPosts.value.find((p) => p.id === id)
    if (!post) throw new Error('Post not found')
    await apiDeletePost(post._path, post._sha)
    await loadPosts()
  }

  return {
    allPosts,
    loading,
    loaded,
    loadPosts,
    findBySlug,
    findById,
    savePost,
    savePostWithId,
    deletePost,
  }
}
