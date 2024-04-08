<script lang="ts" setup>
import type { ActionItem, MediaDisplayObject } from '@fiction/core'
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import ElImage from '@fiction/ui/ElImage.vue'
import TextStandard from './TextStandard.vue'

export type UserConfig = {
  heading?: string
  subHeading?: string
  superHeading?: string
  actions?: ActionItem[]
  splash?: MediaDisplayObject
  layout?: 'center' | 'justified' | 'right' | 'left'
}
const props = defineProps({
  card: {
    type: Object as vue.PropType<Card<UserConfig>>,
    required: true,
  },
})

const uc = vue.computed(() => {
  return props.card.userConfig.value || {}
})
</script>

<template>
  <div :class="card.classes.value.contentWidth">
    <div :class="uc.layout === 'left' ? 'flex gap-12 lg:gap-24 items-center' : ''">
      <div :class="uc.layout === 'left' ? 'text-left max-w-xl flex-auto' : ''">
        <TextStandard :card="card" />
      </div>

      <div
        v-if="uc.splash"
        class="flow-root"
        :class="uc.layout === 'left' ? ' w-[50%]' : 'mt-16 sm:mt-20 w-full'"
      >
        <ElImage
          class="w-full rounded-lg overflow-hidden dark:ring-1 dark:ring-theme-800"
          :class="uc.layout === 'left' ? 'lg:aspect-[4/3] w-full' : 'aspect-[2/1]'"
          :media="uc.splash"
        />
      </div>
    </div>
  </div>
</template>
