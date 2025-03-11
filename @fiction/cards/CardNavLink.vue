<script lang="ts" setup>
import type { NavListItem } from '@fiction/core'
import type { Card } from '@fiction/site'
import { useService, vue } from '@fiction/core'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import XIcon from '@fiction/ui/media/XIcon.vue'
import CardButton from './CardButton.vue'
import CardText from './CardText.vue'
import CardLink from './el/CardLink.vue'

defineOptions({
  name: 'CardNavLink',
})

const props = defineProps({
  item: { type: Object as vue.PropType<NavListItem>, required: true },
  depth: { type: Number, default: -1 },
  card: { type: Object as vue.PropType<Card>, required: true },
  path: { type: String, default: undefined },
  hoverEffect: { type: String as vue.PropType<'underline'>, default: undefined },
  animate: { type: String as vue.PropType<'rise' | 'fade'>, default: undefined },
})

// type NavLinkItem = {
//   itemStyle?: 'button' | 'user' | 'default'
//   itemTheme?: ColorThemeUser
//   subStyle?: 'mega' | 'default'
// } & NavItem

const service = useService()

const styles = vue.computed(() => {
  const item = props.item
  const isButton = item.variant === 'button'
  const componentType = isButton ? CardButton : CardLink
  const hoverEffect = isButton ? undefined : props.hoverEffect
  const theme = item.theme || 'default'

  return { componentType, hoverEffect, theme }
})

const hoverClass = 'group-hover/nav-link:text-theme-500 dark:group-hover/nav-link:text-theme-200 transition-colors duration-300'
</script>

<template>
  <component
    :is="styles.componentType"
    :card="card"
    :theme="styles.theme"
    :design="item.design"
    :href="item.href"
    :target="item.target ? item.target : '_self'"
    class="group/nav-link"
    :class="!item.href ? 'cursor-default' : 'cursor-pointer'"
    :data-el-type="styles.componentType"
  >
    <span class="inline-flex items-center space-x-1.5 relative w-full">
      <!-- User Avatar -->
      <ElAvatar
        v-if="item.variant === 'avatar' && service.fictionUser.activeUser.value"
        class="size-[1.4em] mr-1.5 rounded-full ring-2 ring-theme-200 dark:ring-theme-0"
        :email="service.fictionUser.activeUser?.value?.email"
      />

      <!-- Icon -->
      <XIcon
        v-else-if="item.icon"
        :media="item.icon"
        :class="hoverClass"
        class="size-[1.05em]"
      />

      <!-- Text Content -->
      <CardText
        v-if="item.basePath"
        :card
        :path="`${item.basePath}.label`"
        tag="span"
        class="block relative"
        :class="[
          hoverClass,
          styles.hoverEffect === 'underline' && (card.link(item.href) || item.onClick)
            ? 'nav-link-underline'
            : '',
          item.isActive ? 'is-active' : '',
        ]"
        :animate
      />
      <span
        v-else-if="$slots.default"
        class="block"
      >
        <slot />
      </span>
      <span
        v-else
        class="block"
        v-html="item.label"
      />

      <XIcon
        v-if="item.iconAfter"
        :media="item.iconAfter"
        :class="hoverClass"
        class="size-[1.05em]"
      />
      <span
        v-else-if="item.target === '_blank'"
        class="block opacity-30 group-hover:translate-x-[1px] group-hover:-translate-y-[1px] transition-all"
      >
        <span class="block i-heroicons-arrow-up-right-20-solid" />
      </span>

      <!-- Dropdown Indicator -->
      <span
        v-else-if="item.list?.items?.length && depth === 0"
        class="block opacity-30 group-hover:opacity-60 transition-all i-tabler-chevron-down"
      />
    </span>
  </component>
</template>

<style lang="less">
.nav-link-underline {
  &::after {
    content: '';
    position: absolute;
    bottom: -0.2em;
    left: 0;
    right: 0;
    height: 2px;
    border-radius: 5px;
    background-color: currentColor;
    transform: scaleX(0);
    transform-origin: right center;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  // Hover: animate in from right
  &:hover::after {
    transform: scaleX(1) scaleY(1.2);
    transform-origin: left center;
    height: 2px;
  }

  // Exit: animate out to left
  &:not(:hover)::after {
    transform: scaleX(0) scaleY(0);
    transform-origin: right center;
    height: 2px;
  }

  // Active state
  &.is-active::after {
    transform: scaleX(1);
  }
}

// Prevent transition flash on page load
@media (prefers-reduced-motion: no-preference) {
  .nav-link-underline::after {
    transition-delay: 0.1s;
  }
}
</style>
