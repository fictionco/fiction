<script lang="ts" setup>
import type { ActionButton } from '@fiction/core'
import ElActions from '@fiction/ui/buttons/ElActions.vue'

const { title, actions = [] } = defineProps<{ title?: string, actions?: ActionButton[] }>()
</script>

<template>
  <div>
    <div class="flex items-center justify-between p-4 border-b border-theme-300 dark:border-theme-700/70">
      <div class="font-semibold text-lg">
        {{ title || 'No Title' }}
      </div>
      <ElActions :actions class="flex justify-end" />
    </div>

    <slot />
  </div>
</template>
