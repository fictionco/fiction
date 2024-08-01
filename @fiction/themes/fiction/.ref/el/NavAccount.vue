<script lang="ts" setup>
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import type { NavItem,
} from '@fiction/core'
import { getNavComponentType, onResetUi, resetUi, useService, vue } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import type { UserConfig } from './ElHeader.vue'

defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
  accountMenu: { type: Array as vue.PropType<NavItem[]>, required: true },
})

const { fictionUser } = useService()

const vis = vue.ref(false)
async function toggle(): Promise<void> {
  if (vis.value) {
    vis.value = false
  }
  else {
    resetUi({ scope: 'all', cause: 'NavAccount' })
    vis.value = true
  }
}

onResetUi(() => {
  vis.value = false
})
</script>

<template>
  <div class="relative flex items-center font-medium">
    <div
      v-if="fictionUser.activeUser.value"
      class="group flex cursor-pointer items-center space-x-2 hover:opacity-80 active:opacity-80 text-theme-500 select-none"
      @click.stop.prevent="toggle()"
    >
      <ElAvatar class="ml-3 h-7 w-7 rounded-full ring-2 ring-theme-200 dark:ring-theme-0" :email="fictionUser.activeUser?.value.email" />
      <div class="i-tabler-chevron-down text-lg transition-all" :class="vis ? 'rotate-180' : ''" />
    </div>

    <transition
      enter-from-class="translate-x-8 opacity-0"
      enter-to-class="opacity-100 translate-x-0"
      enter-active-class="transition ease-[cubic-bezier(0.25,1,0.33,1)] duration-200 origin-top-right"
      leave-active-class="transition ease-[cubic-bezier(0.25,1,0.33,1)] duration-200 origin-top-right"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="translate-x-8 opacity-0"
    >
      <div
        v-show="vis"
        class="absolute right-0 z-30 mt-2 w-72 origin-top-right divide-y divide-theme-200 dark:divide-theme-600 rounded-md bg-white dark:bg-theme-800 text-left font-sans text-theme-800 dark:text-theme-0 shadow-lg ring-1 ring-black/10 dark:ring-theme-600 focus:outline-none"
        :style="{ top: 'calc(100% + 20px)' }"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabindex="-1"
      >
        <div v-if="fictionUser.activeUser.value" class="p-5 text-sm">
          <div class="text-sm text-theme-400">
            Signed in as...
          </div>
          <p class="truncate text-lg font-bold">
            {{ fictionUser.activeUser.value?.fullName || fictionUser.activeUser.value?.email }}
          </p>
        </div>
        <div class="p-3" role="none">
          <component
            :is="getNavComponentType(item)"
            v-for="(item, i) in accountMenu"
            :key="i"
            class="flex space-x-3 cursor-pointer p-3 text-base items-center rounded-lg"
            :class=" item.isActive ? 'bg-theme-100 text-primary-500 font-semibold' : 'text-theme-700 dark:text-theme-0 hover:bg-theme-50 dark:hover:bg-theme-700' "
            :to="item.href"
            :href="item.href"
            role="menuitem"
            tabindex="-1"
            @click="item.onClick ? item.onClick({ event: $event }) : null"
          >
            <div class="text-xl" :class="item.icon" /> <div>{{ item.name }}</div>
          </component>
        </div>
      </div>
    </transition>
  </div>
</template>
