<script setup lang="ts">
import {
  getColorScheme,
  onEvent,
  vue,
} from '@factor/api'
import SiteHeader from './SiteHeader.vue'
import SiteFooter from './SiteFooter.vue'

const proModalVis = vue.ref(false)

const theme = vue.computed(() => {
  return getColorScheme('grayInverted').colors
})

const primary = vue.computed(() => {
  return getColorScheme('blue').colors
})

onEvent('showProModal', () => {
  proModalVis.value = true
})

vue.onMounted(() => {})
</script>

<template>
  <div
    class="page-wrap from-theme-0 via-theme-50 to-theme-50 text-theme-900 relative flex min-h-[100vh] flex-col overflow-hidden bg-gradient-to-r text-white"
  >
    <SiteHeader />
    <div class="grow">
      <slot />
    </div>
    <SiteFooter />
  </div>
</template>

<style lang="less">
.page-wrap {
  --theme-0: v-bind("theme[0]");
  --theme-50: v-bind("theme[50]");
  --theme-100: v-bind("theme[100]");
  --theme-200: v-bind("theme[200]");
  --theme-300: v-bind("theme[300]");
  --theme-400: v-bind("theme[400]");
  --theme-500: v-bind("theme[500]");
  --theme-600: v-bind("theme[600]");
  --theme-700: v-bind("theme[700]");
  --theme-800: v-bind("theme[800]");
  --theme-900: v-bind("theme[900]");
  --theme-950: v-bind("theme[900]");
  --theme-1000: v-bind("theme[1000]");
  --primary-0: v-bind("primary[0]");
  --primary-50: v-bind("primary[50]");
  --primary-100: v-bind("primary[100]");
  --primary-200: v-bind("primary[200]");
  --primary-300: v-bind("primary[300]");
  --primary-400: v-bind("primary[400]");
  --primary-500: v-bind("primary[500]");
  --primary-600: v-bind("primary[600]");
  --primary-700: v-bind("primary[700]");
  --primary-800: v-bind("primary[800]");
  --primary-900: v-bind("primary[900]");
  --primary-1000: v-bind("primary[1000]");
  .under {
    background-image: linear-gradient(
      120deg,
      v-bind("theme[50]"),
      v-bind("theme[200]")
    );
    background-repeat: no-repeat;
    background-size: 100% 0.4em;
    background-position: 0 88%;
    font-weight: inherit;
  }
}
</style>
