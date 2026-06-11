<template>
  <section class="max-w-6xl mx-auto px-6 py-16">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <!-- Sidebar -->
      <div class="lg:col-span-1">
        <div class="sticky top-24">
          <div class="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mb-5">
            <span class="font-heading text-3xl font-bold text-accent">R</span>
          </div>
          <h1 class="font-heading text-2xl font-bold text-primary mb-2">雨鹿</h1>
          <p class="text-sm text-text-muted mb-6">Student</p>
          <div class="flex gap-3">
            <a href="https://github.com/Rainan249" target="_blank" class="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-muted hover:text-accent hover:border-accent transition-all duration-200 cursor-pointer" aria-label="GitHub">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
            <a href="https://blog.csdn.net/" target="_blank" class="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-muted hover:text-accent hover:border-accent transition-all duration-200 cursor-pointer" aria-label="CSDN">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-8h2v8zm-6-8V7h2v2h-2z"/></svg>
            </a>
            <a href="mailto:2913756838@qq.com" class="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-muted hover:text-accent hover:border-accent transition-all duration-200 cursor-pointer" aria-label="Email">
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
            你好！我是一个学生，热衷于技术。
          </p>
          <p>
            喜欢探索新的技术，记录学习过程中的点滴，也希望通过这个博客和大家分享交流。
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
