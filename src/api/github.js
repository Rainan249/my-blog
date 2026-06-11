const REPO = 'Rainan249/my-blog'
const CONTENT_DIR = 'content/posts'
const API = 'https://api.github.com'

function getAuth() {
  return JSON.parse(localStorage.getItem('githubAuth') || '{}')
}

function getToken() {
  return getAuth().token || ''
}

function headers() {
  const h = {
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  }
  const token = getToken()
  if (token) h.Authorization = `token ${token}`
  return h
}

function toSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9一-鿿]+/g, '-')
    .replace(/^-|-$/g, '')
}

function parseMd(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { meta: {}, content: raw.trim() }
  const meta = {}
  match[1].split('\n').forEach((line) => {
    const idx = line.indexOf(':')
    if (idx > 0) {
      const key = line.slice(0, idx).trim()
      let val = line.slice(idx + 1).trim()
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
      meta[key] = val
    }
  })
  return { meta, content: match[2].trim() }
}

function buildMd(meta, content) {
  const lines = Object.entries(meta)
    .map(([k, v]) => {
      const val = String(v)
      return val.includes(':') || val.includes('#') || val.includes('"')
        ? `${k}: "${val.replace(/"/g, '\\"')}"`
        : `${k}: ${val}`
    })
    .join('\n')
  return `---\n${lines}\n---\n\n${content}`
}

async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, { headers: headers(), ...options })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || `GitHub API error: ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

async function fetchAllPosts() {
  let files
  try {
    files = await request(`/repos/${REPO}/contents/${CONTENT_DIR}`)
  } catch {
    return []
  }
  if (!Array.isArray(files)) return []

  const posts = await Promise.all(
    files
      .filter((f) => f.name.endsWith('.md'))
      .map(async (f) => {
        try {
          const data = await request(`/repos/${REPO}/contents/${CONTENT_DIR}/${f.name}`)
          const raw = decodeURIComponent(
            escape(atob(data.content.replace(/\n/g, '')))
          )
          const { meta, content } = parseMd(raw)
          return {
            id: Number(meta.id) || f.name.hashCode?.() || 0,
            slug: meta.slug || f.name.replace(/\.md$/, ''),
            title: meta.title || f.name.replace(/\.md$/, ''),
            excerpt:
              meta.excerpt ||
              content.replace(/[#*`>\-\n]/g, ' ').slice(0, 120) + '...',
            date: meta.date || f.name.slice(0, 10),
            category: meta.category || '未分类',
            readTime: meta.readTime || '3 分钟',
            content,
            _sha: data.sha,
            _path: data.path,
          }
        } catch {
          return null
        }
      })
  )

  return posts
    .filter(Boolean)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

async function fetchPostBySlug(slug) {
  const files = await request(`/repos/${REPO}/contents/${CONTENT_DIR}`)
  if (!Array.isArray(files)) return null

  for (const f of files) {
    if (!f.name.endsWith('.md')) continue
    try {
      const data = await request(`/repos/${REPO}/contents/${CONTENT_DIR}/${f.name}`)
      const raw = decodeURIComponent(
        escape(atob(data.content.replace(/\n/g, '')))
      )
      const { meta, content } = parseMd(raw)
      if (meta.slug === slug || f.name.replace(/\.md$/, '') === slug) {
        return {
          id: Number(meta.id) || 0,
          slug: meta.slug || f.name.replace(/\.md$/, ''),
          title: meta.title || f.name.replace(/\.md$/, ''),
          excerpt:
            meta.excerpt ||
            content.replace(/[#*`>\-\n]/g, ' ').slice(0, 120) + '...',
          date: meta.date || f.name.slice(0, 10),
          category: meta.category || '未分类',
          readTime: meta.readTime || '3 分钟',
          content,
          _sha: data.sha,
          _path: data.path,
        }
      }
    } catch {
      continue
    }
  }
  return null
}

async function createPost(post) {
  const slug = toSlug(post.title)
  const filename = `${slug}.md`
  const meta = {
    id: Date.now(),
    slug,
    title: post.title,
    category: post.category || '未分类',
    date: new Date().toISOString().split('T')[0],
    readTime: Math.max(1, Math.ceil(post.content.length / 500)) + ' 分钟',
    excerpt: post.content.replace(/[#*`>\-\n]/g, ' ').slice(0, 120) + '...',
  }
  const body = buildMd(meta, post.content)
  return request(`/repos/${REPO}/contents/${CONTENT_DIR}/${filename}`, {
    method: 'PUT',
    body: JSON.stringify({
      message: `feat: add post "${post.title}"`,
      content: btoa(unescape(encodeURIComponent(body))),
    }),
  })
}

async function updatePost(filename, sha, post) {
  const meta = {
    id: post.id,
    slug: post.slug || toSlug(post.title),
    title: post.title,
    category: post.category || '未分类',
    date: post.date || new Date().toISOString().split('T')[0],
    readTime: Math.max(1, Math.ceil(post.content.length / 500)) + ' 分钟',
    excerpt: post.content.replace(/[#*`>\-\n]/g, ' ').slice(0, 120) + '...',
  }
  const body = buildMd(meta, post.content)
  return request(`/repos/${REPO}/contents/${filename}`, {
    method: 'PUT',
    body: JSON.stringify({
      message: `update: "${post.title}"`,
      content: btoa(unescape(encodeURIComponent(body))),
      sha,
    }),
  })
}

async function deletePost(filename, sha) {
  return request(`/repos/${REPO}/contents/${filename}`, {
    method: 'DELETE',
    body: JSON.stringify({
      message: `delete: "${filename}"`,
      sha,
    }),
  })
}

export function isTokenSet() {
  return !!getToken()
}

export function saveToken(token) {
  localStorage.setItem('githubAuth', JSON.stringify({ token }))
}

export function clearToken() {
  localStorage.removeItem('githubAuth')
}

export {
  toSlug,
  fetchAllPosts,
  fetchPostBySlug,
  createPost,
  updatePost,
  deletePost,
}
