<script lang="ts" setup>
import { vue } from '@factor/api'
import avatarBefore from '@fiction/core/img/avatar-before-1.png'
import avatarAfter1 from '@fiction/core/img/avatar-after-1.png'
import avatarAfter2 from '@fiction/core/img/avatar-after-2.jpg'
import ElSpinner from '@factor/ui/ElSpinner.vue'

const animateTrigger = vue.ref(false)
vue.onMounted(() => {
  const el = document.querySelector(`.feature-gen-avatar`) as HTMLElement

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          animateTrigger.value = true
          setTimeout(() => {
            animateTrigger.value = false
            observer.unobserve(el)
          }, 2000)
        }
      },
      { threshold: 0.3 },
    )
    if (el)
      observer.observe(el)
  }
})
</script>

<template>
  <div class="feature-gen-avatar flex items-center space-x-4 p-8">
    <div>
      <img
        class="ring-theme-200 w-16 rounded-lg shadow-lg ring-1"
        :src="avatarBefore"
      >
    </div>
    <div class="text-theme-600">
      <transition name="slideIn" mode="out-in">
        <ElSpinner v-if="animateTrigger" class="h-6 w-6" />
        <div v-else class="i-heroicons-arrow-right text-xl" />
      </transition>
    </div>

    <div>
      <transition name="slideIn" mode="out-in">
        <div
          v-if="animateTrigger"
          class="border-theme-300 text-theme-500 bg-theme-50 rounded-lg border p-3 text-xs font-bold uppercase tracking-widest md:px-6"
        >
          Generating
        </div>
        <div v-else class="flex space-x-4">
          <img
            class="ring-theme-200 w-16 rounded-lg shadow-lg ring-1"
            :src="avatarAfter1"
          >
          <img
            class="ring-theme-200 w-16 rounded-lg shadow-lg ring-1"
            :src="avatarAfter2"
          >
        </div>
      </transition>
    </div>
  </div>
</template>
