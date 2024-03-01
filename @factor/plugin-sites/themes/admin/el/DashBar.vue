<script lang="ts" setup>
import type { NavItem, vue } from '@factor/api'
import ABarMenu from './DashBarMenu.vue'

const props = defineProps({
  iconDashboard: { type: String, default: '' },
  accountMenu: { type: Array as vue.PropType<NavItem[]>, default: () => [] },
})

const emit = defineEmits<{
  (event: 'nav', payload: boolean): void
}>()
</script>

<template>
  <div
    class="navbar  text-sm font-medium"
    @click.stop
  >
    <div class="mx-auto flex items-center justify-between gap-y-3 px-6 py-3">
      <div class="flex items-center md:min-w-[150px]">
        <RouterLink to="/" class="active:opacity-80 sm:hidden">
          LOGO
        </RouterLink>
        <div class="hidden text-xl font-semibold sm:block">
          Page Title
        </div>
      </div>
      <div />

      <div class="flex h-full justify-end space-x-4 md:min-w-[150px]">
        <ABarMenu
          size="md"
          direction="left"
          default-text="Menu"
          class="hidden sm:block"
          :account-menu="accountMenu"
        />
        <div
          class="group flex h-8 w-8 cursor-pointer flex-col justify-center space-y-1 p-1 sm:hidden"
          @click="emit('nav', true)"
        >
          <div
            v-for="i in 3"
            :key="i"
            class="bg-theme-300 group-active:bg-theme-400 h-1 rounded-full"
          />
        </div>
      </div>
    </div>
  </div>
</template>
