<script lang="ts" setup>
import type { ActionItem, colorTheme } from '@fiction/core'
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import { getColorThemeStyles } from '@fiction/ui/utils'
import CardText from '../CardText.vue'
import CardActions from './CardActions.vue'

export type UserConfig = {
  heading?: string
  subHeading?: string
  superHeading?: string
  superIcon?: string
  superColor?: typeof colorTheme[number]
  actions?: ActionItem[]
  layout?: 'center' | 'justify' | 'right' | 'left'

}

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => {
  return props.card.userConfig.value || {}
})

const colorStyle = vue.computed(() => {
  const color = uc.value.superColor
  if (!color) {
    return {
      icon: 'text-primary-500 dark:text-theme-100 bg-primary-100/80 dark:bg-theme-700/80',
      text: 'text-theme-500 dark:text-theme-300/50',
    }
  }

  const r = getColorThemeStyles(uc.value.superColor || 'theme')
  return {
    icon: [r.bg, r.text, r.border].join(' '),
    text: r.text,
  }
})

const textWrapClass = vue.computed(() => {
  const out = []
  const layout = uc.value.layout || ''

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

const layout = vue.computed(() => {
  return uc.value.layout || 'center'
})
</script>

<template>
  <div>
    <div
      :class="textWrapClass"
      data-key="layout"
      :data-layout="layout"
    >
      <div class="max-w-screen-lg" :class="layout === 'justify' ? 'lg:min-w-[50%]' : 'mx-auto'">
        <div v-if="uc.superHeading || uc.superIcon" class="flex gap-3 items-center mb-6" :class="[colorStyle.text, layout === 'center' ? 'md:justify-center' : '']">
          <div v-if="uc.superIcon" :class="colorStyle.icon" class="size-10 rounded-full flex items-center justify-center">
            <div :class="uc.superIcon" class="text-2xl" />
          </div>
          <CardText
            tag="h3"
            :card="card"
            class=" font-sans text-sm lg:text-lg font-medium antialiased"
            path="superHeading"
            placeholder="Super Heading"
            animate="fade"
          />
        </div>
        <CardText
          tag="h1"
          :card
          class="x-font-title dark:text-theme-0 text-theme-900  lg:tracking-tight font-bold md:text-balance text-4xl sm:text-5xl"
          :class="[
            layout === 'justify' || layout === 'left' ? 'mt-3' : 'my-7',
            !['left', 'right'].includes(layout) ? 'lg:text-[5rem]' : 'lg:text-6xl']"
          path="heading"
          placeholder="Heading"
          animate="fade"
        />
      </div>
      <div class="max-w-screen-lg" :class="layout === 'justify' ? 'lg:max-w-[50%]' : 'mx-auto'">
        <CardText
          tag="div"
          :card="card"
          class="mt-8 text-xl lg:text-3xl lg:leading-snug md:text-balance"
          :class="layout === 'justify' ? 'lg:text-right' : ''"
          path="subHeading"
          placeholder="Sub Heading"
          animate="fade"
        />
      </div>
    </div>
    <CardActions :card="card" :justify="['justify', 'left', 'right'].includes(layout) ? 'left' : 'center'" :ui-size="layout === 'justify' ? 'lg' : 'xl'" />
  </div>
</template>
