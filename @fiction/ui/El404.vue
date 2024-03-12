<script lang="ts" setup>
import type { ActionItem, vue } from '@fiction/core'
import ElButton from './ElButton.vue'

defineProps({
  superHeading: { type: String, default: undefined },
  heading: { type: String, default: undefined },
  subHeading: { type: String, default: undefined },
  actions: { type: Array as vue.PropType<ActionItem[]>, default: undefined },
})
</script>

<template>
  <div class="grid min-h-full place-items-center  px-6 py-24 sm:py-32 lg:px-8 v-dvh">
    <div class="text-center">
      <p class="text-base font-semibold text-theme-400">
        {{ superHeading || '404' }}
      </p>
      <h1 class="mt-4 text-3xl font-bold tracking-tight sm:text-5xl x-font-title">
        {{ heading || 'Page not found' }}
      </h1>
      <p class="mt-6 text-base font-sans leading-7 text-theme-600">
        {{ subHeading || `Nothing found at this URL` }}
      </p>
      <div class="mt-10 flex items-center justify-center gap-x-6">
        <ElButton
          v-for="(item, i) in actions"
          :key="i"
          :href="item.href"
          :btn="item.btn"
          @click.stop="item.onClick && item.onClick({ event: $event })"
        >
          {{ item.name }}
        </ElButton>
      </div>
    </div>
  </div>
</template>
