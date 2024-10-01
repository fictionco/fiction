<script lang="ts" setup>
import type { ActionItem, MediaObject, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElIndexItemMedia from '@fiction/ui/lists/ElIndexItemMedia.vue'

defineProps({
  heading: { type: String, default: 'Settings' },
  subheading: { type: String, default: '' },
  actions: { type: Array as vue.PropType<ActionItem[]>, default: () => [] },
  avatar: { type: Object as vue.PropType<MediaObject>, default: undefined },
})
</script>

<template>
  <div class="px-12 py-12  md:flex md:items-center md:justify-between md:space-x-5 ">
    <div class="flex items-center space-x-6">
      <div v-if="avatar" class="flex-shrink-0">
        <ElIndexItemMedia :media="avatar" />
      </div>
      <div class="pt-1.5 space-y-1">
        <h1 class="text-2xl font-semibold text-theme-900 dark:text-theme-0 x-font-title !leading-[1.1]">
          {{ heading }}
        </h1>
        <p class="text-sm font-normal text-theme-500 dark:text-theme-300">
          {{ subheading }}
        </p>
      </div>
    </div>
    <div class="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-3 sm:space-y-0 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
      <XButton v-for="(action, i) in actions" :key="i" size="sm" :icon="action.icon" @click.stop="action.onClick?.({ event: $event })">
        {{ action.name }}
      </XButton>
    </div>
  </div>
</template>
