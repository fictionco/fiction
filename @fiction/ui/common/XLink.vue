<script lang="ts" setup>
import { getNavComponentType, pathIsHref, vue } from '@fiction/core'
import { SITE_INJECTION_KEY } from '@fiction/site'

defineOptions({ name: 'XLink' })

const { href, shouldPrevent = false } = defineProps<{
  href?: string
  shouldPrevent?: boolean
}>()

const site = vue.inject(SITE_INJECTION_KEY, vue.computed(() => undefined))

const prevent = vue.computed(() => !!(site.value?.siteMode.value === 'editable' || shouldPrevent))

const linkProps = vue.computed(() => pathIsHref(href) ? { href } : { to: href })
</script>

<template>
  <component
    :is="prevent ? 'a' : getNavComponentType({ href })"
    v-bind="linkProps"
    class="x-link"
    :data-prevent="prevent"
    @click="prevent ? $event.preventDefault() : undefined"
  >
    <slot />
  </component>
</template>
