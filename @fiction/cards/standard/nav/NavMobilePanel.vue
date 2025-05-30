<script lang="ts" setup>
import { onResetUi, shortId, vue } from '@fiction/core'
import { onBrowserEvent } from '@fiction/core/utils/eventBrowser'
import { animateItemEnter, useElementVisible } from '@fiction/ui/anim'
import ElClose from '@fiction/ui/common/ElClose.vue'

defineOptions({
  name: 'NavMobilePanel',
})

const { vis } = defineProps<{
  vis: boolean
}>()

const emit = defineEmits<{
  (event: 'update:vis', payload: boolean): void
}>()

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
    el.style.transform = 'translateX(-275px)'
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
      class="dark z-0 fixed h-[100dvh] top-0 right-0 w-full bg-gradient-to-br from-theme-800 to-theme-950 text-theme-0"
      @click.stop
    >
      <div :id="randomId" class="w-[275px] h-full float-right">
        <ElClose class="absolute right-0 top-0 z-20" @click="close" />

        <div class="h-full relative z-10 overflow-y-scroll">
          <slot />
        </div>
      </div>
    </div>
  </teleport>
</template>
