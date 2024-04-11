<script lang="ts" setup>
import type { NavItem, vue } from '@fiction/core'
import { getNavComponentType } from '@fiction/core'

defineProps({
  item: { type: Object as vue.PropType<NavItem>, required: true },
})
</script>

<template>
  <component
    :is="getNavComponentType(item)"
    :href="item.href"
    :to="item.href"
    :target="item.target ? item.target : '_self'"
    class="hover:text-primary-500 text-theme-800 dark:text-theme-50 dark:hover:text-theme-300 font-sans text-sm font-semibold"
  >
    {{ item.name }}
  </component>
</template>
