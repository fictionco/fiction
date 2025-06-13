<script lang="ts" setup>
import XButton from '@fiction/ui/buttons/XButton.vue'

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
    class="pt-12 lg:pt-24"
  >
    <div class="mx-auto max-w-3xl  bg-theme-100/50 dark:bg-theme-900/50 lg:flex lg:items-center lg:justify-between p-8 rounded-2xl">
      <h2 class="">
        <span class="mb-2 text-2xl sm:text-4xl block font-bold x-font-title tracking-tight">{{ title }}</span>
        <span class="block text-theme-500 dark:text-theme-200 text-lg sm:text-2xl">{{ subtitle }}</span>
      </h2>
      <div class="mt-4 flex lg:mt-0 lg:shrink-0">
        <slot>
          <XButton
            theme="primary"
            href="https://docs.fiction.com"
            class="font-bold shadow md:ml-3 md:py-2.5 md:px-7 md:text-lg"
          >
            Start Now &rarr;
          </XButton>
        </slot>
      </div>
    </div>
  </div>
</template>
