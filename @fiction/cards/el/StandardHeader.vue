<script lang="ts" setup>
import type { Card } from '@fiction/site'
import { pathCheck, vue } from '@fiction/core'
import { StandardUserConfigSchema as schema } from '@fiction/site/schema'
import CardText from '../CardText.vue'

import SuperTitle from './SuperTitle.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  withActions: { type: Boolean, default: true },
})

const headers = vue.computed(() => props.card.userConfig.value.standard?.headers || {})

type HeaderSize = 'xs' | 'sm' | 'md' | 'lg'
const headerSize = vue.computed(() => (headers.value.size as HeaderSize) || 'md')

const textWrapClass = vue.computed(() => {
  const out = []
  const layout = headers.value.layout || ''

  if (layout === 'inline') {
    out.push('flex flex-col md:flex-row text-left items-center gap-6')
  }
  else if (layout === 'justify') {
    out.push('lg:flex justify-between text-left items-end gap-8')
  }
  else if (layout === 'left') {
    out.push('text-left')
  }
  else if (layout === 'right') {
    out.push('text-right')
  }
  else {
    out.push('mx-auto text-left md:text-center')
  }

  return out.join(' ')
})

const layout = vue.computed(() => headers.value.layout || 'center')

type SizeClasses = {
  superTitle: string
  title: string
  subTitle: string
  spacing: string
}

const sizeClasses: Record<HeaderSize, SizeClasses> = {
  xs: {
    superTitle: 'text-xs lg:text-sm',
    title: 'text-lg md:text-2xl ',
    subTitle: 'text-sm md:text-base lg:text-lg',
    spacing: 'mb-3 gap-2',
  },
  sm: {
    superTitle: 'text-sm lg:text-base',
    title: 'text-xl md:text-3xl ',
    subTitle: 'text-lg md:text-xl lg:text-xl',
    spacing: 'mb-4 gap-2',
  },
  md: {
    superTitle: 'text-sm lg:text-base',
    title: 'text-2xl md:text-4xl',
    subTitle: 'text-lg md:text-xl',
    spacing: 'mb-5 gap-3',
  },
  lg: {
    superTitle: 'text-base lg:text-lg',
    title: 'text-3xl md:text-5xl ',
    subTitle: 'text-2xl md:text-3xl lg:text-3xl',
    spacing: 'mb-6 gap-3',
  },
}

const currentSizeClasses = vue.computed(() => sizeClasses[headerSize.value])
</script>

<template>
  <div>
    <div
      class="space-y-1 md:space-y-3"
      :class="textWrapClass"
      data-option-path="layout"
      :data-layout="layout"
    >
      <div class="space-y-2" :class="layout === 'justify' ? 'lg:min-w-[50%]' : 'mx-auto'">
        <SuperTitle
          :card
          :base-path="pathCheck('standard.headers.superTitle', schema)"
          :class="[
            layout === 'center' ? 'md:justify-center' : layout === 'right' ? 'md:justify-end' : '',
            currentSizeClasses.spacing,
          ]"
        />
        <CardText
          tag="h2"
          :card
          class="x-font-title md:text-balance x-font-title font-semibold "
          :class="[
            currentSizeClasses.title,
          ]"
          :path="pathCheck('standard.headers.title', schema)"
          placeholder="Title"
          animate="fade"
        />
      </div>
      <div :class="layout === 'justify' ? 'lg:max-w-[50%]' : 'mx-auto'">
        <CardText
          tag="div"
          :card
          class="lg:leading-snug md:text-balance max-w-[65ch] text-theme-700 dark:text-theme-200"
          :class="[
            currentSizeClasses.subTitle,
            layout === 'justify' ? 'lg:text-right' : '',
            layout === 'center' ? 'mx-auto' : '',
          ]"
          :path="pathCheck('standard.headers.subTitle', schema)"
          placeholder="Sub Title"
          animate="fade"
        />
      </div>
    </div>
  </div>
</template>
