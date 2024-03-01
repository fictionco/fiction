<script lang="ts" setup>
import LoadingVeil from '@factor/ui/LoadingVeil.vue'
import NotifyToaster from '@factor/plugin-notify/NotifyToaster.vue'

import type {
  FactorRouter,
} from '@factor/api'
import {
  storeItem,
  stored,
  toLabel,
  useMeta,
  vue,
  vueRouter,
} from '@factor/api'

import socialImage from './img/social.jpg'
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
import CtaGetDemoModal from './ui/CtaGetDemoModal.vue'
import { useSiteService } from './inject'

const RouterView = vueRouter.RouterView

const { factorRouter, factorUser } = useSiteService()
const router = factorRouter.router

const wrapClass = vue.computed(() =>
  stored('pageMode') === 'dark' ? 'bg-theme-900 text-white' : '',
)

vue.watch(
  () => router.currentRoute.value.path,
  (v, old) => {
    if (v !== old)
      storeItem('pageMode', 'standard')
  },
)

const metaTitle = vue.computed(() => {
  const r = router.currentRoute.value
  const niceName = r.meta.niceName as (opts: {
    factorRouter: FactorRouter
  }) => string
  return `${niceName({ factorRouter }) || toLabel(r.name as string)} - Kaption`
})

const metaDescription = 'Feedback Platform and CX Analytics'

async function closePanel(): Promise<void> {
  await router.replace({ query: {} })
}
const showPanel = vue.computed(() => {
  const q = router.currentRoute.value.query

  return q.mode
})
useMeta({
  title: metaTitle,
  meta: [
    {
      name: 'description',
      content: metaDescription,
    },
    {
      vmid: 'og:image',
      property: 'og:image',
      content: socialImage,
    },
  ],
  htmlAttrs: { lang: 'en' },
})
</script>

<template>
  <div>
    <div class="content-layout bg-white" :class="wrapClass">
      <AppHeader />
      <RouterView v-slot="{ Component }">
        <transition name="translate" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
      <AppFooter />
    </div>
    <CtaGetDemoModal
      :vis="showPanel === 'demo'"
      mode="route"
      @close="closePanel()"
    />
    <LoadingVeil :factor-user="factorUser" :factor-router="factorRouter" />
    <NotifyToaster />
  </div>
</template>

<style lang="less">
@import "./styles.less";

:root {
  --adjust-right: rotateY(-11deg) rotateZ(3deg);
  --adjust-left: rotateY(11deg) rotateZ(-3deg);
}
.app-adjust-right {
  transform: var(--adjust-right);
  @media (max-width: 700px) {
    transform: var(--adjust-right) scale(0.75);
  }
}
.app-adjust-left {
  transform: var(--adjust-left);
  @media (max-width: 700px) {
    transform: var(--adjust-left) scale(0.75);
  }
}

.factor-app {
  color: var(--color-text);
  font-family: var(--font-family-primary);
  --font-family-primary: "urbanist", var(--font-family-base);
  --font-family-input: "sohne-var", var(--font-family-base);
  font-weight: 500;
}

.translate-enter-active,
.translate-leave-active {
  transition: all 0.25s ease;
}

.translate-enter-from,
.translate-leave-to {
  opacity: 0;
}
</style>
