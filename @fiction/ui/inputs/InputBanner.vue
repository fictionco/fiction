<script lang="ts" setup>
import type { ColorThemeUser, MediaObject } from '@fiction/core'
import type { UiElementSize } from '../utils'
import XIcon from '../media/XIcon.vue'
import { getColorThemeStyles } from '../utils'

defineOptions({ name: 'InputBanner' })

const props = defineProps<{
  modelValue?: string
  theme?: ColorThemeUser
  title?: string
  content?: string
  icon?: MediaObject
  uiSize?: UiElementSize
}>()

const {
  theme = 'primary',
  title = '',
  content = '',
  uiSize = 'md',
} = props

const themeStyles = getColorThemeStyles(theme)

const sizeClasses = {
  'xxs': 'px-1 py-0.5 text-[10px]',
  'xs': 'px-2 py-1 text-[11px]',
  'sm': 'px-3 py-1.5 text-xs',
  'md': 'px-4 py-2 text-sm',
  'lg': 'px-5 py-3 text-base',
  'xl': 'px-6 py-4 text-lg',
  '2xl': 'px-8 py-5 text-xl',
}
</script>

<template>
  <div
    class="rounded-lg border relative"
    :class="[
      themeStyles?.bg,
      themeStyles?.border,
      sizeClasses[uiSize],
    ]"
  >
    <div class="flex items-start gap-3">
      <div v-if="icon" class="flex-shrink-0 mt-0.5">
        <XIcon :media="icon" :class="themeStyles?.text" />
      </div>
      <div class="flex-1">
        <p v-if="title" class="font-medium" :class="[themeStyles?.text]">
          {{ title }}
        </p>
        <p v-if="content" class="text-[.85em] " :class="[themeStyles?.text]">
          {{ content }}
        </p>
        <slot />
      </div>
    </div>
  </div>
</template>
