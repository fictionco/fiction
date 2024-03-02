<script lang="ts" setup>
import type { vue } from '@factor/api'

defineProps({
  scheme: {
    type: String as vue.PropType<'dark' | 'light'>,
    default: 'light',
  },
  wrapClass: {
    type: String,
    default: '',
  },
  widthClass: {
    type: String,
    default: 'max-w-screen-xl',
  },
})
</script>

<template>
  <div>
    <div
      class="border-theme-300 relative z-10 mx-auto rounded-xl border bg-gradient-to-b shadow-md"
      :class="[
        scheme === 'dark'
          ? 'from-theme-900 via-theme-900 to-theme-700 text-theme-0'
          : 'from-theme-0 via-theme-0 to-theme-50 text-theme-800',
        wrapClass,
        widthClass,
      ]"
    >
      <slot />
    </div>
  </div>
</template>
