<script setup lang="ts">
import type { NavItem } from '@fiction/core'
import { timeUtil, useService, vue } from '@fiction/core'
import type { Card } from '../../../../card'
import XSocials from '../ui/XSocials.vue'
import XNav from '../ui/XNav.vue'

export type UserConfig = {
  text?: string
  nav?: NavItem[]
  socials?: NavItem[]
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

const year = `&copy; ${timeUtil().format('YYYY')}`
</script>

<template>
  <div>
    <div class="relative z-30">
      <div class="relative py-4" :class="card.classes.value.contentWidth">
        <nav
          class="relative flex flex-col items-center justify-center gap-6 text-xs"
        >
          <div class="flex gap-3 items-center">
            <div class="flex lg:flex-1 " v-html="uc.text || year" />
            <div v-if="nav.length" class="text-theme-300 text-lg">
              <div class="i-tabler-slash" />
            </div>
            <XNav class="hidden lg:flex lg:justify-end lg:gap-x-4 items-center text-right" :nav="nav" />
          </div>
          <XSocials :socials="uc.socials || []" class="flex space-x-6 text-xl justify-center" />
        </nav>
      </div>
    </div>
  </div>
</template>
