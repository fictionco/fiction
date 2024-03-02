<script lang="ts" setup>
import ElAvatar from '@factor/ui/ElAvatar.vue'
import type {
  FactorRouter,
  FactorUser,
} from '@factor/api'
import {
  onResetUi,
  resetUi,
  useService,
  vue,
} from '@factor/api'
import type { NavItem } from './nav'

defineProps({
  menu: {
    type: Array as vue.PropType<NavItem[]>,
    required: true,
  },
})
const { factorRouter, factorUser } = useService<{
  factorUser: FactorUser
  factorRouter: FactorRouter
}>()

const activeUser = factorUser.activeUser
const router = factorRouter.router

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
      class="group flex cursor-pointer items-center space-x-2"
      @click.stop.prevent="toggle()"
    >
      <ElAvatar class="ml-3 h-7 w-7 rounded-full" :email="activeUser?.email" />
      <div class="flex w-4 flex-col items-end justify-center space-y-1">
        <div
          class="h-1 w-4 rounded-full"
          :class="
            vis ? 'bg-theme-500' : 'bg-theme-300 group-hover:bg-theme-400'
          "
        />
        <div
          class="h-1 w-3 rounded-full"
          :class="
            vis ? 'bg-theme-500' : 'bg-theme-300 group-hover:bg-theme-400'
          "
        />
        <div
          class="h-1 w-4 rounded-full"
          :class="
            vis ? 'bg-theme-500' : 'bg-theme-300 group-hover:bg-theme-400'
          "
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
        class="absolute right-0 z-30 mt-2 w-72 origin-top-right divide-y divide-slate-200 rounded-md bg-white text-left text-slate-800 shadow-lg ring-1 ring-black/10 focus:outline-none"
        :style="{ top: 'calc(100% + 20px)' }"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabindex="-1"
      >
        <div v-if="factorUser.activeUser.value" class="px-4 py-3 text-sm">
          <div class="text-xs text-slate-400">
            Signed in as...
          </div>
          <p class="truncate text-base font-bold">
            {{
              factorUser.activeUser.value?.fullName
                || factorUser.activeUser.value?.email
            }}
          </p>
        </div>
        <div class="py-1" role="none">
          <component
            :is="
              !item.value
                ? 'div'
                : item.value.includes('http')
                  ? 'a'
                  : 'router-link'
            "
            v-for="(item, i) in menu"
            :key="i"
            class="block cursor-pointer px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
            :class="
              item?.value === router.currentRoute.value.path
                ? 'bg-slate-100 text-primary-500 font-semibold'
                : ''
            "
            :to="item.value"
            :href="item.value"
            role="menuitem"
            tabindex="-1"
            @click="item.cb ? item.cb($event) : null"
          >
            {{ item.name }}
          </component>
        </div>
      </div>
    </transition>
  </div>
</template>
