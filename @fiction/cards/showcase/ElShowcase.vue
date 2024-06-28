<script lang="ts" setup>
import { type MediaDisplayObject, vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import { animateItemEnter, useElementVisible } from '@fiction/ui/anim'
import ElImage from '@fiction/ui/media/ElImage.vue'
import ElModal from '@fiction/ui/ElModal.vue'
import AnimClipPath from '@fiction/ui/anim/AnimClipPath.vue'
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
function imageAspect(media: MediaDisplayObject) {
  const img = media
  const h = img?.height
  const w = img?.width

  if (!img || !w || !h)
    return 'aspect-[3/4]'

  return w > h ? 'aspect-square max-h-[70dvh]' : 'aspect-[4/3]'
}
</script>

<template>
  <div class="relative px-6 md:px-12">
    <div class="grid  xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 md:gap-12 gap-6">
      <div v-for="(item, i) in uc.items" :key="i" class="group showcase-item x-action-item transition-all duration-300 space-y-2 relative cursor-pointer" @click.stop="activeitemIndex = i">
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
    <ElModal :vis="activeitemIndex >= 0" modal-class="lg:max-w-[80dvw] min-h-[80dvh] " @update:vis="activeitemIndex = -1">
      <div class="close">
        <div class="absolute top-0 right-0 p-4">
          <div class="cursor-pointer text-theme-400 dark:text-theme-500 opacity-70 hover:opacity-100" @click="activeitemIndex = -1">
            <div class="i-tabler-x text-5xl" />
          </div>
        </div>
      </div>
      <div class="py-24">
        <div :class="proseClass">
          <div class="not-prose">
            <div class="mb-8 not-prose space-y-4">
              <CardText
                tag="h1"
                :card="card"
                class="mb-0 text-5xl font-semibold x-font-title"
                :path="`items.${activeitemIndex}.title`"
                animate="fade"
              />
              <CardText
                tag="h3"
                :card="card"
                class="my-0 text-theme-500 dark:text-theme-400 text-3xl"
                :path="`items.${activeitemIndex}.subTitle`"
                animate="fade"
              />
            </div>

            <AnimClipPath :enabled="true" class="my-[min(max(35px,_5vw),_30px)] -mx-16">
              <div v-if="activeItem?.media?.url" class=" mx-auto relative overflow-hidden rounded-xl" :class="imageAspect(activeItem.media)">
                <!-- Optionally display media -->
                <img :src="activeItem?.media?.url" alt="Post media" class="absolute h-full w-full object-cover object-center">
              </div>
            </AnimClipPath>
          </div>

          <CardText
            tag="div"
            :card="card"
            class="my-12"
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
