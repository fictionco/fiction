<script lang="ts" setup>
import { getNavComponentType, pathIsHref, vue } from '@fiction/core'

defineOptions({ name: 'XLink' })

const props = defineProps({
  href: { type: String, default: undefined },
})

const linkProps = vue.computed(() => {
  const { href } = props
  const out = pathIsHref(href) ? { href } : { to: href }
  return out
})
</script>

<template>
  <component :is="getNavComponentType({ href })" v-bind="linkProps" class="x-link">
    <slot />
  </component>
</template>
