<script lang="ts" setup>
import { getNavComponentType, vue } from '@fiction/core'

defineOptions({ name: 'XLink' })

const props = defineProps({
  href: { type: String, default: undefined },
})

const linkProps = vue.computed(() => props.href?.startsWith('http') ? { href: props.href } : props.href ? { to: props.href } : {})
</script>

<template>
  <component :is="getNavComponentType({ href })" v-bind="linkProps" class="x-link">
    <slot />
  </component>
</template>
