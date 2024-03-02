<script setup lang="ts">
import type { NavItem } from '@fiction/core'
import { getNavComponentType, useService, vue } from '@fiction/core'

const props = defineProps({
  nav: { type: Array as vue.PropType<NavItem[]>, required: true },
  itemClass: { type: String, default: '' },
})
const { fictionRouter } = useService()
const nav = vue.computed(() => (props.nav || []).map(item => ({ ...item, isActive: item.href === fictionRouter.current.value.path })))
</script>

<template>
  <div>
    <component
      :is="getNavComponentType(item)"
      v-for="item in nav"
      :key="item.href"
      :to="item.href ?? '/'"
      :href="item.href ?? '/'"
      class="cursor-pointer   "
      :class="[item.isActive ? 'bg-theme-200' : '', itemClass]"
    >
      <span class="menu-text relative after:border-t-2 after:border-primary-500 px-1 after:rounded-lg" :class="item.isActive ? 'active' : ''" v-html="item.name" />
    </component>
  </div>
</template>

<style lang="less">
.menu-text:after{
  -webkit-transition: -webkit-transform .2s ease-out,border-color .2s ease-out;
  transition: transform .2s ease-out,border-color .2s ease-out;
  position: absolute;
  display: block;
  bottom: -6px;
  left: 0;
  width: 100%;
  -ms-transform: scaleX(0);
  -webkit-transform: scaleX(0);
  transform: scaleX(0);
  content: "";
  padding-bottom: inherit;
}

.menu-text:hover:after{
  -ms-transform: scaleX(1);
  -webkit-transform: scaleX(1);
  transform: scaleX(1);
}

.menu-text.active:after{
  -ms-transform: scaleX(1);
  -webkit-transform: scaleX(1);
  transform: scaleX(1);
}
</style>
