<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import { animateItemEnter, useElementVisible } from '@fiction/ui/anim'
import ElImage from '@fiction/ui/media/ElImage.vue'
import { defaultMediaItems } from './index.js'

import type { UserConfig } from '.'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const loaded = vue.ref(false)
const uc = vue.computed(() => props.card.userConfig.value)

vue.onMounted(() => {
  useElementVisible({
    selector: `#${props.card.cardId}`,
    onVisible: async () => {
      await animateItemEnter({ targets: `#${props.card.cardId} .x-action-item`, themeId: 'fade', config: { overallDelay: 400 } })
      loaded.value = true
    },
  })
})
</script>

<template>
  <div class="relative px-6 md:px-12">
    <div class="grid  xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 md:gap-12 gap-6">
      <div v-for="(item, i) in uc.items" :key="i" class="showcase-item x-action-item transition-all duration-300 space-y-2">
        <ElImage :media="item.media" class="aspect-[4/3] rounded-lg overflow-hidden" />
        <div class="flex justify-between gap-4 p-1">
          <div class=" text-base font-medium min-w-0">
            {{ item.name }}
          </div>
          <div class="flex items-center gap-1">
            <div :class="i % 2 === 0 ? `i-tabler-heart` : 'i-tabler-heart-filled text-rose-500'" />
            <div class="font-sans text-sm">
              123
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
</style>
