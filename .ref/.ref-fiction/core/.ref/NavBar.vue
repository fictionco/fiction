<script lang="ts" setup>
import type { FactorApp } from '@factor/api'
import { getColorScheme, useService, vue } from '@factor/api'
import ElAccountNav from './ElAccountNav.vue'
import type { FactorAdmin } from '.'

const theme = vue.computed(() => {
  return getColorScheme('slate').colors
})
const { factorAdmin, factorApp } = useService<{
  factorAdmin: FactorAdmin
  factorApp: FactorApp
}>()
</script>

<template>
  <div
    class="navbar bg-theme-0 text-theme-800 border-theme-300 border-b bg-gradient-to-br text-sm font-medium"
  >
    <div
      class="mx-auto grid h-14 max-w-[1900px] grid-cols-12 items-center justify-between space-x-2 p-2 md:px-8"
    >
      <div class="col-span-6 flex items-center space-x-6">
        <RouterLink to="/">
          <component
            :is="factorApp.ui.logoDark"
            class="scheme-light h-[16px] w-auto md:h-[22px]"
          />
        </RouterLink>
      </div>

      <div class="col-span-6 flex justify-end space-x-4">
        <!-- <ElOrgSwitcher direction="left"></ElOrgSwitcher> -->
        <ElAccountNav direction="left" />
      </div>
    </div>
  </div>
</template>

<style lang="less">
// .navbar {
//   --theme-0: v-bind("theme[0]");
//   --theme-50: v-bind("theme[50]");
//   --theme-100: v-bind("theme[100]");
//   --theme-200: v-bind("theme[200]");
//   --theme-300: v-bind("theme[300]");
//   --theme-400: v-bind("theme[400]");
//   --theme-500: v-bind("theme[500]");
//   --theme-600: v-bind("theme[600]");
//   --theme-700: v-bind("theme[700]");
//   --theme-800: v-bind("theme[800]");
//   --theme-900: v-bind("theme[900]");
//   --theme-1000: v-bind("theme[1000]");
// }
</style>
