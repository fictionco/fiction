<script setup lang="ts" generic="T">
import { vue, waitFor } from '@fiction/core'
import type { PackeryOptions, Packery as PackeryType } from 'packery'

type EffectOptions = Partial<PackeryOptions> & {
  resize?: boolean
  initLayout?: boolean
  defaultCols?: number
}

const props = defineProps<{
  items: T[]
  options?: EffectOptions
  gap?: string
}>()

const containerRef = vue.ref<HTMLElement | null>(null)
let pckry: PackeryType | null = null

async function initPackery() {
  if (typeof window === 'undefined')
    return

  const PackeryModule = await import('packery')
  const Packery = PackeryModule.default || PackeryModule
  const { default: imagesLoaded } = await import('imagesloaded')

  if (containerRef.value) {
    const defaultOptions = {
      itemSelector: '.masonry-grid-item',
      gutter: 40,
      percentPosition: true,
      transitionDuration: '0.4s',
      resize: true,
      initLayout: true,

    }

    pckry = new (Packery as any)(containerRef.value, { ...defaultOptions, ...props.options })

    if (props.options?.initLayout !== false) {
      imagesLoaded(containerRef.value).on('progress', () => {
        pckry?.layout()
      })
    }
  }
}

vue.onMounted(async () => {
  await waitFor(200) // Allow time for initial rendering
  await initPackery()
})

vue.onBeforeUnmount(() => {
  if (pckry) {
    pckry.destroy()
  }
})

vue.watch(() => props.items, () => {
  if (pckry) {
    pckry.destroy()
  }
  vue.nextTick(async () => {
    await initPackery()
  })
}, { deep: true })

// Expose Packery instance to parent component if needed
defineExpose({ packery: pckry })
</script>

<template>
  <div>
    <div ref="containerRef" class="masonry-grid clear-both">
      <div v-for="(item, index) in items" :key="index" class="masonry-grid-item float-left">
        <slot :item :index />
      </div>
      <div class="gutter-sizer" />
    </div>
  </div>
</template>

<style lang="less">
.masonry-grid {
  width: 100%;

}

.gutter-sizer{
    width: 6%;
  }

.masonry-grid-item {
  width: 48%;
  @media screen and (max-width: 768px) {
    width: 100%;

  }
}

.masonry-grid-item--width2 { width: 40%; }
.masonry-grid-item--height2 { height: auto; } // Height will be determined by content
</style>
