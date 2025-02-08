<script lang="ts" setup>
import { getNavComponentType, pathIsHref, vue } from '@fiction/core'

defineOptions({ name: 'XLink' })

const { href, shouldPrevent = false } = defineProps<{
  href?: string
  shouldPrevent?: boolean
}>()

function handleClick(e: MouseEvent) {
  if (shouldPrevent) {
    e.preventDefault()
  }
}

const linkProps = vue.computed(() => {
  const out = pathIsHref(href) ? { href } : { to: href }
  return out
})
</script>

<template>
  <component
    :is="getNavComponentType({ href })"
    v-bind="linkProps"
    class="x-link"
    @click="handleClick"
  >
    <slot />
  </component>
</template>
