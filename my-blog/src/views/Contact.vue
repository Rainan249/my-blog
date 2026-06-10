<script setup>
import { ref } from 'vue'

const form = ref({ name: '', email: '', message: '' })
const submitted = ref(false)

function handleSubmit() {
  submitted.value = true
  form.value = { name: '', email: '', message: '' }
}
</script>

<template>
  <section class="max-w-6xl mx-auto px-6 py-16">
    <div class="max-w-2xl mx-auto">
      <h1 class="font-heading text-3xl md:text-4xl font-bold text-primary mb-3">联系我</h1>
      <p class="text-text-muted mb-10">有任何问题或想法？欢迎随时联系我。</p>

      <div v-if="submitted" class="bg-accent-light border border-accent/20 rounded-xl p-8 text-center">
        <div class="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="font-heading text-lg font-semibold text-primary mb-2">消息已发送</h3>
        <p class="text-sm text-text-muted">感谢你的来信，我会尽快回复。</p>
        <button
          @click="submitted = false"
          class="mt-6 text-sm font-medium text-accent hover:text-accent/80 transition-colors duration-200 cursor-pointer"
        >
          发送新消息
        </button>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="name" class="block text-sm font-medium text-primary mb-2">姓名</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-3 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:border-accent transition-colors duration-200"
              placeholder="你的名字"
            />
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-primary mb-2">邮箱</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:border-accent transition-colors duration-200"
              placeholder="your@email.com"
            />
          </div>
        </div>
        <div>
          <label for="message" class="block text-sm font-medium text-primary mb-2">消息</label>
          <textarea
            id="message"
            v-model="form.message"
            rows="5"
            required
            class="w-full px-4 py-3 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:border-accent transition-colors duration-200 resize-none"
            placeholder="写下你想说的..."
          ></textarea>
        </div>
        <button
          type="submit"
          class="w-full px-6 py-3 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors duration-200 cursor-pointer"
        >
          发送消息
        </button>
      </form>
    </div>
  </section>
</template>
