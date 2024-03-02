<script setup lang="ts">
import type { FactorRouter,
} from '@factor/api'
import { getColorScheme, toLabel, unhead, useService, vue } from '@factor/api'

import social from './public/social.png'

const { factorRouter } = useService<{ factorRouter: FactorRouter }>()

const routeName = vue.computed(() => factorRouter.current.value.name as string)

unhead.useHead({
  title: vue.computed(() => {
    return `${toLabel(routeName.value)} - Supereon`
  }),
  meta: [
    {
      name: `description`,
      content: `Supereon helps you plan, build, and deploy AI in your business`,
    },
    {
      key: 'og:image',
      property: 'og:image',
      content: social,
    },
  ],
  link: [
    {
      key: 'icon',
      rel: 'icon',
      href: social,
    },
  ],
})

const theme = vue.computed(() => {
  return getColorScheme('gray')
})
const primary = vue.computed(() => {
  return getColorScheme('indigo')
})
</script>

<template>
  <div class="content-layout app-wrap font-sans">
    <router-view />
  </div>
</template>

<style lang="less">
.app-wrap {
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
