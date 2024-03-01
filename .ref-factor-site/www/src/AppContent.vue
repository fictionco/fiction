<script lang="ts" setup>
import { unhead, vue } from '@factor/api'
import SiteHead from './el/SiteHead.vue'
import SiteFooter from './el/SiteFooter.vue'
import ImgShare from './img/share.jpg'

unhead.useHead({
  title: vue.computed(() => {
    return `FactorJS Static Site Framework by Supereon`
  }),
  meta: [
    {
      name: `description`,
      content:
        'A next-generation framework for building websites, blogs, and apps with JavaScript. Powered by Node, TypeScript, Vite.',
    },
    {
      key: 'og:image',
      property: 'og:image',
      content: ImgShare,
    },
  ],
})
</script>

<template>
  <div class="content-layout min-h-screen">
    <SiteHead />
    <router-view />
    <SiteFooter />
  </div>
</template>

<style lang="less">
@import "./styles.less";
</style>
