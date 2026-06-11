<script setup>
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { marked, Renderer } from 'marked'
import { usePosts } from '../composables/usePosts.js'

const route = useRoute()
const { allPosts, loading, loadPosts, findBySlug } = usePosts()

onMounted(() => {
  if (!allPosts.value.length) loadPosts()
})

const post = computed(() => findBySlug(route.params.slug))

// Extract plain text from marked tokens
function tokensToText(tokens) {
  if (!tokens) return ''
  return tokens
    .map((t) => {
      if (t.text) return t.text
      if (t.tokens) return tokensToText(t.tokens)
      return ''
    })
    .join('')
}

const headings = ref([])
const activeId = ref('')
const tocOpen = ref(true)

const formattedContent = computed(() => {
  if (!post.value) return ''
  const renderer = new Renderer()
  const toc = []

  renderer.heading = function ({ tokens, depth }) {
    const rawText = tokensToText(tokens)
    const id = rawText
      .toLowerCase()
      .replace(/[^a-z0-9一-鿿]+/g, '-')
      .replace(/^-|-$/g, '')
    toc.push({ id, text: rawText, depth })
    const inner = this.parser.parseInline(tokens)
    return `<h${depth} id="${id}" class="md-heading md-h${depth}">${inner}</h${depth}>\n`
  }

  renderer.code = function ({ text, lang }) {
    const langLabel = lang || ''
    return `<div class="md-code-block"><div class="md-code-lang">${langLabel}</div><pre><code class="language-${langLabel}">${text}</code></pre></div>\n`
  }

  renderer.table = function ({ header, rows }) {
    const headerCells = header
      .map((cell) => `<th class="md-table-th">${this.parser.parseInline(cell.tokens)}</th>`)
      .join('')
    const bodyRows = rows
      .map((row) => {
        const cells = row
          .map((cell) => `<td class="md-table-td">${this.parser.parseInline(cell.tokens)}</td>`)
          .join('')
        return `<tr class="md-table-tr">${cells}</tr>`
      })
      .join('')
    return `<div class="md-table-wrap"><table class="md-table"><thead><tr class="md-table-tr">${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table></div>\n`
  }

  renderer.blockquote = function ({ tokens }) {
    return `<blockquote class="md-blockquote">${this.parser.parse(tokens)}</blockquote>\n`
  }

  renderer.list = function (token) {
    const tag = token.ordered ? 'ol' : 'ul'
    const cls = token.ordered ? 'md-list md-list-ol' : 'md-list md-list-ul'
    const body = token.items.map((item) => this.listitem(item)).join('')
    return `<${tag} class="${cls}">${body}</${tag}>\n`
  }

  renderer.listitem = function ({ tokens }) {
    return `<li class="md-list-item">${this.parser.parse(tokens)}</li>\n`
  }

  renderer.link = function ({ href, tokens }) {
    const text = this.parser.parseInline(tokens)
    return `<a href="${href}" target="_blank" rel="noopener" class="md-link">${text}</a>`
  }

  renderer.image = function ({ href, text }) {
    return `<figure class="md-figure"><img src="${href}" alt="${text}" class="md-img" loading="lazy" />${text ? `<figcaption class="md-figcaption">${text}</figcaption>` : ''}</figure>\n`
  }

  renderer.hr = function () {
    return `<hr class="md-hr" />\n`
  }

  renderer.paragraph = function ({ tokens }) {
    return `<p class="md-paragraph">${this.parser.parseInline(tokens)}</p>\n`
  }

  const html = marked.parse(post.value.content, { renderer })
  nextTick(() => {
    headings.value = toc
    if (toc.length) observeHeadings()
  })
  return html
})

// Intersection observer for active heading
let observer = null

function observeHeadings() {
  if (observer) observer.disconnect()
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      }
    },
    { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
  )
  nextTick(() => {
    document.querySelectorAll('.md-heading').forEach((el) => observer.observe(el))
  })
}

onUnmounted(() => {
  if (observer) observer.disconnect()
})

function scrollToHeading(id) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <article v-if="post" class="max-w-7xl mx-auto px-6 py-16">
    <div class="flex gap-0">
      <!-- TOC Sidebar (left) -->
      <aside v-if="headings.length > 1" class="hidden lg:flex flex-shrink-0 items-start">
        <!-- Collapse toggle -->
        <button
          @click="tocOpen = !tocOpen"
          class="sticky top-24 mt-1 w-6 h-6 flex items-center justify-center rounded-md border border-border text-text-muted hover:text-accent hover:border-accent transition-all duration-200 cursor-pointer flex-shrink-0"
          :title="tocOpen ? '收起目录' : '展开目录'"
        >
          <svg
            class="w-3.5 h-3.5 transition-transform duration-300"
            :class="tocOpen ? '' : '-rotate-90'"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Divider -->
        <div class="sticky top-24 h-[calc(100vh-8rem)] w-px bg-border ml-2 flex-shrink-0"></div>

        <!-- TOC content -->
        <transition name="toc">
          <div
            v-show="tocOpen"
            class="w-52 ml-4 overflow-hidden"
          >
            <div class="sticky top-24 max-h-[calc(100vh-10rem)] overflow-y-auto pr-2 scrollbar-thin">
              <h4 class="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">目录</h4>
              <nav class="space-y-0.5">
                <button
                  v-for="h in headings"
                  :key="h.id"
                  @click="scrollToHeading(h.id)"
                  class="block w-full text-left text-sm py-1 border-l-2 pl-3 transition-all duration-200 cursor-pointer"
                  :class="[
                    h.depth === 2 ? 'font-medium' : 'text-xs',
                    activeId === h.id
                      ? 'border-accent text-accent'
                      : 'border-transparent text-text-muted hover:text-text hover:border-border',
                    h.depth === 3 ? 'ml-3' : h.depth === 4 ? 'ml-6' : '',
                  ]"
                >
                  {{ h.text }}
                </button>
              </nav>
            </div>
          </div>
        </transition>
      </aside>

      <!-- Main content -->
      <div class="flex-1 min-w-0 max-w-3xl lg:ml-10">
        <!-- Back -->
        <router-link
          to="/blog"
          class="inline-flex items-center text-sm text-text-muted hover:text-accent transition-colors duration-200 mb-8 cursor-pointer"
        >
          &larr; 返回博客
        </router-link>

        <!-- Header -->
        <header class="mb-10">
          <div class="flex items-center gap-3 mb-4">
            <span class="text-xs font-medium text-accent bg-accent-light px-2.5 py-1 rounded-full">
              {{ post.category }}
            </span>
            <span class="text-xs text-text-muted">{{ post.readTime }}</span>
          </div>
          <h1 class="font-heading text-3xl md:text-4xl font-bold text-primary leading-tight mb-4">
            {{ post.title }}
          </h1>
          <time class="text-sm text-text-muted">{{ post.date }}</time>
        </header>

        <hr class="border-border mb-10" />

        <!-- Content -->
        <div class="prose-custom" v-html="formattedContent"></div>

        <!-- Back bottom -->
        <div class="mt-12 pt-8 border-t border-border">
          <router-link
            to="/blog"
            class="inline-flex items-center text-sm font-medium text-accent hover:text-accent/80 transition-colors duration-200 cursor-pointer"
          >
            &larr; 返回博客列表
          </router-link>
        </div>
      </div>
    </div>
  </article>

  <div v-else class="max-w-3xl mx-auto px-6 py-20 text-center">
    <h1 class="font-heading text-2xl font-bold text-primary mb-4">文章未找到</h1>
    <p class="text-text-muted mb-6">你访问的文章不存在。</p>
    <router-link to="/blog" class="text-accent hover:text-accent/80 transition-colors duration-200 cursor-pointer">
      返回博客列表
    </router-link>
  </div>
</template>
