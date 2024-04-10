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
    out.push('mx-auto text-center')

  return out.join(' ')
})
</script>

<template>
  <div>
    <div
      :class="textWrapClass"
    >
      <div :class="uc.layout === 'justify' ? 'lg:min-w-[50%]' : ''">
        <CardText
          tag="h3"
          :card="card"
          class="text-theme-500 dark:text-theme-500 font-sans text-sm lg:text-base font-medium antialiased"

          path="superHeading"
          placeholder="Super Heading"
        />
        <CardText
          tag="h1"
          :card="card"
          class="x-font-title text-4xl sm:text-5xl lg:text-7xl lg:tracking-tight font-bold text-balance"
          :class="uc.layout === 'justify' || uc.layout === 'left' ? 'mt-3' : 'my-7'"
          path="heading"
          placeholder="Heading"
        />
      </div>
      <div :class="uc.layout === 'justify' ? 'lg:max-w-[50%]' : ''">
        <CardText
          tag="h3"
          :card="card"
          class="mt-8 text-xl lg:text-3xl lg:leading-snug text-balance"
          :class="uc.layout === 'justify' ? 'lg:text-right' : ''"
          path="subHeading"
          placeholder="Sub Heading"
        />
      </div>
    </div>
    <CardActions :card="card" :justify="uc.layout === 'justify' ? 'left' : 'center'" :default-size="uc.layout === 'justify' ? 'lg' : 'xl'" />
  </div>
</template>
