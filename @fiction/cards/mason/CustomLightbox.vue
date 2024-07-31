<script lang="ts" setup>
import { vue } from '@fiction/core'
import { gsap } from 'gsap'
import ElImage from '@fiction/ui/media/ElImage.vue'
import type { MediaItem } from './index'

const props = defineProps<{
  item?: MediaItem
  index?: number
}>()

const emit = defineEmits<{
  (event: 'update:item', payload: MediaItem | undefined): void
}>()

const lightboxRef = vue.ref<HTMLElement | null>(null)
const animatedDivRef = vue.ref<HTMLElement | null>(null)
const contentRef = vue.ref<HTMLElement | null>(null)
const mediaRef = vue.ref<HTMLElement | null>(null)
const isAnimating = vue.ref(false)

function close(_event: MouseEvent) {
  emit('update:item', undefined)
}

const afterVisible = vue.ref(false)
vue.onMounted(() => {
  const el = document.querySelector('.x-site-content') as HTMLElement | null

  vue.watch(
    () => props.item,
    (vis) => {
      if (!el)
        return

      if (vis) {
        el.style.transform = 'scale(.95)'
        el.style.transition = 'transform .75s cubic-bezier(0.25, 1, 0.33, 1)'
        el.style.overflow = 'hidden'
        el.style.height = '100dvh'

        setTimeout(() => (afterVisible.value = true), 300)
      }
      else {
        afterVisible.value = false
        el.style.transform = 'none'
        el.style.height = 'auto'
        el.style.overflow = ''
      }
    },
    { immediate: true },

  )

  // onResetUi(({ scope }) => {
  //   if (scope !== 'inputs' && props.vis)
  //     close({ reason: 'reset' })
  // })
})
</script>

<template>
  <teleport to=".x-site">
    <div
      v-if="item"
      ref="lightboxRef"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
      @click="close"
    >
      <div ref="animatedDivRef" class="relative h-[90dvh] w-[90dvw] overflow-hidden rounded-xl" @click.stop>
        <ElImage ref="mediaRef" class="absolute inset-0" :media="item.media" />

        <div ref="contentRef" class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
          <h3 class="text-xl font-bold">
            {{ item?.title }}
          </h3>
          <p>{{ item?.content }}</p>
        </div>
      </div>
    </div>
  </teleport>
</template>
