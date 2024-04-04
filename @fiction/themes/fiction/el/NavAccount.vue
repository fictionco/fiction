<script lang="ts" setup>
import ElAvatar from '@fiction/ui/ElAvatar.vue'
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
      class="group flex cursor-pointer items-center space-x-2 hover:opacity-90 active:opacity-80"
      @click.stop.prevent="toggle()"
    >
      <ElAvatar class="ml-3 h-7 w-7 rounded-full" :email="fictionUser.activeUser?.value.email" />
      <div class="flex w-4 flex-col items-end justify-center space-y-1">
        <div
          v-for="i in 3"
          :key="i"
          class="h-1 rounded-full"
          :class="[
            vis ? 'bg-theme-300 dark:bg-theme-600' : 'bg-theme-200 dark:bg-theme-600 group-hover:bg-theme-400 dark:group-hover:bg-theme-500',
            i === 2 ? 'w-3' : 'w-4',
          ]"
        />
      </div>
    </div>

    <transition
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      enter-active-class="transition ease-out duration-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-show="vis"
        class="absolute right-0 z-30 mt-2 w-72 origin-top-right divide-y divide-slate-200 rounded-md bg-white text-left font-sans text-slate-800 shadow-lg ring-1 ring-black/10 focus:outline-none"
        :style="{ top: 'calc(100% + 20px)' }"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabindex="-1"
      >
        <div v-if="fictionUser.activeUser.value" class="px-4 py-3 text-sm">
          <div class="text-xs text-slate-400">
            Signed in as...
          </div>
          <p class="truncate text-base font-bold">
            {{
              fictionUser.activeUser.value?.fullName
                || fictionUser.activeUser.value?.email
            }}
          </p>
        </div>
        <div class="py-1" role="none">
          <component
            :is="getNavComponentType(item)"
            v-for="(item, i) in accountMenu"
            :key="i"
            class="flex space-x-3 cursor-pointer px-4 py-3 text-sm text-slate-700 hover:bg-slate-100"
            :class=" item.isActive ? 'bg-slate-100 text-primary-500 font-semibold' : '' "
            :to="item.href"
            :href="item.href"
            role="menuitem"
            tabindex="-1"
            @click="item.onClick ? item.onClick({ event: $event }) : null"
          >
            <div><div class="text-lg" :class="item.icon" /></div><div>{{ item.name }}</div>
          </component>
        </div>
      </div>
    </transition>
  </div>
</template>
