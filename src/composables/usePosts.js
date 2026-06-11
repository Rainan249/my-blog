import { computed } from 'vue'
import { posts as builtInPosts } from '../data/posts.js'

const customPosts = computed(() => {
  return JSON.parse(localStorage.getItem('customPosts') || '[]')
})

export function usePosts() {
  const allPosts = computed(() => {
    return [...customPosts.value, ...builtInPosts].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )
  })

  function findBySlug(slug) {
    return allPosts.value.find(p => p.slug === slug)
  }

  function deletePost(id) {
    const posts = JSON.parse(localStorage.getItem('customPosts') || '[]')
    localStorage.setItem(
      'customPosts',
      JSON.stringify(posts.filter(p => p.id !== id))
    )
  }

  return { allPosts, findBySlug, deletePost }
}
