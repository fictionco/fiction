<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from '.'
import { pathCheck, vue } from '@fiction/core'
import EffectParallax from '@fiction/ui/effect/EffectParallax.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import CardText from '../../CardText.vue'
import CardWrap from '../../CardWrap.vue'
import CardActionArea from '../../el/CardActionArea.vue'
import XSuperTitle from '../../el/SuperTitle.vue'
import { schema } from './config.js'

const { card } = defineProps<{
  card: Card<UserConfig>
}>()

const uc = vue.computed(() => card.userConfig.value || {})

function getLayoutClasses(layout: string = 'center') {
  const layouts = {
    center: {
      container: 'text-center space-y-8',
      content: 'mx-auto max-w-4xl space-y-6',
      title: 'mx-auto max-w-xl',
      subtitle: 'mx-auto max-w-xl',
      media: 'mx-auto max-w-2xl',
      actions: 'justify-center',
      supertitle: 'justify-center',
    },
    left: {
      container: 'text-left space-y-8 md:space-y-0 md:grid md:grid-cols-2 md:gap-16 md:items-center',
      content: 'space-y-6',
      title: '',
      subtitle: 'max-w-xl',
      media: 'w-full',
      actions: 'justify-start',
      supertitle: 'justify-start',
    },
    right: {
      container: 'text-left space-y-8 md:space-y-0 md:grid md:grid-cols-2 md:gap-16 md:items-center',
      content: 'space-y-6 md:order-2',
      title: '',
      subtitle: 'max-w-xl',
      media: 'w-full md:order-1',
      actions: 'justify-start',
      supertitle: 'justify-start',
    },
    justify: {
      container: 'text-left space-y-8',
      content: 'space-y-6 md:flex md:justify-between md:items-end md:gap-12',
      title: '',
      subtitle: 'max-w-md',
      media: 'w-full',
      actions: 'justify-end',
      supertitle: 'justify-start',
    },
  }
  return layouts[layout as keyof typeof layouts] || layouts.center
}

function getAspectClasses(aspect?: string) {
  if (!aspect || aspect === 'auto')
    return ''
  const aspects = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[16/9]',
  }
  return aspects[aspect as keyof typeof aspects] || ''
}

function getOverlayClasses(position: string = 'bottomRight') {
  const positions = {
    top: 'top-4 left-1/2 -translate-x-1/2',
    bottom: 'bottom-4 left-1/2 -translate-x-1/2',
    left: 'left-4 top-1/2 -translate-y-1/2',
    right: 'right-4 top-1/2 -translate-y-1/2',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    bottomRight: 'bottom-4 right-4',
    topRight: 'top-4 right-4',
    bottomLeft: 'bottom-4 left-4',
    topLeft: 'top-4 left-4',
  }
  return positions[position as keyof typeof positions] || positions.bottomRight
}
</script>

<template>
  <CardWrap :card>
    <div class="space-y-32">
      <div
        v-for="(item, i) in uc.items"
        :key="i"
        :class="getLayoutClasses(item.layout).container"
      >
        <!-- Content -->
        <div class="hero-content" :class="getLayoutClasses(item.layout).content">
          <div class="space-y-4" :class="item.layout === 'justify' ? 'md:flex-1' : ''">
            <XSuperTitle
              :card
              :base-path="pathCheck(`items.${i}.superTitle`, schema)"
              :class="getLayoutClasses(item.layout).supertitle"
            />

            <CardText
              tag="h1"
              :card
              class="x-font-title font-semibold text-3xl md:text-4xl lg:text-5xl leading-tight text-pretty"
              :class="getLayoutClasses(item.layout).title"
              :path="pathCheck(`items.${i}.title`, schema)"
              placeholder="Hero Title"
            />

            <CardText
              tag="p"
              :card
              class="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed text-balance"
              :class="getLayoutClasses(item.layout).subtitle"
              :path="pathCheck(`items.${i}.subTitle`, schema)"
              placeholder="Supporting description"
            />
          </div>

          <CardActionArea
            v-if="item.layout === 'justify'"
            :base-path="pathCheck(`items.${i}.action`, schema)"
            :card
            :classes="{ buttons: `flex gap-4 ${getLayoutClasses(item.layout).actions}` }"
            size="lg"
          />
        </div>

        <!-- Actions for non-justify layouts -->
        <CardActionArea
          v-if="item.layout !== 'justify'"
          :base-path="pathCheck(`items.${i}.action`, schema)"
          :card
          :classes="{ buttons: `flex gap-4 ${getLayoutClasses(item.layout).actions}` }"
          size="lg"
          class="md:hidden"
        />

        <!-- Media -->
        <div
          v-if="item.media?.url || item.media?.html"
          class="relative w-full"
          :class="getLayoutClasses(item.layout).media"
        >
          <div
            class="relative overflow-hidden rounded-lg"
            :class="getAspectClasses(item.media?.aspect)"
          >
            <XMedia
              :media="item.media"
              :class="getAspectClasses(item.media?.aspect) ? 'w-full h-full' : 'w-full h-auto'"
              :path="pathCheck(`items.${i}.media`, schema)"
              :card
              :image-mode="getAspectClasses(item.media?.aspect) ? 'cover' : 'inline'"
            />

            <!-- Overlays -->
            <div
              v-for="(overlay, ii) in item.overlays"
              :key="ii"
              class="absolute z-10"
              :class="getOverlayClasses(overlay.position)"
              :style="{ width: `${overlay.widthPercent || 30}%` }"
            >
              <EffectParallax class="w-full h-full">
                <XMedia
                  :media="overlay.media"
                  class="rounded-md shadow-lg w-full h-auto"
                  :path="pathCheck(`items.${i}.overlays.${ii}.media`, schema)"
                  :card
                  image-mode="inline"
                />
              </EffectParallax>
            </div>
          </div>
        </div>

        <!-- Actions for non-justify layouts on desktop -->
        <CardActionArea
          v-if="item.layout !== 'justify'"
          :base-path="pathCheck(`items.${i}.action`, schema)"
          :card
          :classes="{ buttons: `hidden md:flex gap-4 ${getLayoutClasses(item.layout).actions}` }"
          size="lg"
        />
      </div>
    </div>
  </CardWrap>
</template>
