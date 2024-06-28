<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import { animateItemEnter, useElementVisible } from '@fiction/ui/anim'
import ElImage from '@fiction/ui/media/ElImage.vue'
import ElModal from '@fiction/ui/ElModal.vue'
import { sampleHtml } from '@fiction/core/plugin-email/preview/content'

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

const activeitemId = vue.ref('')
const activeItem = vue.computed(() => uc.value.items?.find((item, i) => `item-${i}` === activeitemId.value))
const proseClass = `prose dark:prose-invert prose-sm md:prose-lg lg:prose-xl mx-auto focus:outline-none `
</script>

<template>
  <div class="relative px-6 md:px-12">
    <div class="grid  xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 md:gap-12 gap-6">
      <div v-for="(item, i) in uc.items" :key="i" class="group showcase-item x-action-item transition-all duration-300 space-y-2 relative cursor-pointer" @click.stop="activeitemId = `item-${i}` || ''">
        <div class="relative rounded-lg overflow-hidden">
          <ElImage :media="item.media" class="aspect-[4/3] " />
          <div class="overlay absolute w-full h-full z-10 inset-0 group-hover:opacity-100 opacity-0 transition-opacity" />
        </div>
        <div class="flex justify-between gap-4 p-1">
          <div class=" text-base font-medium min-w-0">
            {{ item.title }}
          </div>
          <div class="flex items-center gap-1">
            <div :class="i % 2 === 0 ? `i-tabler-heart` : 'i-tabler-heart-filled text-rose-500'" />
            <div class="font-sans text-sm">
              {{ i * 13 }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <ElModal :vis="!!activeitemId" modal-class="w-[80dvw] min-h-[80dvh] " @update:vis="activeitemId = ''">
      <div class="py-24">
        <div :class="proseClass">
          <div class="mb-8">
            <h1 class="mb-0">
              {{ activeItem?.title }}
            </h1>
            <h3 class="my-0">
              {{ activeItem?.subTitle }}
            </h3>
          </div>
          <div v-html="activeItem?.content" />
        </div>
      </div>
    </ElModal>
  </div>
</template>

<style lang="less" scoped>
.overlay {
  background: radial-gradient(circle at 50% 100%,rgba(0,0,0,1) 0,transparent 70%);
}
</style>
