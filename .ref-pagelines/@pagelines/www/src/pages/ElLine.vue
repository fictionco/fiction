<script setup lang="ts">
import { vue } from '@factor/api'

defineProps({
  wrapClass: { type: String, default: '' },
  icon: { type: String, default: '' },
  iconTop: { type: String, default: 'h-32' },
})
const line = vue.ref<HTMLElement>()
const animateTrigger = vue.ref(false)

vue.onMounted(() => {
  const el = line.value

  if (!el)
    return
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          animateTrigger.value = true
          setTimeout(() => {
            animateTrigger.value = false
            observer.unobserve(el)
          }, 5000)
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
  <div ref="line" class="mx-auto max-w-7xl px-4 lg:px-8">
    <div class="grid grid-cols-12 gap-4">
      <div class="hidden flex-col md:col-span-1 md:flex">
        <div
          class="from-theme-0 to-theme-200 w-[3px] rounded-full bg-gradient-to-b transition-all md:ml-3"
          :class="[iconTop]"
        />
        <div class="text-theme-300 -ml-1.5 py-4 md:ml-0">
          <div class="text-xl md:text-3xl" :class="icon" />
        </div>
        <div
          class="from-theme-200 to-theme-0 h-full w-[3px] rounded-full bg-gradient-to-b md:ml-3"
        />
      </div>
      <div class="col-span-12 pl-4 md:col-span-11 md:pl-0">
        <slot />
      </div>
    </div>
  </div>
</template>
