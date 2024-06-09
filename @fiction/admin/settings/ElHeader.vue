<script lang="ts" setup>
import type { ActionItem, MediaDisplayObject, vue } from '@fiction/core'
import ElButton from '@fiction/ui/ElButton.vue'

defineProps({
  heading: { type: String, default: 'Settings' },
  subheading: { type: String, default: '' },
  actions: { type: Array as vue.PropType<ActionItem[]>, default: () => [] },
  avatar: { type: Object as vue.PropType<MediaDisplayObject>, default: undefined },
})
</script>

<template>
  <div class="md:flex md:items-center md:justify-between md:space-x-5 ">
    <div class="flex items-start space-x-5">
      <div v-if="avatar?.url" class="flex-shrink-0">
        <div class="relative">
          <div
            class="bg-theme-300 dark:bg-theme-600 size-16 rounded-full ring-2 ring-theme-800 dark:ring-theme-0 fiction-avatar avatar bg-cover bg-center relative overflow-hidden"
          >
            <img class="object-cover inset-0 " :src="avatar.url">
          </div>
          <span class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true" />
        </div>
      </div>
      <div class="pt-1.5 space-y-1">
        <h1 class="text-2xl font-semibold text-theme-900 dark:text-theme-0 x-font-title">
          {{ heading }}
        </h1>
        <p class="text-sm font-normal text-theme-500 dark:text-theme-300">
          {{ subheading }}
        </p>
      </div>
    </div>
    <div class="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-3 sm:space-y-0 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
      <ElButton v-for="(action, i) in actions" :key="i" size="sm" :icon="action.icon" @click.stop="action.onClick?.({ event: $event })">
        {{ action.name }}
      </ElButton>
    </div>
  </div>
</template>
