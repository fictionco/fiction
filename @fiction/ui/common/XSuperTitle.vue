<script lang="ts" setup>
import type { ColorThemeUser, StandardSize, SuperTitle } from '@fiction/core'
import { vue } from '@fiction/core'
import XIcon from '@fiction/ui/media/XIcon.vue'
import { getColorThemeStyles } from '@fiction/ui/utils'
import XText from './XText.vue'

const {
  theme = 'muted',
  size = 'md',
  superTitle,
} = defineProps<{
  theme?: ColorThemeUser
  size?: StandardSize
  superTitle?: SuperTitle
}>()

const sup = vue.computed(() => {
  return superTitle || {}
})

const colorStyle = vue.computed(() => {
  const colorTheme = sup.value.theme || theme || 'muted'
  const styles = getColorThemeStyles(colorTheme)
  return {
    icon: [styles?.bg, styles?.text, styles?.border].join(' '),
    text: styles?.text,
  }
})

const sizeClasses = vue.computed(() => {
  const sizes = {
    'xxs': { gap: 'gap-0.5', icon: 'size-5', iconInner: 'size-3.5', text: 'text-[10px]' },
    'xs': { gap: 'gap-1', icon: 'size-6', iconInner: 'size-4', text: 'text-xs' },
    'sm': { gap: 'gap-1.5', icon: 'size-6', iconInner: 'size-4', text: 'text-sm' },
    'md': { gap: 'gap-2', icon: 'size-8', iconInner: 'size-5', text: 'text-base' },
    'lg': { gap: 'gap-2.5', icon: 'size-10', iconInner: 'size-6', text: 'text-lg' },
    'xl': { gap: 'gap-2 lg:gap-3', icon: 'size-8 lg:size-12', iconInner: 'size-5 lg:size-8', text: 'text-base lg:text-xl' },
    '2xl': { gap: 'gap-2 lg:gap-3', icon: 'size-8 lg:size-14', iconInner: 'size-5 lg:size-10', text: 'text-base lg:text-2xl' },
  }

  return sizes[size]
})
</script>

<template>
  <div
    v-if="sup.text || sup.icon"
    class="flex items-center antialiased"
    :class="[colorStyle.text, sizeClasses.gap]"
  >
    <div
      v-if="sup.icon"
      :class="[colorStyle.icon, sizeClasses.icon]"
      class="rounded-full flex items-center justify-center"
    >
      <XIcon
        :media="sup.icon"
        :class="sizeClasses.iconInner"
      />
    </div>
    <XText
      tag="h3"
      :model-value="sup.text"
      class="font-sans"
      :class="sizeClasses.text"
      placeholder="Super Title"
      animate="fade"
    />
  </div>
</template>
