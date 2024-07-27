<script setup lang="ts">
import type { ColorThemeUser } from '@fiction/core'
import { getNavComponentType, getTextColorTheme, vue } from '@fiction/core'
import type { UiElementSize } from '../utils'
import { getBadgeClasses } from '../utils'

const props = defineProps({
  theme: { type: String as vue.PropType<ColorThemeUser>, default: undefined },
  uiSize: { type: String as vue.PropType<UiElementSize>, default: 'sm' },
  href: { type: String, default: null },
  icon: { type: String, default: undefined },
  text: { type: String, default: '' },
})

const theme = vue.computed<ColorThemeUser>(() => {
  return props.theme ? props.theme : props.text ? getTextColorTheme(props.text) : 'theme'
})

const badgeClasses = vue.computed(() => getBadgeClasses({ theme: theme.value, uiSize: props.uiSize, isLink: !!props.href }))
</script>

<template>
  <component
    :is="getNavComponentType({ href }, 'span')"
    :href="href"
    :to="href"
    :class="badgeClasses"
    :data-size="uiSize"
    :data-theme="theme"
  >
    <span v-if="icon" :class="icon" class="text-[1.2em] my-[2px]" />
    <span v-if="text" v-html="text" />
    <span v-else><slot /></span>
  </component>
</template>
