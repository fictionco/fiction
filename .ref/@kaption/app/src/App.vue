<script lang="ts" setup>
import LoadingVeil from '@kaption/core/ui/LoadingVeil.vue'
import NotifyToaster from '@factor/plugin-notify/NotifyToaster.vue'

import { toLabel, useMeta, vue, vueRouter } from '@factor/api'

import { useKaption } from '@kaption/core'
import socialImage from './img/social.jpg'

const { factorRouter, factorUser } = useKaption()
const RouterView = vueRouter.RouterView
const metaTitle = vue.computed(() => {
  const r = factorRouter.router.currentRoute.value
  return `${r.meta.niceName || toLabel(r.name as string)} - Kaption`
})

useMeta({
  title: metaTitle,
  meta: [
    {
      vmid: 'socialImage',
      property: 'og:image',
      content: socialImage,
    },
  ],
})
</script>

<template>
  <div class="content-layout antialiased">
    <RouterView />
    <LoadingVeil :factor-user="factorUser" :factor-router="factorRouter" />
    <NotifyToaster />
  </div>
</template>

<style lang="less">
@import "./styles.less";

.factor-app {
  --font-family-input: var(--font-family-base);
  color: var(--color-text);
  //font-family: var(--font-family-primary);
  font-weight: 500;
}
</style>
