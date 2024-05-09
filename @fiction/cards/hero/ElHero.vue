<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import ElImage from '@fiction/ui/media/ElImage.vue'
import CardHeader from '../el/CardHeader.vue'

import type { UserConfig } from '.'

const props = defineProps({
  card: {
    type: Object as vue.PropType<Card<UserConfig>>,
    required: true,
  },
})

const uc = vue.computed(() => {
  return props.card.userConfig.value || {}
})

const wrapperClass = vue.computed(() => {
  const out = []

  if (uc.value.layout === 'right')
    out.push('flex flex-col lg:flex-row-reverse gap-12 lg:gap-24 items-center')

  else if (uc.value.layout === 'left')
    out.push('flex flex-col lg:flex-row gap-12 lg:gap-24 items-center')

  return out.join(' ')
})

const textWrapClass = vue.computed(() => {
  const out = []
  const layout = uc.value.layout || ''

  if (['right', 'left'].includes(layout))
    out.push('max-w-xl flex-auto')

  return out.join(' ')
})

const mediaWrapClass = vue.computed(() => {
  const out = []
  const layout = uc.value.layout || ''

  if (['right', 'left'].includes(layout))
    out.push('w-full lg:w-[50%]')
  else
    out.push('mt-16 sm:mt-20 w-full')

  return out.join(' ')
})

const mediaClass = vue.computed(() => {
  const out = []
  const layout = uc.value.layout || ''

  if (['right', 'left'].includes(layout))
    out.push('aspect-[5/3] w-full')
  else
    out.push('aspect-[2/1]')

  return out.join(' ')
})
</script>

<template>
  <div :class="card.classes.value.contentWidth">
    <div
      :class="wrapperClass"
    >
      <div :class="textWrapClass">
        <CardHeader :card="card" />
      </div>

      <div
        v-if="uc.splash"
        class="flow-root"
        :class="mediaWrapClass"
      >
        <ElImage
          data-key="splash"
          class="w-full rounded-lg overflow-hidden dark:ring-1 dark:ring-theme-800"
          :class="mediaClass"
          :media="uc.splash"
          :animate="true"
        />
      </div>
    </div>
  </div>
</template>
