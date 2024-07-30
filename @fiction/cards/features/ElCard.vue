<script lang="ts" setup>
import type { ColorThemeUser } from '@fiction/core'
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import { getColorThemeStyles } from '@fiction/ui/utils'
import CardText from '../CardText.vue'
import type { UserConfig } from './index.js'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => {
  return props.card.userConfig.value || {}
})

function getColorStyle(color?: ColorThemeUser) {
  if (!color) {
    return {
      icon: ' ',
      text: 'bg-theme-100 dark:bg-theme-700/70 text-primary-500 dark:text-theme-500',
    }
  }

  const r = getColorThemeStyles(color || 'theme')

  return {
    icon: [r.bg, r.text, r.border, r.text].join(' '),
    text: r.text,
  }
}

const colorStyle = vue.computed(() => {
  const color = uc.value.superColor
  return getColorStyle(color)
})
</script>

<template>
  <div class="space-y-6 lg:space-y-12">
    <div class=" space-y-4 items-start">
      <div v-if="uc.superHeading || uc.superIcon" class="flex gap-3 items-center mb-6" :class="[colorStyle.text]">
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
      <CardText animate="fade" :card path="heading" class="x-font-title max-w-full text-4xl font-bold tracking-tighter  text-balance" v-html="uc.heading" />
      <CardText animate="fade" :card path="subHeading" class="text-xl lg:text-2xl lg:leading-snug w-full text-balance mt-4 lg:max-w-xl " v-html="uc.subHeading" />
    </div>
    <div class="grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 text-left  grid ">
      <div v-for="(item, i) in uc.items" :key="i">
        <div v-if="item.icon" :class="getColorStyle(item.color).icon" class="mb-3 size-14 rounded-full flex items-center justify-center">
          <div class="text-4xl" :class="[item.icon]" />
        </div>
        <CardText animate="fade" :card class="text-3xl font-bold x-font-title" :path="`items.${i}.name`" />
        <CardText animate="fade" :card class="mt-4 text-xl text-theme-500 dark:text-theme-200" :path="`items.${i}.desc`" />
      </div>
    </div>
  </div>
</template>
