<script lang="ts" setup>
import type { Card } from '@fiction/site'
import { getNavComponentType, pathIsHref, vue } from '@fiction/core'
import { SITE_INJECTION_KEY } from '@fiction/site'

defineOptions({ name: 'XLink' })

const props = defineProps<{
  href?: string
  shouldPrevent?: boolean
  card?: Card
  isActive?: boolean
  effect?: 'underline' | 'none' | string
}>()

const site = vue.inject(SITE_INJECTION_KEY, vue.computed(() => props.card?.site))
const isEditable = vue.computed(() => site.value?.siteMode.value === 'editable')
const prevent = vue.computed(() => !!(isEditable.value || props.shouldPrevent))
const href = vue.computed(() => props.card ? props.card.link(props.href) : props.href)
const linkProps = vue.computed(() => pathIsHref(href.value) ? { href: href.value } : { to: href.value })
</script>

<template>
  <component
    :is="prevent ? 'a' : getNavComponentType({ href })"
    v-bind="linkProps"
    class="x-link "
    :class="[
      isActive ? 'is-active' : '',
      effect === 'underline' ? 'underline-effect relative inline-block no-underline' : '',
    ]"
    :data-effect="effect"
    :data-prevent="prevent"
    :title="isEditable ? 'Links are disabled in edit mode' : undefined"
    @click="prevent ? $event.preventDefault() : undefined"
  >
    <slot />
  </component>
</template>

<style scoped>
.x-link.underline-effect {
  &::after,
  &.is-active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1.5px;
    background-color: currentColor;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover::after,
  &.is-active::after {
    transform: scaleX(1);
    transform-origin: left;
  }
}
</style>
