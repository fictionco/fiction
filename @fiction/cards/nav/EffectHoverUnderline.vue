<script lang="ts" setup>
import type { NavItem, vue } from '@fiction/core'
import ElNavLink from '@fiction/ui/ElNavLink.vue'
import type { SchemaNavItem } from './index.js'

defineProps({
  item: { type: Object as vue.PropType<SchemaNavItem>, required: true },
  depth: { type: Number, default: 0 },
})
</script>

<template>
  <ElNavLink :item class="flex items-center gap-1" :depth>
    <span class="menu-text relative after:border-t-2 after:border-primary-500 dark:after:border-primary-400 after:rounded-lg" :class="item.isActive ? 'active' : ''" v-html="item.name" />
  </ElNavLink>
</template>

<style lang="less">
.menu-text:after{
  transition: transform .2s ease-out,border-color .2s ease-out;
  position: absolute;
  display: block;
  bottom: -6px;
  left: 0;
  width: 100%;
  transform: scaleX(0);
  content: "";
  padding-bottom: inherit;
}

.menu-text:hover:after{
  transform: scaleX(1);
}

.menu-text.active:after{
  transform: scaleX(1);
}
</style>
