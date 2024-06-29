<script lang="ts" setup>
import { type MediaDisplayObject, vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import { animateItemEnter, useElementVisible } from '@fiction/ui/anim'
import ElImage from '@fiction/ui/media/ElImage.vue'
import ElModal from '@fiction/ui/ElModal.vue'
import AnimClipPath from '@fiction/ui/anim/AnimClipPath.vue'
import EffectGlare from '@fiction/ui/effect/EffectGlare.vue'
import CardText from '../CardText.vue'
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

const activeitemIndex = vue.ref(-1)
const activeItem = vue.computed(() => uc.value.items?.find((item, i) => i === activeitemIndex.value))
const proseClass = `prose dark:prose-invert prose-sm md:prose-lg lg:prose-xl mx-auto focus:outline-none `

function featuredImageAspect(media: MediaDisplayObject) {
  const img = media
  const h = img?.height
  const w = img?.width

  if (!img || !w || !h)
    return 'aspect-[3/4]'

  return w > h ? 'aspect-square max-h-[70dvh]' : 'aspect-[4/3]'
}

function gridImageAspect() {
  const aspectMappings: { [key: string]: string } = {
    square: 'aspect-square max-h-[70dvh]',
    tall: 'aspect-[9/16] max-h-[70dvh]',
    wide: 'aspect-[16/9] max-w-[70dvw]',
    golden: 'aspect-[1.618/1] max-w-[70dvw]',
    portrait: 'aspect-[3/4] max-h-[70dvh]',
    landscape: 'aspect-[4/3] max-w-[70dvw]',
    cinema: 'aspect-[21/9] max-w-[70dvw]',
    default: 'aspect-[4/3] max-h-[70dvh]',
  }

  const aspect = uc.value.aspect || 'default'

  return aspectMappings[aspect] || aspectMappings.default
}

function gridCols() {
  const gridColsMax = uc.value.gridColsMax || 4
  const gridColsMin = uc.value.gridColsMin || 1

  const breakpoints = {
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
  }

  let classes = `grid-cols-${gridColsMin}`

  for (const [bp, cols] of Object.entries(breakpoints)) {
    const effectiveCols = Math.max(+gridColsMin, Math.min(+gridColsMax, cols))
    classes += ` ${bp}:grid-cols-${effectiveCols}`
  }

  return classes.trim()
}
</script>

<template>
  <div class="relative px-6 md:px-12" data-test-id="showcase">
    <div class="grid md:gap-12 gap-6" :class="gridCols()" :data-aspect="uc.aspect" :data-grid-cols-max="uc.gridColsMax">
      <div v-for="(item, i) in uc.items" :key="i" class="[perspective:1000px] group showcase-item x-action-item transition-all duration-300 space-y-2 relative cursor-pointer" @click="activeitemIndex = i">
        <EffectGlare> <ElImage :media="item.media" :class="gridImageAspect()" /></EffectGlare>
        <div class="@[17.5rem]:flex justify-between gap-4 p-1 @container">
          <CardText
            tag="div"
            :card="card"
            class="text-base font-medium min-w-0 x-font-title"
            :path="`items.${i}.title`"
            animate="fade"
          />

          <CardText
            tag="div"
            :card="card"
            class="flex items-center gap-1 font-sans text-xs text-theme-400 dark:text-theme-500"
            :path="`items.${i}.superTItle`"
            animate="fade"
          />
        </div>
      </div>
    </div>
    <ElModal :vis="activeitemIndex >= 0" modal-class="lg:max-w-[80dvw] min-h-[80dvh] " @update:vis="activeitemIndex = -1">
      <div class="close">
        <div class="absolute top-0 right-0 p-2 md:p-4">
          <div class="cursor-pointer text-theme-400 dark:text-theme-500 opacity-70 hover:opacity-100" @click="activeitemIndex = -1">
            <div class="i-tabler-x text-5xl" />
          </div>
        </div>
      </div>
      <div class="py-12 md:py-24 px-4">
        <div :class="proseClass">
          <div class="not-prose">
            <div class="mb-8 not-prose space-y-4">
              <CardText
                tag="h1"
                :card="card"
                class="mb-0 text-3xl md:text-5xl font-semibold x-font-title"
                :path="`items.${activeitemIndex}.title`"
                animate="fade"
              />
              <CardText
                tag="h3"
                :card="card"
                class="my-0 text-theme-500 dark:text-theme-400 text-lg md:text-3xl"
                :path="`items.${activeitemIndex}.subTitle`"
                animate="fade"
              />
            </div>

            <AnimClipPath animate="expand" class="my-[min(max(35px,_5vw),_30px)] md:-mx-16">
              <div v-if="activeItem?.media?.url" class=" mx-auto relative overflow-hidden rounded-xl" :class="featuredImageAspect(activeItem.media)">
                <!-- Optionally display media -->
                <img :src="activeItem?.media?.url" alt="Post media" class="absolute h-full w-full object-cover object-center">
              </div>
            </AnimClipPath>
          </div>

          <CardText
            tag="div"
            :card="card"
            class="my-12 font-serif"
            :path="`items.${activeitemIndex}.content`"
            animate="fade"
          />
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
