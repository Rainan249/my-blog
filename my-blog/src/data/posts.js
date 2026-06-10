export const posts = [
  {
    id: 1,
    slug: 'vue3-composition-api-guide',
    title: 'Vue 3 Composition API 完全指南',
    excerpt: '深入理解 Vue 3 Composition API 的核心概念，从 ref、reactive 到 computed、watch，掌握现代 Vue 开发的最佳实践。',
    date: '2026-06-08',
    category: '前端开发',
    readTime: '8 分钟',
    content: `
## 为什么选择 Composition API

Vue 3 的 Composition API 不仅仅是一种新的写法，它解决了 Options API 在大型组件中的代码组织问题。当你需要在一个组件中处理多个关注点时，Composition API 让你可以按逻辑功能组织代码，而不是按选项类型。

## 核心响应式 API

### ref 与 reactive

\`ref\` 用于基本类型的响应式包装，而 \`reactive\` 适用于对象：

\`\`\`js
import { ref, reactive } from 'vue'

const count = ref(0)
const state = reactive({ name: '张三', age: 25 })

// ref 在 script 中需要 .value
count.value++

// reactive 直接访问
state.name = '李四'
\`\`\`

### computed 计算属性

computed 会自动追踪依赖变化，只有依赖改变时才重新计算：

\`\`\`js
const doubled = computed(() => count.value * 2)
\`\`\`

### watch 侦听器

watch 用于在状态变化时执行副作用：

\`\`\`js
watch(count, (newVal, oldVal) => {
  console.log(\`从 \${oldVal} 变为 \${newVal}\`)
})
\`\`\`

## 最佳实践

1. 新项目统一使用 \`<script setup>\` 语法
2. 用 \`ref\` 处理基本类型，\`reactive\` 处理对象
3. 组合式函数（Composables）替代 Mixins
4. 在 \`onMounted\` 中访问 DOM，在 \`onUnmounted\` 中清理资源

Composition API 让 Vue 的代码组织更加灵活和可维护，是现代 Vue 开发的首选方式。
    `,
  },
  {
    id: 2,
    slug: 'tailwind-css-best-practices',
    title: 'Tailwind CSS 实战：从入门到精通',
    excerpt: '探索 Tailwind CSS 的核心理念和实战技巧，学习如何用原子化 CSS 快速构建现代化的用户界面。',
    date: '2026-06-05',
    category: 'CSS',
    readTime: '6 分钟',
    content: `
## Tailwind 的设计哲学

Tailwind CSS 采用原子化（Atomic CSS）的方法，每个类名只做一件事。这种方法的好处是你可以完全在标记中定制设计，而不需要写自定义 CSS。

## 核心概念

### 响应式设计

Tailwind 使用移动优先的断点系统：

\`\`\`html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- 响应式网格布局 -->
</div>
\`\`\`

### 自定义主题

通过 \`tailwind.config.js\` 扩展默认主题：

\`\`\`js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: '#EC4899',
      },
    },
  },
}
\`\`\`

## 实战技巧

1. 使用 \`@apply\` 提取重复的工具类组合
2. 利用 \`group\` 和 \`peer\` 实现复杂的交互状态
3. 结合 \`dark:\` 前缀实现暗色模式
4. 用 \`transition-\` 工具类添加平滑过渡

Tailwind 不仅是一个 CSS 框架，更是一种设计系统的方法论。
    `,
  },
  {
    id: 3,
    slug: 'modern-web-performance',
    title: 'Web 性能优化：让页面飞起来',
    excerpt: '从前端性能指标到具体优化策略，全面了解如何打造极速的用户体验。涵盖懒加载、代码分割、图片优化等关键技术。',
    date: '2026-06-01',
    category: '性能优化',
    readTime: '10 分钟',
    content: `
## 核心性能指标

Google 定义的 Core Web Vitals 包含三个关键指标：

- **LCP** (Largest Contentful Paint)：最大内容绘制，目标 < 2.5s
- **FID** (First Input Delay)：首次输入延迟，目标 < 100ms
- **CLS** (Cumulative Layout Shift)：累积布局偏移，目标 < 0.1

## 优化策略

### 代码分割

使用动态 \`import()\` 按路由分割代码：

\`\`\`js
const routes = [
  { path: '/', component: () => import('./views/Home.vue') },
]
\`\`\`

### 图片优化

- 使用 WebP 格式替代 JPEG/PNG
- 实现响应式图片（srcset）
- 懒加载非首屏图片

### 缓存策略

利用 HTTP 缓存和 Service Worker 减少重复请求。

## 监控与度量

使用 Lighthouse、Web Vitals 库持续监控性能表现，建立性能预算。

性能优化是一个持续的过程，需要在开发和运维层面共同关注。
    `,
  },
  {
    id: 4,
    slug: 'css-grid-layout',
    title: 'CSS Grid 布局完全指南',
    excerpt: 'CSS Grid 是最强大的布局工具。从基础概念到高级技巧，掌握二维布局的精髓。',
    date: '2026-05-28',
    category: 'CSS',
    readTime: '7 分钟',
    content: `
## Grid 与 Flexbox 的区别

Grid 是二维布局系统，同时控制行和列；Flexbox 是一维布局，控制一个方向。Grid 适合页面整体布局，Flexbox 适合组件内部排列。

## 基础用法

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
\`\`\`

## 高级技巧

### Grid Template Areas

用命名区域直观地定义布局：

\`\`\`css
.layout {
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
}
\`\`\`

### 自动填充与自适应

\`auto-fill\` 和 \`auto-fit\` 配合 \`minmax()\` 实现响应式网格。

Grid 让复杂的布局变得简单优雅，是现代 CSS 的必备技能。
    `,
  },
  {
    id: 5,
    slug: 'git-workflow-tips',
    title: 'Git 工作流：团队协作的最佳实践',
    excerpt: '高效的 Git 工作流是团队协作的基石。从分支策略到代码审查，提升你的团队协作效率。',
    date: '2026-05-20',
    category: '工具',
    readTime: '5 分钟',
    content: `
## 分支策略

推荐使用 Git Flow 或 GitHub Flow：

- **main**：稳定的生产分支
- **develop**：开发集成分支
- **feature/***：功能开发分支
- **hotfix/***：紧急修复分支

## 提交规范

使用 Conventional Commits 格式：

\`\`\`
feat: 添加用户登录功能
fix: 修复首页加载问题
docs: 更新 API 文档
\`\`\`

## 代码审查

1. PR 描述要清晰说明变更内容和原因
2. 每次 PR 不超过 400 行变更
3. 至少一人审查后才能合并
4. 使用自动化测试确保代码质量

好的 Git 实践让团队协作更加顺畅高效。
    `,
  },
]
