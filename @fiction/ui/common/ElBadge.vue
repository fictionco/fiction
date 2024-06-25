<script setup lang="ts">
import { getNavComponentType, vue } from '@fiction/core'
import type { ColorTheme, UiElementSize } from '../utils'
import { getBadgeClasses } from '../utils'

const props = defineProps({
  theme: { type: String as vue.PropType<ColorTheme>, default: 'theme' },
  size: { type: String as vue.PropType<UiElementSize>, default: 'md' },
  href: { type: String, default: null },
  icon: { type: String, default: undefined },
})

const badgeClasses = vue.computed(() => getBadgeClasses({ theme: props.theme, size: props.size, isLink: !!props.href }))
</script>

<template>
  <component
    :is="getNavComponentType({ href }, 'span')"
    :href="href"
    :to="href"
    :class="badgeClasses"
    :data-size="size"
    :data-theme="theme"
  >
    <span v-if="icon" :class="icon" class="text-[1.2em] my-[2px]" /><slot />
  </component>
</template>
