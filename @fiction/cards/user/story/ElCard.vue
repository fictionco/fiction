<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from '.'
import { pathCheck, vue } from '@fiction/core'
import EffectScrollReveal from '@fiction/ui/effect/EffectScrollReveal.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import CardText from '../../CardText.vue'
import CardWrap from '../../CardWrap.vue'
import CardActionArea from '../../el/CardActionArea.vue'
import { schema } from './config'

const { card } = defineProps<{
  card: Card<UserConfig>
}>()

const uc = vue.computed(() => card.userConfig.value || {})

const editingStoryText = vue.ref(false)
</script>

<template>
  <CardWrap :card>
    <div v-for="(item, i) in uc.items" :key="i" class="py-[4vw]">
      <div
        class="md:flex gap-8 md:gap-16 lg:gap-20 relative space-y-6 md:space-y-0"
        :class="[card.classes.value.contentWidth, uc.layout === 'right' ? 'md:flex-row-reverse' : '']"
      >
        <div class="md:w-[clamp(100px,20%,400px)] pt-4 pb-8">
          <div class="top-6 flex justify-center md:justify-end" :class="uc.scrollHandling === 'sticky' ? 'sticky' : ''">
            <XMedia :animate="true" :media="item.media" class="aspect-square w-full " />
          </div>
        </div>
        <div class=" md:w-[70%] grow space-y-6">
          <EffectScrollReveal class="space-y-4" :disable="card.site?.isEditable.value">
            <CardText
              :card
              :path="pathCheck(`items.${i}.title`, schema)"
              tag="h2"
              class="text-3xl x-font-title text-theme-300 dark:text-theme-600  "
            />
            <CardText
              tag="div"
              :card
              :path="pathCheck(`items.${i}.content`, schema)"
              class="text-xl sm:text-3xl lg:text-4xl xl:text-5xl !leading-relaxed"
              @editing="editingStoryText = $event"
            />
          </EffectScrollReveal>

          <CardActionArea
            size="lg"
            :card
            :base-path="pathCheck(`items.${i}.action`, schema)"
            :classes="{
              buttons: 'flex gap-4 lg:gap-6 text-2xl justify-start flex-wrap',
            }"
          />
        </div>
      </div>
    </div>
  </CardWrap>
</template>
