<script setup lang="ts">
import NotifyToaster from '@factor/plugin-notify/NotifyToaster.vue'
import type { FactorRouter } from '@factor/api'
import { useMeta, useService, vue } from '@factor/api'

import icon from '/social-image.png'

const { factorRouter } = useService<{
  factorRouter: FactorRouter
}>()
useMeta({
  title: vue.computed(
    () =>
      `${(factorRouter.current.value.name as string) || 'Page'} - PageLines`,
  ),
  meta: [
    {
      name: `description`,
      content: `PageLines helps you integrate ChatGPT and other AI tools into your website.`,
    },
    {
      key: 'og:image',
      property: 'og:image',
      content: icon,
    },
  ],
  link: [
    {
      key: 'icon',
      rel: 'icon',
      href: icon,
    },
  ],
})
</script>

<template>
  <div>
    <div class="">
      <RouterView />
    </div>
    <NotifyToaster />
  </div>
</template>

<style lang="less">
@import "./style.less";
</style>
