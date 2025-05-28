<script lang="ts" setup>
import type { NavListItem, StandardSize } from '@fiction/core'
import { vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import XDropDown from '@fiction/ui/common/XDropDown.vue'

const {
  isDirty,
  navItems = [],
  classes = {},
  uiSize = 'md',
} = defineProps<{
  isDirty?: boolean
  navItems?: NavListItem[]
  changeType?: 'draft' | 'publish'
  classes?: { text?: string, icon?: string }
  uiSize?: StandardSize
}>()

const savedText = vue.computed(() => 'Saved')

const statusText = vue.computed(() => isDirty ? 'Saving' : savedText.value)
const statusColor = vue.computed(() => isDirty ? 'fill-orange-500' : 'fill-primary-500')
</script>

<template>
  <XDropDown :items="navItems" placement="bottom" mode="click" dropdown-alignment="center">
    <XButton
      :size="uiSize"
      design="link"
      :icon-after="navItems.length ? 'i-tabler-chevron-down' : undefined"
    >
      <div class="inline-flex items-center gap-x-2 ml-1">
        <svg class="size-1.5 transition-all" :class="statusColor" viewBox="0 0 6 6" aria-hidden="true">
          <circle cx="3" cy="3" r="3" />
        </svg>
        <span :key="statusText" :class="classes.text">{{ statusText }}</span>
      </div>
    </XButton>
  </XDropDown>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
