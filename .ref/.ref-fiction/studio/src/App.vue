<script lang="ts" setup>
import NotifyToaster from '@factor/plugin-notify/NotifyToaster.vue'
import type {
  FactorRouter,
  FactorUser,
} from '@factor/api'
import {
  toLabel,
  useMeta,
  useService,
  vue,
  vueRouter,
} from '@factor/api'
import LoadingVeil from './LoadingVeil.vue'

import socialImage from './img/social-image.jpg'

const { factorRouter, factorUser } = useService<{
  factorRouter: FactorRouter
  factorUser: FactorUser
}>()
const RouterView = vueRouter.RouterView
const metaTitle = vue.computed(() => {
  const r = factorRouter.current.value
  const title = r.meta.niceName
    ? r.meta.niceName({ factorRouter })
    : toLabel(r.name as string)
  return `${title} - Fiction`
})

// const theme = vue.computed(() => {
//   return getColorScheme('slateInverted').colors
// })
// const primary = vue.computed(() => {
//   return getColorScheme('blueInverted').colors
// })
useMeta({
  title: metaTitle,
  meta: [
    {
      key: 'socialImage',
      property: 'og:image',
      content: socialImage,
    },
  ],
})
</script>

<template>
  <div
    class="main-app content-layout bg-theme-0 text-theme-900 dark antialiased"
  >
    <RouterView />

    <LoadingVeil :factor-user="factorUser" :factor-router="factorRouter" />
    <NotifyToaster />
  </div>
</template>

<style lang="less">
@import "./style.less";
</style>
