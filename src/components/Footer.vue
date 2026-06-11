<script setup>
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-border bg-surface">
    <div class="max-w-6xl mx-auto px-6 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Brand -->
        <div>
          <h3 class="font-heading text-lg font-bold text-primary mb-3">雨鹿</h3>
          <p class="text-sm text-text-muted leading-relaxed">
            立志成为一个糕手，记录学习与探索的旅程。
          </p>
        </div>

        <!-- Links -->
        <div>
          <h4 class="text-sm font-semibold text-primary mb-3">导航</h4>
          <ul class="space-y-2">
            <li><router-link to="/" class="text-sm text-text-muted hover:text-accent transition-colors duration-200 cursor-pointer">首页</router-link></li>
            <li><router-link to="/blog" class="text-sm text-text-muted hover:text-accent transition-colors duration-200 cursor-pointer">博客</router-link></li>
            <li><router-link to="/about" class="text-sm text-text-muted hover:text-accent transition-colors duration-200 cursor-pointer">关于</router-link></li>
          </ul>
        </div>

        <!-- Social -->
        <div>
          <h4 class="text-sm font-semibold text-primary mb-3">社交</h4>
          <ul class="space-y-2">
            <li><a href="https://github.com/Rainan249" target="_blank" class="text-sm text-text-muted hover:text-accent transition-colors duration-200 cursor-pointer">GitHub</a></li>
            <li><a href="https://blog.csdn.net/" target="_blank" class="text-sm text-text-muted hover:text-accent transition-colors duration-200 cursor-pointer">CSDN</a></li>
            <li><a href="mailto:2913756838@qq.com" class="text-sm text-text-muted hover:text-accent transition-colors duration-200 cursor-pointer">Email</a></li>
          </ul>
        </div>
      </div>

      <div class="mt-10 pt-6 border-t border-border text-center">
        <p class="text-xs text-text-muted">&copy; {{ currentYear }} 雨鹿. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>
