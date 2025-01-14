<script setup lang="ts">
import type { Card } from '@fiction/site'
import type { UserConfig } from '.'
import { getDotpathArrayIndices, pathCheck, vue } from '@fiction/core'
import FlickityCarousel from '@fiction/ui/effect/EffectCarousel.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import CardText from '../CardText.vue'
import CardActionArea from '../el/CardActionArea.vue'
import NavDots from '../el/NavDots.vue'
import SuperTitle from '../el/SuperTitle.vue'
import { schema } from './config'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})
const mediaItems = vue.computed(() => uc.value.items || [])
const activeItem = vue.ref(0)

// Get auto-play interval from config or use default 12s
const autoPlayInterval = vue.computed(() =>
  uc.value.autoSlide ? 12000 : false,
)

// Watch for edit mode to pause carousel
vue.watch(() => props.card.editItem.value, (path) => {
  if (!props.card.isActive.value)
    return

  const [index] = getDotpathArrayIndices(path)
  if (typeof index === 'number') {
    activeItem.value = index
  }
})

// Flickity options with native autoPlay
const flickityOptions = vue.computed(() => ({
  dragThreshold: 20,
  selectedAttraction: 0.2,
  friction: 0.8,
  autoPlay: autoPlayInterval.value,
  pauseAutoPlayOnHover: true,
  // draggable: !props.card.site?.isEditable.value,
}))
</script>

<template>
  <div class="relative h-screen w-full overflow-hidden">
    <FlickityCarousel
      v-model:active-index="activeItem"
      :slides="mediaItems"
      :options="flickityOptions"
    >
      <template #default="{ slide: item, index: i }">
        <div
          class="carousel-cell relative w-full h-screen"
          @click="card.setEditItem({ path: `items.${i}`, caller: 'cinema' })"
        >
          <div v-if="!item.media?.overlay" class="absolute inset-0 bg-black/50 z-10" />
          <XMedia
            v-if="item.media"
            class="absolute inset-0 w-full h-full"
            :media="item.media"
            image-mode="cover"
          />
          <div
            class="absolute inset-0 flex flex-col justify-center items-center text-left md:text-center text-white p-4 z-20"
          >
            <div class="max-w-screen-lg space-y-12">
              <div class="space-y-4 md:space-y-6" @click.stop>
                <SuperTitle
                  :card
                  :base-path="pathCheck(`items.${i}.superTitle`, schema)"
                  class="justify-start md:justify-center opacity-80"
                  theme="overlay"
                  size="xl"
                />
                <div class="space-y-8">
                  <CardText
                    :card
                    tag="h1"
                    :path="pathCheck(`items.${i}.title`, schema)"
                    animate="fade"
                    class="text-4xl lg:text-[calc(20px+4vw)] lg:leading-[1.1] font-semibold x-font-title text-balance line-clamp-3"
                  />
                  <CardText
                    :card
                    tag="p"
                    :path="pathCheck(`items.${i}.subTitle`, schema)"
                    animate="fade"
                    class="mt-2 text-2xl lg:text-[calc(16px+1.3vw)] text-balance !leading-[1.3] line-clamp-2 md:line-clamp-4"
                  />
                </div>
              </div>
              <CardActionArea
                :card
                :base-path="pathCheck(`items.${i}.action`, schema)"
                :classes="{
                  buttons: 'flex gap-3 lg:gap-4 justify-start md:justify-center flex-wrap',
                  subscribe: 'justify-center',
                }"
                size="xl"
                animate="rise"
                theme="overlay"
              />
            </div>
          </div>
        </div>
      </template>
    </FlickityCarousel>

    <NavDots
      v-model:active-item="activeItem"
      :items="mediaItems"
      :wrap-selector="`[data-card-id='${card.cardId}']`"
      class="absolute bottom-4 z-20 left-1/2 -translate-x-1/2 justify-center"
    />
  </div>
</template>
