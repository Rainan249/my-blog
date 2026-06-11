import { computed } from 'vue'
import { posts as builtInPosts } from '../data/posts.js'

function getCustomPosts() {
  return JSON.parse(localStorage.getItem('customPosts') || '[]')
}

function setCustomPosts(posts) {
  localStorage.setItem('customPosts', JSON.stringify(posts))
}

function getDeletedIds() {
  return JSON.parse(localStorage.getItem('deletedPostIds') || '[]')
}

function setDeletedIds(ids) {
  localStorage.setItem('deletedPostIds', JSON.stringify(ids))
}

function makeSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9一-鿿]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function usePosts() {
  const allPosts = computed(() => {
    const deletedIds = getDeletedIds()
    const custom = getCustomPosts()
    const builtIn = builtInPosts.filter(p => !deletedIds.includes(p.id))
    return [...custom, ...builtIn].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )
  })

  function findBySlug(slug) {
    return allPosts.value.find(p => p.slug === slug)
  }

  function findById(id) {
    return allPosts.value.find(p => p.id === id)
  }

  function savePost({ title, category, content }) {
    const posts = getCustomPosts()
    const newPost = {
      id: Date.now(),
      slug: makeSlug(title),
      title,
      excerpt: content.replace(/[#*`>\-\n]/g, ' ').slice(0, 120) + '...',
      date: new Date().toISOString().split('T')[0],
      category: category || '未分类',
      readTime: Math.max(1, Math.ceil(content.length / 500)) + ' 分钟',
      content,
    }
    posts.unshift(newPost)
    setCustomPosts(posts)
    return newPost
  }

  function updatePost(id, { title, category, content }) {
    const custom = getCustomPosts()
    const idx = custom.findIndex(p => p.id === id)
    if (idx !== -1) {
      custom[idx] = {
        ...custom[idx],
        title,
        slug: makeSlug(title),
        category,
        content,
        excerpt: content.replace(/[#*`>\-\n]/g, ' ').slice(0, 120) + '...',
        readTime: Math.max(1, Math.ceil(content.length / 500)) + ' 分钟',
      }
      setCustomPosts(custom)
    } else {
      // Built-in post: convert to custom with new id
      const post = builtInPosts.find(p => p.id === id)
      if (post) {
        const newPost = {
          ...post,
          id: Date.now(),
          slug: makeSlug(title),
          title,
          category,
          content,
          excerpt: content.replace(/[#*`>\-\n]/g, ' ').slice(0, 120) + '...',
          readTime: Math.max(1, Math.ceil(content.length / 500)) + ' 分钟',
        }
        custom.unshift(newPost)
        setCustomPosts(custom)
        // Mark original as deleted
        const deleted = getDeletedIds()
        deleted.push(id)
        setDeletedIds(deleted)
      }
    }
  }

  function deletePost(id) {
    const custom = getCustomPosts()
    const isCustom = custom.some(p => p.id === id)
    if (isCustom) {
      setCustomPosts(custom.filter(p => p.id !== id))
    } else {
      // Built-in post: mark as deleted
      const deleted = getDeletedIds()
      deleted.push(id)
      setDeletedIds(deleted)
    }
  }

  return { allPosts, findBySlug, findById, savePost, updatePost, deletePost }
}
