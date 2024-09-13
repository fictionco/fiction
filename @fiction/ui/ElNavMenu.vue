<script lang="ts" setup>
import type { NavGroup, NavItem, vue } from '@fiction/core'
import { getNavComponentType } from '@fiction/core'

defineProps({
  menu: { type: Object as vue.PropType<NavGroup[]>, default: undefined },
})

async function handleClick(event: MouseEvent, item: NavItem): Promise<void> {
  if (item.onClick) {
    event.preventDefault()
    event.stopPropagation()
    await item.onClick({ event, item })
  }
}
</script>

<template>
  <div class="space-y-4 font-sans md:space-y-6">
    <div
      v-for="(menuGroup, i) in menu"
      :key="i"
      class="menu-group"
    >
      <div class="mb-1 flex items-center space-x-3 pb-1 pr-3">
        <div
          v-if="menuGroup.title"
          class="text-theme-300 dark:text-theme-500 truncate text-xs font-semibold uppercase tracking-wide"
        >
          {{ menuGroup.title }}
        </div>
      </div>
      <div v-if="menuGroup.items" class="nav-menu space-y-1">
        <component
          :is="getNavComponentType(sub)"
          v-for="(sub, ii) in menuGroup.items"
          :key="ii"
          class="nav-item flex cursor-pointer items-center space-x-3 truncate rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none"
          :to="sub.href"
          :href="sub.href"
          :class="
            sub.isActive
              ? 'bg-theme-200 dark:bg-theme-800 text-theme-900 dark:text-theme-0'
              : 'hover:bg-theme-100 dark:hover:bg-theme-700 active:bg-theme-200 dark:hover:bg-theme-600 text-theme-600 dark:text-theme-0 dark:hover:text-theme-200 hover:text-theme-900 border-theme-0'
          "
          @click="handleClick($event, sub)"
        >
          <div
            v-if="sub.icon"
            class="text-[1.4em]"
            :class="sub.isActive ? 'text-theme-900 ' : 'text-theme-500'"
          >
            <div :class="sub.icon" />
          </div>
          <div class="">
            {{ sub.name }}
          </div>
        </component>
      </div>
    </div>
  </div>
</template>

<style lang="less"></style>
