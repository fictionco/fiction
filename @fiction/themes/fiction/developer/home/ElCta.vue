<script lang="ts" setup>
import ElButton from '@fiction/ui/ElButton.vue'

defineProps({
  title: {
    type: String,
    default: 'Ready to try it?',
  },
  subtitle: {
    type: String,
    default: 'Up and running in 5 Minutes',
  },
})
</script>

<template>
  <div
    class="mx-auto max-w-3xl pt-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:pt-24 "
  >
    <h2 class="">
      <span class="mb-2 text-lg sm:text-4xl block font-bold x-font-title tracking-tight">{{ title }}</span>
      <span class="block text-theme-500 dark:text-theme-200 text-2xl">{{ subtitle }}</span>
    </h2>
    <div class="mt-4 flex lg:mt-0 lg:shrink-0">
      <slot>
        <ElButton
          btn="primary"
          href="https://docs.fiction.com"
          class="font-bold shadow md:ml-3 md:py-2.5 md:px-7 md:text-lg"
        >
          Start Now &rarr;
        </ElButton>
      </slot>
    </div>
  </div>
</template>
