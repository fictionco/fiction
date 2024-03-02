<script lang="ts" setup>
import type { MediaDisplayObject, NavItem, vue } from '@fiction/core'
import { getNavComponentType, toLabel, useService } from '@fiction/core'
import ElImage from '@fiction/ui/ElImage.vue'
import type { Card } from '../../../card'

const props = defineProps({
  icon: { type: Object as vue.PropType<MediaDisplayObject>, default: undefined },
  nav: { type: Array as vue.PropType<NavItem[]>, default: () => [] },
  card: { type: Object as vue.PropType<Card>, required: true },
})

const { factorUser } = useService()

async function handleClick(event: MouseEvent, item: NavItem): Promise<void> {
  if (item.onClick) {
    event.preventDefault()
    event.stopPropagation()
    await item.onClick({ event, item })
  }
}
</script>

<template>
  <div class="space-y-1 font-sans">
    <div class="flex items-center  rounded-full space-x-3 mb-5 px-3 py-2">
      <div class=" ">
        <div class=" rounded-full  flex items-center justify-center">
          <RouterLink :to="card.link('/')" class="text-xl dark:text-theme-0 text-primary-600 dark:hover:text-primary-500 transition-all">
            <ElImage class="size-8" :media="icon" />
          </RouterLink>
        </div>
      </div>
      <div class="font-bold leading-tight pr-2 min-w-0" />
    </div>

    <div
      v-for="(sub, i) in nav"
      :key="i"
      class="menu-group"
    >
      <div class="nav-menu">
        <component
          :is="getNavComponentType(sub)"
          class="group nav-item flex  cursor-pointer items-center py-3 px-4 space-x-3 truncate rounded-full font-semibold text-lg antialiased  focus:outline-none transition-all duration-100"
          :to="sub.href"
          :href="sub.href"
          :class="
            sub.isActive
              ? 'text-primary-600 bg-primary-50 hover:bg-primary-100 dark:bg-primary-975 dark:text-primary-400 dark:hover:bg-primary-900 '
              : 'text-theme-700 dark:text-theme-0 dark:hover:bg-primary-975 hover:text-theme-900 border-theme-0'
          "
          @click="handleClick($event, sub)"
        >
          <div class="">
            <div
              v-if="sub.icon"
              class="text-2xl"
            >
              <div :class="sub.icon" />
            </div>
          </div>
          <div class="pt-0.5">
            {{ toLabel(sub.name) }}
          </div>
        </component>
      </div>
    </div>
  </div>
</template>

<style lang="less"></style>
