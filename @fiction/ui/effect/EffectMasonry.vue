<script setup lang="ts">
import { vue, waitFor } from '@fiction/core'
import type Packery from 'packery'
import type ImagesLoaded from 'imagesloaded'

type EffectOptions = Partial<Packery.PackeryOptions> & {
  resize?: boolean
  initLayout?: boolean
}
const props = defineProps<{
  items: any[]
  options?: EffectOptions
}>()

const gridRef = vue.ref<HTMLElement | null>(null)
let pckry: Packery.Packery | null = null

async function initPackery() {
  if (typeof window === 'undefined')
    return

  const { Packery } = await import('packery')
  const { default: imagesLoaded } = await import('imagesloaded')

  if (gridRef.value) {
    const defaultOptions: EffectOptions = {
      itemSelector: '.grid-item',
      gutter: 10,
      percentPosition: true,
      transitionDuration: '0.4s',
      resize: true,
      initLayout: true,
    }

    pckry = new Packery(gridRef.value, { ...defaultOptions, ...props.options })

    if (props.options?.initLayout !== false) {
      imagesLoaded(gridRef.value).on('progress', () => {
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
  <div ref="gridRef" class="grid">
    <div v-for="(item, index) in items" :key="index" class="grid-item" :class="item.class">
      <slot :name="item" :item="item" :index="index">
        <!-- Default content if no slot is provided -->
        <img :src="item.src" :alt="item.alt">
      </slot>
    </div>
  </div>
</template>

<style lang="less">
.grid {
  width: 100%;
}

.grid-item {
  float: left;
  width: 20%; // Default width, adjust as needed
  background: #e6e5e4;
  border: 2px solid #b6b5b4;

  img {
    display: block;
    max-width: 100%;
  }
}

.grid-item--width2 { width: 40%; }
.grid-item--height2 { height: auto; } // Height will be determined by content
</style>
