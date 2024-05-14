<script lang="ts" setup>
import type { ActionItem } from '@fiction/core'
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import CardText from '../CardText.vue'
import CardActions from './CardActions.vue'

export type UserConfig = {
  heading?: string
  subHeading?: string
  superHeading?: string
  actions?: ActionItem[]
  layout?: 'center' | 'justify' | 'right' | 'left'
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
      <div :class="layout === 'justify' ? 'lg:min-w-[50%]' : ''">
        <CardText
          tag="h3"
          :card="card"
          class="text-theme-500 dark:text-primary-300/50 font-sans text-sm lg:text-lg font-medium antialiased"
          path="superHeading"
          placeholder="Super Heading"
          animate="fade"
        />
        <CardText
          tag="h1"
          :card="card"
          class="x-font-title dark:text-theme-0 text-theme-900 text-4xl sm:text-5xl lg:text-7xl lg:tracking-tight font-bold text-balance"
          :class="layout === 'justify' || layout === 'left' ? 'mt-3' : 'my-7'"
          path="heading"
          placeholder="Heading"
          animate="fade"
        />
      </div>
      <div :class="layout === 'justify' ? 'lg:max-w-[50%]' : ''">
        <CardText
          tag="div"
          :card="card"
          class="mt-8 text-xl lg:text-3xl lg:leading-snug text-balance"
          :class="layout === 'justify' ? 'lg:text-right' : ''"
          path="subHeading"
          placeholder="Sub Heading"
          animate="fade"
        />
      </div>
    </div>
    <CardActions :card="card" :justify="['justify', 'left', 'right'].includes(layout) ? 'left' : 'center'" :default-size="layout === 'justify' ? 'lg' : 'xl'" />
  </div>
</template>
