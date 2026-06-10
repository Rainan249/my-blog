<template>
  <section class="max-w-6xl mx-auto px-6 py-16">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <!-- Sidebar -->
      <div class="lg:col-span-1">
        <div class="sticky top-24">
          <div class="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mb-5">
            <span class="font-heading text-3xl font-bold text-accent">M</span>
          </div>
          <h1 class="font-heading text-2xl font-bold text-primary mb-2">墨迹</h1>
          <p class="text-sm text-text-muted mb-6">前端开发者 / 技术写作者</p>
          <div class="flex gap-3">
            <a href="#" class="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-muted hover:text-accent hover:border-accent transition-all duration-200 cursor-pointer" aria-label="GitHub">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
            <a href="#" class="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-muted hover:text-accent hover:border-accent transition-all duration-200 cursor-pointer" aria-label="Twitter">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="mailto:hello@example.com" class="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-muted hover:text-accent hover:border-accent transition-all duration-200 cursor-pointer" aria-label="Email">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="lg:col-span-2">
        <h2 class="font-heading text-2xl font-bold text-primary mb-6">关于我</h2>
        <div class="space-y-4 text-text-muted leading-relaxed">
          <p>
            你好！我是一名热爱技术的前端开发者，目前专注于 Vue.js 生态系统和现代 Web 开发。从第一次写出 "Hello World" 到现在，编程已经成为我生活中不可或缺的一部分。
          </p>
          <p>
            我相信好的代码应该像好的文章一样——清晰、简洁、有意义。这也是我创建这个博客的初衷：用文字记录技术探索的旅程，分享那些让我受益匪浅的知识和经验。
          </p>
          <p>
            在工作中，我热衷于探索用户体验与技术实现之间的平衡。前端不仅仅是实现设计稿，更是用代码创造有意义的交互体验。
          </p>
        </div>

        <h2 class="font-heading text-2xl font-bold text-primary mt-12 mb-6">技术栈</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div v-for="tech in ['Vue.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Git', 'Figma']" :key="tech"
            class="bg-surface border border-border rounded-lg px-4 py-3 text-sm font-medium text-text hover:border-accent/30 transition-colors duration-200">
            {{ tech }}
          </div>
        </div>

        <h2 class="font-heading text-2xl font-bold text-primary mt-12 mb-6">联系方式</h2>
        <p class="text-text-muted leading-relaxed">
          如果你想交流技术、合作项目，或者只是想打个招呼，欢迎通过邮件联系我。我会尽快回复你的消息。
        </p>
        <router-link
          to="/contact"
          class="inline-flex items-center mt-4 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors duration-200 cursor-pointer"
        >
          联系我
        </router-link>
      </div>
    </div>
  </section>
</template>
