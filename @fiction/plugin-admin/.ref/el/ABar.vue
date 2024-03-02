<script lang="ts" setup>
import { useService } from '@factor/api'
import type { FactorAdmin } from '..'
import ABarMenu from './ABarMenu.vue'

const emit = defineEmits<{
  (event: 'nav', payload: boolean): void
}>()

const { factorAdmin } = useService<{ factorAdmin: FactorAdmin }>()
</script>

<template>
  <div
    class="navbar text-theme-800 border-theme-300 from-theme-0 via-theme-0 to-theme-0 border-b bg-gradient-to-b text-sm font-medium"
    @click.stop
  >
    <div class="mx-auto flex items-center justify-between gap-y-3 px-6 py-3">
      <div class="flex items-center md:min-w-[150px]">
        <RouterLink to="/" class="active:opacity-80 sm:hidden">
          <component
            :is="factorAdmin.settings.ui?.IconDashboard"
            class="scheme-light h-[18px] w-auto md:h-[22px]"
          />
        </RouterLink>
        <div class="hidden text-xl font-semibold sm:block">
          {{ factorAdmin.currentPageTitle.value }}
        </div>
      </div>
      <div />

      <div class="flex h-full justify-end space-x-4 md:min-w-[150px]">
        <ABarMenu
          size="md"
          direction="left"
          default-text="Menu"
          class="hidden sm:block"
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
