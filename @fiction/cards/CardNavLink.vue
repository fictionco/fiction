<script lang="ts" setup>
import type { NavListItem } from '@fiction/core'
import type { Card } from '@fiction/site'
import { useService, vue } from '@fiction/core'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import XText from '@fiction/ui/common/XText.vue'
import XIcon from '@fiction/ui/media/XIcon.vue'
import CardButton from './CardButton.vue'
import CardText from './CardText.vue'
import CardLink from './el/CardLink.vue'

defineOptions({ name: 'CardNavLink' })

const { item, depth = -1, card, hoverEffect, animate } = defineProps<{
  item: NavListItem
  depth?: number
  card: Card
  hoverEffect?: 'underline' | 'background'
  animate?: 'rise' | 'fade'
}>()

const service = useService()

const styles = vue.computed(() => ({
  componentType: item.variant === 'button' ? CardButton : CardLink,
  theme: item.theme || 'default',
}))

const textClasses = vue.computed(() => [
  'group-hover/nav-link:text-theme-500 dark:group-hover/nav-link:text-theme-200 transition-colors duration-300',
  hoverEffect === 'underline' && 'nav-link-underline',
  hoverEffect === 'background' && 'nav-link-background',
  item.isActive && 'is-active',
])
</script>

<template>
  <component
    :is="styles.componentType"
    :card="card"
    :theme="styles.theme"
    :design="item.design"
    :href="item.href"
    :target="item.target || '_self'"
    class="group/nav-link"
    :class="{ 'cursor-default': !item.href, 'cursor-pointer': item.href }"
  >
    <span class="inline-flex items-center gap-x-1.5 relative w-full">
      <ElAvatar
        v-if="item.variant === 'avatar' && service.fictionUser.activeUser.value"
        class="size-[1.4em] mr-1.5 rounded-full ring-2 ring-theme-200 dark:ring-theme-0"
        :user="service.fictionUser.activeUser.value"
      />
      <XIcon
        v-else-if="item.icon"
        :media="item.icon"
        class="size-[1.05em] text-theme-500 dark:text-theme-200 transition-colors duration-300"
      />
      <CardText
        v-if="item.basePath"
        :card="card"
        :path="`${item.basePath}.label`"
        tag="span"
        class="relative"
        :class="textClasses"
        :animate="animate"
      />
      <slot v-else-if="$slots.default" />
      <XText
        v-else
        tag="span"
        :model-value="item.label"
        :animate="animate"
        :class="textClasses"
      />
      <XIcon
        v-if="item.iconAfter"
        :media="item.iconAfter"
        class="size-[1.05em] text-theme-500 dark:text-theme-200 transition-colors duration-300"
      />
      <span
        v-else-if="item.target === '_blank'"
        class="opacity-30 group-hover:translate-x-[1px] group-hover:-translate-y-[1px] transition-all"
      >
        <span class="block i-heroicons-arrow-up-right-20-solid" />
      </span>
      <span
        v-else-if="item.list?.items?.length && depth === 0"
        class="opacity-30 group-hover:opacity-60 transition-all i-tabler-chevron-down"
      />
    </span>
  </component>
</template>

<style lang="less">
.nav-link-underline::after {
  content: '';
  position: absolute;
  bottom: -0.2em;
  left: 0;
  right: 0;
  height: 1.5px;
  border-radius: 5px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-link-underline:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

.nav-link-underline.is-active::after {
  transform: scaleX(1);
}

.nav-link-background {
  position: relative;
  z-index: 0;
}

.nav-link-background::before {
  content: '';
  position: absolute;
  top: -0.25em;
  bottom: -0.25em;
  left: -0.5em;
  right: -0.5em;
  background: theme('colors.theme.700' / 60%);
  border-radius: 9999px;
  transform: translateY(100%);
  opacity: 0;
  z-index: -1;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s;
}

.nav-link-background:hover::before {
  transform: translateY(0);
  opacity: 1;
  background: theme('colors.theme.600' / 70%);
}

.nav-link-background:not(:hover)::before {
  transform: translateY(-100%);
  opacity: 0;
}

.nav-link-background.is-active::before {
  transform: translateY(0);
  opacity: 1;
  background: theme('colors.theme.700' / 80%);
}

@media (prefers-reduced-motion: no-preference) {
  .nav-link-underline::after,
  .nav-link-background::before {
    transition-delay: 0.1s;
  }
}
</style>
