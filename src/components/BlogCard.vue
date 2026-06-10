<script setup>
defineProps({
  post: { type: Object, required: true },
})
</script>

<template>
  <router-link
    :to="`/blog/${post.slug}`"
    class="group block bg-surface border border-border rounded-xl p-6 hover:border-accent/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
  >
    <div class="flex items-center gap-3 mb-3">
      <span class="text-xs font-medium text-accent bg-accent-light px-2.5 py-1 rounded-full">
        {{ post.category }}
      </span>
      <span class="text-xs text-text-muted">{{ post.readTime }}</span>
    </div>
    <h3 class="font-heading text-lg font-semibold text-primary mb-2 group-hover:text-accent transition-colors duration-200">
      {{ post.title }}
    </h3>
    <p class="text-sm text-text-muted leading-relaxed mb-4 line-clamp-2">
      {{ post.excerpt }}
    </p>
    <div class="flex items-center justify-between">
      <time class="text-xs text-text-muted">{{ post.date }}</time>
      <span class="text-xs font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        阅读全文 &rarr;
      </span>
    </div>
  </router-link>
</template>
