<script lang="ts" setup>
import type { NavItem } from '@fiction/core'
import { vue } from '@fiction/core'
import XDropDown from '@fiction/ui/common/XDropDown.vue'

const {
  isDirty,
  navItems = [],
  changeType,
  classes = {},
} = defineProps<{
  isDirty: boolean
  navItems?: NavItem[]
  changeType?: 'draft' | 'publish'
  classes?: { text?: string, icon?: string }
}>()

const isOpen = vue.ref(false)

const savedText = vue.computed(() => changeType === 'draft' ? 'Draft Saved' : 'Changes Saved')

const statusText = vue.computed(() => isDirty ? 'Saving' : savedText.value)
const statusColor = vue.computed(() => isDirty ? 'fill-orange-500' : 'fill-green-500')
</script>

<template>
  <XDropDown v-slot="{ toggle }" :items="navItems" placement="bottom">
    <div class="flex items-center">
      <button
        :key="statusText"
        :aria-expanded="isOpen"
        class="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-theme-400 antialiased focus:outline-none"
        :class="navItems?.length ? 'hover:bg-theme-100 dark:hover:bg-theme-700 focus:ring-2 focus:ring-offset-2 focus:ring-offset-theme-100 dark:focus:ring-offset-theme-800 focus:ring-primary-500' : ''"
        @click.stop="toggle"
      >
        <svg class="size-1.5 transition-all" :class="statusColor" viewBox="0 0 6 6" aria-hidden="true">
          <circle cx="3" cy="3" r="3" />
        </svg>
        <span :key="statusText" :class="classes.text">{{ statusText }}</span>
        <svg
          v-if="navItems?.length"
          class="w-4 h-4 ml-1 hidden md:inline-block"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
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
