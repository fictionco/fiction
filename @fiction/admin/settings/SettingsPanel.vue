<script lang="ts" setup>
import type { ActionButton, PostObject } from '@fiction/core'
import ElActions from '@fiction/ui/buttons/ElActions.vue'
import ElHeader from './ElHeader.vue'

const { title, actions = [], header } = defineProps<{ title?: string, actions?: ActionButton[], header?: PostObject }>()
</script>

<template>
  <div>
    <div class="flex items-center justify-between p-4 border-b border-theme-300 dark:border-theme-700/70">
      <div class="font-semibold text-lg">
        {{ title || 'No Title' }}
      </div>
      <ElActions :actions class="flex justify-end" />
    </div>

    <div v-if="header" class="p-6">
      <ElHeader
        class="dark:bg-theme-700/50 rounded-xl p-8"
        :model-value="header"
      />
    </div>

    <slot />
  </div>
</template>
