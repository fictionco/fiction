<script lang="ts" setup>
import { vue } from '@fiction/core'
import { getColorThemeStyles } from '@fiction/ui/utils'
import type { Card } from '@fiction/site'
import CardText from '../CardText.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  withActions: { type: Boolean, default: true },
})

const headers = vue.computed(() => props.card.userConfig.value.standard?.headers || {})

type HeaderSize = 'xs' | 'sm' | 'md' | 'lg'
const headerSize = vue.computed(() => (headers.value.size as HeaderSize) || 'md')

const colorStyle = vue.computed(() => {
  const color = headers.value.superColor
  if (!color) {
    return {
      icon: 'text-primary-500 dark:text-theme-100 bg-primary-100/80 dark:bg-theme-700/80',
      text: 'text-theme-500 dark:text-theme-300/50',
    }
  }

  const r = getColorThemeStyles(headers.value.superColor || 'theme')
  return {
    icon: [r.bg, r.text, r.border].join(' '),
    text: r.text,
  }
})

const textWrapClass = vue.computed(() => {
  const out = []
  const layout = headers.value.layout || ''

  if (layout === 'justify')
    out.push('lg:flex justify-between text-left items-end gap-8')
  else if (layout === 'left')
    out.push('text-left')
  else if (layout === 'right')
    out.push('text-left')
  else
    out.push('mx-auto text-left md:text-center')

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
    title: 'text-2xl lg:text-3xl',
    subTitle: 'text-base lg:text-lg',
    spacing: 'mb-3 gap-2',
  },
  sm: {
    superTitle: 'text-sm lg:text-base',
    title: 'text-3xl lg:text-4xl',
    subTitle: 'text-lg lg:text-xl',
    spacing: 'mb-4 gap-2',
  },
  md: {
    superTitle: 'text-sm lg:text-base',
    title: 'text-4xl lg:text-5xl',
    subTitle: 'text-xl lg:text-2xl',
    spacing: 'mb-5 gap-3',
  },
  lg: {
    superTitle: 'text-base lg:text-lg',
    title: 'text-5xl lg:text-6xl',
    subTitle: 'text-2xl lg:text-3xl',
    spacing: 'mb-6 gap-3',
  },
}

const currentSizeClasses = vue.computed(() => sizeClasses[headerSize.value])
</script>

<template>
  <div>
    <div
      :class="textWrapClass"
      data-key="layout"
      :data-layout="layout"
    >
      <div :class="layout === 'justify' ? 'lg:min-w-[50%]' : 'mx-auto'">
        <div
          v-if="headers.superTitle || headers.superIcon"
          class="flex items-center"
          :class="[
            colorStyle.text,
            layout === 'center' ? 'md:justify-center' : '',
            currentSizeClasses.spacing,
          ]"
        >
          <div
            v-if="headers.superIcon"
            :class="colorStyle.icon"
            class="size-10 rounded-full flex items-center justify-center"
          >
            <div :class="headers.superIcon" class="text-2xl" />
          </div>
          <CardText
            tag="h4"
            :card="card"
            class="font-sans font-medium"
            :class="[currentSizeClasses.superTitle]"
            path="standard.headers.superTitle"
            placeholder="Super Heading"
            animate="fade"
          />
        </div>
        <CardText
          tag="h2"
          :card="card"
          class="x-font-title md:text-balance x-font-title font-semibold"
          :class="[
            currentSizeClasses.title,
            layout === 'justify' || layout === 'left' ? 'mt-3' : 'my-5',
          ]"
          path="standard.headers.title"
          placeholder="Title"
          animate="fade"
        />
      </div>
      <div :class="layout === 'justify' ? 'lg:max-w-[50%]' : 'mx-auto'">
        <CardText
          tag="div"
          :card="card"
          class="mt-5 lg:leading-snug md:text-balance"
          :class="[
            currentSizeClasses.subTitle,
            layout === 'justify' ? 'lg:text-right' : '',
          ]"
          path="standard.headers.subTitle"
          placeholder="Sub Title"
          animate="fade"
        />
      </div>
    </div>
  </div>
</template>
