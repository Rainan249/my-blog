<script setup>
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

const route = useRoute()
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />
    <main class="flex-1" :class="route.name === 'blog-post' ? '' : 'pt-16'">
      <router-view />
    </main>
    <Footer v-if="route.name !== 'blog-post'" />
  </div>
</template>
