<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from './config'
import { onResetUi, shortId, vue } from '@fiction/core'
import { onBrowserEvent } from '@fiction/core/utils/eventBrowser'
import { animateItemEnter, useElementVisible } from '@fiction/ui/anim'
import ElClose from '@fiction/ui/common/ElClose.vue'

import XLink from '@fiction/ui/common/XLink.vue'
import XLogoType from '@fiction/ui/media/XLogoType.vue'

defineOptions({
  name: 'NavMobilePanel',
})

const { vis, card } = defineProps<{
  vis: boolean
  card: Card<UserConfig>
}>()

const emit = defineEmits<{
  (event: 'update:vis', payload: boolean): void
}>()

const uc = vue.computed(() => card.userConfig.value || {})
const randomId = shortId()
const afterVisible = vue.ref(false)
const scrolled = vue.ref(false)

onBrowserEvent('scroll', () => {
  scrolled.value = window.pageYOffset > 50
})

function close(): void {
  emit('update:vis', false)
}

onResetUi(() => close())

function translateSiteContent(args: { mode: 'on' | 'off' }) {
  if (typeof window === 'undefined')
    return

  const el = document.querySelector('.x-site-content') as HTMLElement | null

  if (!el)
    return

  if (args.mode === 'on') {
    el.style.transform = 'translateX(-300px)'
    el.style.transition = 'transform .75s cubic-bezier(0.25, 1, 0.33, 1)'
    el.style.height = '100dvh'
    el.style.overflow = 'hidden'
    setTimeout(() => (afterVisible.value = true), 300)
  }
  else {
    afterVisible.value = false
    el.style.transform = ''
    el.style.height = ''
    el.style.overflow = ''
  }
}

vue.onBeforeUnmount(() => {
  translateSiteContent({ mode: 'off' })
})

vue.onMounted(() => {
  vue.watch(
    () => vis,
    (vis) => {
      translateSiteContent({ mode: vis ? 'on' : 'off' })
    },
    { immediate: true },
  )

  useElementVisible({
    caller: 'navMobile',
    selector: `#${randomId}`,
    onVisible: async () => {
      await animateItemEnter({
        targets: `#${randomId} .x-action-item`,
        themeId: 'rise',
      })
    },
  })
})
</script>

<template>
  <teleport to=".x-site">
    <div
      v-if="vis"
      class="dark z-0 fixed h-[100dvh] top-0 right-0 w-full bg-gradient-to-r from-theme-800  to-theme-900 text-theme-0"
      @click.stop
    >
      <div :id="randomId" class="w-[300px] h-full float-right  border-l border-theme-700">
        <div class="flex items-center justify-between relative">
          <XLink :card href="/" class="p-3 flex items-center justify-between gap-2 basis-0 grow min-w-0 truncate">
            <XLogoType
              class="truncate min-w-0"
              :logo="uc.brand?.logo"
              :classes="{ text: 'x-font-title text-lg font-bold' }"
              :media-handling="{ height: 2 }"
              :org="card.site?.org.value"
            />
          </XLink>

          <ElClose class="relative z-10" @click="close" />
        </div>

        <div class="h-full relative z-10 overflow-y-scroll">
          <slot />
        </div>
      </div>
    </div>
  </teleport>
</template>
