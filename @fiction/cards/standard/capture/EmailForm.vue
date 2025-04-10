<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from './config'
import { vue } from '@fiction/core'
import XLogo from '@fiction/ui/media/XLogo.vue'
import CardText from '../CardText.vue'
import CardActionArea from '../el/CardActionArea.vue'

const { card, animate = false } = defineProps<{
  card: Card<UserConfig>
  animate?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:dismissed', payload: boolean): void
  (event: 'update:subscribed', payload: string): void
}>()

const uc = vue.computed(() => {
  return card.userConfig.value || {}
})
</script>

<template>
  <div class="relative ">
    <div class="space-y-6 max-w-lg mx-auto">
      <div class="mx-auto text-left">
        <div v-if="uc.media" class="mb-3 md:mb-6 text-center">
          <div class="relative inline-block dark:text-theme-0">
            <XLogo :animate="animate ? 'swipe' : false" class="h-10 md:h-16 aspect-[2/1] object-contain" :media="uc.media" />
          </div>
        </div>
        <CardText :animate="animate" path="superTitle.text" :card class="font-sans text-sm text-theme-400/80 font-medium  mb-3" />
        <CardText :animate="animate" path="title" :card class="x-font-title text-xl md:text-2xl font-semibold x-font-title" />
        <CardText :animate="animate" path="subTitle" :card class="text-sm md:text-base text-theme-500 dark:text-theme-300 my-3" />
      </div>
      <CardActionArea
        size="lg"
        :card
        :classes="{ buttons: 'flex gap-4' }"
        base-path="action"
        :enable-confirm-modal="false"
        @update:subscribed="emit('update:subscribed', $event)"
      />
    </div>
  </div>
</template>
