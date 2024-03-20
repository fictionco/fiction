<script setup lang="ts">
import NotifyToaster from '@fiction/plugin-notify/NotifyToaster.vue'
import { getColorScheme, unhead, vue } from '@fiction/core'

unhead.useHead({
  title: 'Personal Marketing System',
})
const theme = vue.computed(() => {
  return getColorScheme('slate')
})
const primary = vue.computed(() => {
  return getColorScheme('rose')
})
</script>

<template>
  <div class="app-wrap">
    <div>
      <RouterView />
    </div>
    <NotifyToaster />
  </div>
</template>

<style lang="less">
body {

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
  --theme-950: v-bind("theme[950]");
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

}

@import "./style.less";
</style>
