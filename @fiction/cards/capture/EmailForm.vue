<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import ElEmail from '@fiction/ui/inputs/InputEmail.vue'
import ElButton from '@fiction/ui/ElButton.vue'
import ElImage from '@fiction/ui/media/ElImage.vue'
import CardText from '../CardText.vue'

import type { UserConfig } from '.'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
  animate: { type: Boolean, default: false },
})

const emit = defineEmits<{
  (event: 'update:vis', payload: boolean): void
}>()

const uc = vue.computed(() => {
  return props.card.userConfig.value || {}
})
</script>

<template>
  <div class="max-w-md mx-auto space-y-8">
    <div class="mx-auto  text-center">
      <div v-if="uc.media" class="mb-3 md:mb-6 text-center">
        <div class="relative inline-block dark:text-theme-0">
          <ElImage
            :animate="animate ? 'swipe' : false"
            class="h-10 md:h-20 aspect-[2/1] object-contain"
            :media="uc.media"
          />
        </div>
      </div>
      <CardText :animate="animate" path="superHeading" :card="card" class="font-sans text-sm text-theme-400/80 font-medium  text-balance mb-3" />
      <CardText :animate="animate" path="heading" :card="card" class="x-font-title text-xl md:text-2xl font-semibold  text-balance" />
      <CardText :animate="animate" path="subHeading" :card="card" class="text-sm md:text-base text-theme-500 dark:text-theme-300 text-balance my-3" />
    </div>
    <div class="flex gap-2 mx-auto max-w-xs md:max-w-sm">
      <ElEmail />
      <ElButton btn="primary" class="shrink-0" icon-after="i-tabler-arrow-big-right">
        Follow
      </ElButton>
    </div>

    <div class=" text-xs font-sans antialiased font-medium text-center">
      <a href="#" class="text-theme-300 dark:text-theme-500 hover:opacity-80 cursor-pointer select-none" @click.prevent="emit('update:vis', false)">{{ uc.dismissText }} &rarr;</a>
    </div>
  </div>
</template>
