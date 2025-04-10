<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from './config'
import CardText from '@fiction/cards/CardText.vue'
import { pathCheck, vue } from '@fiction/core'
import XIcon from '@fiction/ui/media/XIcon.vue'
import { getColorThemeStyles } from '@fiction/ui/utils'
import CardActionArea from '../el/CardActionArea.vue'
import { schema } from './config'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
  feature: { type: Object as vue.PropType<NonNullable<UserConfig['items']>[0]>, required: true },
  index: { type: Number, required: true },
  style: { type: Object as vue.PropType<UserConfig['style']>, default: () => ({}) },
  layout: { type: Object as vue.PropType<UserConfig['layout']>, default: () => ({}) },
})

function getFeatureStyle() {
  if (!props.feature?.color) {
    return {
      wrapper: 'bg-theme-50/50 dark:bg-theme-900/50',
      iconWrapper: 'bg-theme-100 dark:bg-theme-800 shadow-sm',
      icon: 'text-primary-500 dark:text-primary-400',
    }
  }

  const style = getColorThemeStyles(props.feature.color || 'primary')
  const isCards = props.layout?.style === 'cards'
  const wrapper = isCards
    ? 'bg-white dark:bg-theme-800/20 border border-theme-200 dark:border-theme-700 p-4 lg:p-8 xl:p-12'
    : ''
  return {
    wrapper,
    iconWrapper: `${style?.bg} shadow-sm`,
    icon: style?.text,
  }
}

const iconSize = vue.computed(() => ({
  'xxs': 'size-6',
  'xs': 'size-8',
  'sm': 'size-10',
  'md': 'size-14',
  'lg': 'size-20',
  'xl': 'size-24',
  '2xl': 'size-32',
}[props.style?.iconSize || 'md']))
</script>

<template>
  <div
    class="group relative rounded-2xl transition-all flex flex-col "
    :class="[
      getFeatureStyle().wrapper,
      layout?.align === 'center' ? 'text-left items-start md:text-center md:items-center' : 'text-left items-start',
      layout?.style === 'cards' && layout?.align === 'center' ? 'justify-center' : '',
    ]"
  >
    <div
      class="max-w-[60ch]"
      :class="[
        layout?.align === 'center' ? 'flex flex-col md:items-center justify-center' : '',
      ]"
    >
      <div
        v-if="feature.icon"
        class="rounded-2xl mb-6 flex items-center justify-center"
        :class="[iconSize, getFeatureStyle().iconWrapper]"
      >
        <XIcon
          class="size-[60%]"
          :class="[
            getFeatureStyle().icon,
            style?.iconStyle === 'outline' ? 'stroke-[1.5]' : '',
          ]"
          :media="feature.icon"
        />
      </div>

      <CardText
        tag="h3"
        :card="card"
        :path="pathCheck(`items.${index}.title`, schema)"
        class="text-xl lg:text-2xl font-semibold x-font-title"
        animate="fade"
      />

      <CardText
        tag="p"
        :card="card"
        :path="pathCheck(`items.${index}.description`, schema)"
        class="mt-3 text-lg lg:text-xl text-theme-600 dark:text-theme-300 lg:leading-relaxed"
        animate="fade"
      />

      <CardActionArea
        class="mt-6"
        :card
        :base-path="pathCheck(`items.${index}.action`, schema)"
        :classes="{ buttons: 'flex gap-4  flex-wrap' }"
        theme="primary"
      />
    </div>
  </div>
</template>
