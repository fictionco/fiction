<script lang="ts" setup>
import type { Card } from '@fiction/site/card'
import type { MediaObject, NavItem, vue } from '@fiction/core'
import { getNavComponentType, toLabel, useService } from '@fiction/core'
import ElImage from '@fiction/ui/media/ElImage.vue'
import ElAvatarOrg from './ElAvatarOrg.vue'

defineProps({
  icon: { type: Object as vue.PropType<MediaObject>, default: undefined },
  nav: { type: Array as vue.PropType<NavItem[]>, default: () => [] },
  card: { type: Object as vue.PropType<Card>, required: true },
})

const service = useService()

async function handleClick(event: MouseEvent, item: NavItem): Promise<void> {
  if (item.onClick) {
    event.preventDefault()
    event.stopPropagation()
    await item.onClick({ event, item })
  }
}

const cls = {
  active: 'font-semibold bg-primary-100/50 text-primary-800 hover:text-primary-500 dark:bg-primary-600/50 ring-1 dark:ring-primary-600 dark:text-primary-0',
  inactive: 'font-medium text-theme-700 dark:text-theme-200 dark:hover:bg-theme-700 hover:text-theme-900 border-theme-0',

}
</script>

<template>
  <div class="flex h-full min-w-0 grow flex-col justify-between">
    <div class="space-y-1 font-sans">
      <div class="flex items-center justify-center space-x-3 mb-5 px-3 py-2">
        <div class=" ">
          <div class="rounded-full flex items-center justify-center">
            <RouterLink :to="card.link('/')" class="text-xl text-theme-700 hover:text-primary-500 dark:text-theme-0 dark:hover:text-primary-300 transition-all px-4 py-2.5 rounded-md">
              <ElImage class="h-[21px]" :media="icon" />
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="p-3 space-y-2">
        <div
          v-for="(sub, i) in nav"
          :key="i"
          class="menu-group"
        >
          <div class="nav-menu">
            <component
              :is="getNavComponentType(sub)"
              class="antialiased group nav-item flex cursor-pointer items-center py-3 px-4 space-x-3 truncate rounded-full font-sans text-base  focus:outline-none transition-all duration-100"
              :to="sub.href"
              :href="sub.href"
              :class=" sub.isActive ? cls.active : cls.inactive "
              @click="handleClick($event, sub)"
            >
              <div v-if="sub.icon" class="text-2xl" :class="sub.icon" />
              <div class="pt-0.5" v-html="toLabel(sub.name)" />
            </component>
          </div>
        </div>
      </div>
    </div>
    <div class="mb-4 p-3">
      <RouterLink :to="card.link('/settings')" class="flex items-center gap-x-4 p-3 rounded-full" :class="card.site?.siteRouter.params.value.viewId === 'settings' ? cls.active : cls.inactive">
        <ElAvatarOrg class="size-8  shrink-0 " />
        <div class=" min-w-0">
          <div class="sm:text-xs lg:text-sm whitespace-nowrap truncate">
            {{ service.fictionUser.activeOrganization.value?.orgName || 'Unnamed Org' }}
          </div>
          <div class="text-xs opacity-50">
            Settings
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
