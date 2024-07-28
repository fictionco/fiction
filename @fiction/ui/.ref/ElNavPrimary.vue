<script lang="ts" setup>
import type { FictionRouter, MenuItem, vue } from '@fiction/core'
import { useService } from '@fiction/core'

defineProps({
  nav: { type: Array as vue.PropType<MenuItem[]>, default: () => [] },
})
useService<{
  fictionRouter: FictionRouter
}>()
</script>

<template>
  <div class="space-x-2 text-xs">
    <component
      :is="
        sub.route?.value.includes('http')
          ? 'a'
          : sub.route?.value
            ? 'RouterLink'
            : 'div'
      "
      v-for="(sub, ii) in nav"
      :key="ii"
      class="hidden cursor-pointer select-none rounded-full px-3 py-1 font-semibold md:inline-block"
      :to="sub.route?.value"
      :class="
        sub.active?.value
          ? 'text-white bg-theme-600 active'
          : 'bg-theme-200 hover:bg-theme-300 text-theme-500 hover:text-theme-600'
      "
      @click.stop="sub.onClick ? sub.onClick($event) : ''"
    >
      <span class="">{{ sub.name }}</span>
    </component>
  </div>
</template>
