<script setup lang="ts">
import ElEngine from '@factor/engine/ui/ElEngine.vue'
import { getColorScheme, unhead, vue } from '@factor/api'

import social from './public/social.png'

unhead.useHead({
  title: 'Andrew Powers - Product Leadership',
  meta: [
    {
      name: `description`,
      content: `Website of Andrew Powers (@arpowers)`,
    },
    {
      key: 'og:image',
      property: 'og:image',
      content: social,
    },
  ],
  link: [
    {
      key: 'font-pre',
      rel: 'preconnect ',
      href: 'https://fonts.googleapis.com',
    },
    {
      key: 'font-static',
      rel: 'preconnect ',
      href: 'https://fonts.gstatic.com',
      crossorigin: 'anonymous',
    },
    {
      key: 'font',
      rel: 'stylesheet ',
      href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Source+Serif+4:ital,opsz,wght@0,8..60,200;0,8..60,300;0,8..60,400;0,8..60,500;0,8..60,600;0,8..60,700;0,8..60,800;0,8..60,900;1,8..60,200;1,8..60,300;1,8..60,400;1,8..60,500;1,8..60,600;1,8..60,700;1,8..60,800;1,8..60,900&display=swa',
    },
  ],
})

const theme = vue.computed(() => {
  return getColorScheme('neutral')
})
const primary = vue.computed(() => {
  return getColorScheme('rose')
})
</script>

<template>
  <div class="app-wrap">
    <div class="ui-font-body">
      <ElEngine region="header" />
      <ElEngine region="page" />
      <ElEngine region="footer" />
    </div>
  </div>
</template>

<style lang="less">
@import "@factor/ui/entry.less";

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
  .x-font-title {
    font-family: "Poppins", var(--font-family-sans);
  }
  .ui-font-body {
    font-family: var(--font-family-serif);
  }

  .ui-font-button {
    font-family: var(--font-family-sans);
  }

  .pl-content-width {
    max-width: 1100px;
  }
}

@import "./style.less";
</style>
