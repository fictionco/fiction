<script setup lang="ts">
import type { Card } from '@fiction/site'
import type { UserConfig } from './index.js'
import { pathCheck, vue } from '@fiction/core'
import { useElementVisible } from '@fiction/ui/anim'
import AnimClipPath from '@fiction/ui/anim/AnimClipPath.vue'
import EffectCarousel from '@fiction/ui/effect/EffectCarousel.vue'
import EffectGlare from '@fiction/ui/effect/EffectGlare.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import XEntry from '@fiction/ui/prose/XEntry.vue'
import CardText from '../../CardText.vue'
import CardWrap from '../../CardWrap.vue'
import CardActionArea from '../../el/CardActionArea.vue'
import NavDots from '../../el/NavDots.vue'
import SuperTitle from '../../el/SuperTitle.vue'
import { schema } from './config'

const { card } = defineProps<{
  card: Card<UserConfig>
}>()

const uc = vue.computed(() => {
  return card.fullConfig.value || {}
})

const mediaItems = vue.computed(() => {
  return uc.value.mediaItems?.filter(_ => _.media?.url)
})
const activeItem = vue.ref(0)
const isVisible = vue.ref(false)
vue.onMounted(async () => {
  await useElementVisible({ selector: `.minimal-profile`, onVisible: () => isVisible.value = true, caller: 'minimalProfile' })
})

// Flickity carousel options
const flickityOptions = vue.computed(() => ({
  dragThreshold: 20,
  selectedAttraction: 0.2,
  friction: 0.8,
  autoPlay: false,
}))

const hoverClasses = 'group-hover/item:text-primary-600 dark:group-hover/item:text-primary-400 transition-colors'
</script>

<template>
  <CardWrap :card class="minimal-profile">
    <div class="flex flex-col md:flex-row gap-10 md:gap-12 xl:gap-24" :class="uc.layout === 'right' ? 'md:flex-row-reverse' : ''">
      <div class="w-full md:w-[30%] lg:w-[50%] shrink-0">
        <div class="relative">
          <EffectGlare class="rounded-[20px]">
            <AnimClipPath
              caller="minimalProfile"
              :animate="true"
              class="aspect-[5/7] relative w-full overflow-hidden clip-path-anim"
            >
              <EffectCarousel
                v-model:active-index="activeItem"
                :slides="mediaItems || []"
                :options="flickityOptions"
                class="h-full w-full"
              >
                <template #default="{ slide: item, index }">
                  <XMedia
                    :media="item.media"
                    class="aspect-[5/7] w-full"
                    image-mode="cover"
                    :data-media-index="index"
                    :card
                    :path="pathCheck(`mediaItems.${index}.media`, schema)"
                  />
                </template>
              </EffectCarousel>
            </AnimClipPath>
          </EffectGlare>
          <NavDots
            v-model:active-item="activeItem"
            :items="mediaItems || []"
            :wrap-selector="`[data-card-id='${card.cardId}']`"
            class="absolute bottom-4 z-20 justify-center w-full "
            :overlay="true"
          />
        </div>
      </div>
      <div class="md:w-[70%] lg:w-[50%] mt-6 md:mt-0 flex items-center">
        <div class="flex flex-col h-full justify-center gap-4 md:gap-12 max-w-full" :class="isVisible ? 'translate-y-0' : 'translate-y-[100px]'">
          <div class="details grow flex flex-col gap-4 justify-center">
            <SuperTitle
              v-if="uc.superTitle"
              :card
              base-path="superTitle"
              :super-title="uc.superTitle"
              size="lg"
            />
            <CardText
              :card
              tag="h1"
              path="title"
              animate="rise"
              class="heading font-semibold text-4xl x-font-title lg:leading-[1.3] lg:text-pretty"
            />

            <XEntry class="">
              <CardText
                tag="div"
                :card
                class="sub-heading text-theme-100"
                path="content"
                animate="rise"
              />
            </XEntry>
            <CardActionArea
              :card
              base-path="action"
              :classes="{
                buttons: 'flex gap-4 text-2xl justify-center md:justify-start flex-wrap',
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </CardWrap>
</template>
