<script setup lang="ts">
import type { MediaDisplayObject, NavItem } from '@fiction/core'
import { useService, vue } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import NavMobile from '@fiction/ui/NavMobile.vue'
import XNav from '../ui/XNav.vue'
import XSiteLogo from '../ui/XSiteLogo.vue'

export type UserConfig = {
  nav?: NavItem[]
  logo?: MediaDisplayObject
}

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})
const { fictionRouter } = useService()

const uc = vue.computed(() => {
  return props.card.userConfig.value || {}
})

const nav = vue.computed(() => {
  const currentRoute = fictionRouter.current.value.path
  return (uc.value.nav || []).map((item) => {
    const isActive = item.href === currentRoute
    return { ...item, isActive }
  })
})

const vis = vue.ref(false)
</script>

<template>
  <div class="relative z-20">
    <div class="relative py-4" :class="card.classes.value.contentWidth">
      <nav
        class="relative flex items-center justify-between"
        aria-label="Global"
      >
        <div class="flex lg:flex-1">
          <XSiteLogo :logo="uc.logo" />
        </div>
        <div class="flex lg:hidden">
          <div class="text-3xl z-30 relative" :class="vis ? 'text-white' : ''" @click.stop="vis = !vis">
            <div class="i-tabler-menu" />
          </div>
          <NavMobile v-model:vis="vis" :nav="nav" />
        </div>
        <XNav
          class="hidden lg:flex lg:justify-center lg:gap-x-4 items-center"
          :nav="nav"
          item-class="last:pr-0 px-4 py-1.5 text-base font-sans font-medium"
          :card="card"
        />
      </nav>
    </div>
  </div>
</template>
