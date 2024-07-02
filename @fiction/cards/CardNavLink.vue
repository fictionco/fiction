<script lang="ts" setup>
import type { NavItem } from '@fiction/core'
import { getNavComponentType, useService, vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import ElButton from '@fiction/ui/ElButton.vue'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import CardText from './CardText.vue'

type NavLinkItem = {
  itemStyle?: 'buttonPrimary' | 'buttonStandard' | 'user' | 'default'
  subStyle?: 'mega' | 'default'
} & NavItem

const props = defineProps({
  item: { type: Object as vue.PropType<NavLinkItem>, required: true },
  depth: { type: Number, default: -1 },
  card: { type: Object as vue.PropType<Card>, required: true },
  path: { type: String, default: undefined },
  hoverEffect: { type: String as vue.PropType<'underline'>, default: undefined },
  animate: { type: String as vue.PropType<'rise' | 'fade'>, default: undefined },
})

const service = useService()

const styles = vue.computed(() => {
  const item = props.item

  const isButton = item.itemStyle?.includes('button')

  const componentType = isButton ? ElButton : getNavComponentType(item)
  const hoverEffect = isButton ? undefined : props.hoverEffect
  const buttonStyle = isButton ? item.itemStyle === 'buttonPrimary' ? 'primary' : 'default' : undefined

  return {
    componentType,
    hoverEffect,
    buttonStyle,
  }
})
</script>

<template>
  <component
    :is="styles.componentType"
    :btn="styles.buttonStyle"
    :href="card.link(item.href)"
    :to="card.link(item.href)"
    :target="item.target ? item.target : '_self'"
    class="group"
  >
    <span class="inline-flex items-center space-x-1 relative whitespace-nowrap">
      <ElAvatar v-if="item.itemStyle === 'user' && service.fictionUser.activeUser.value" class=" size-[1.4em] mr-1.5 rounded-full ring-2 ring-theme-200 dark:ring-theme-0" :email="service.fictionUser.activeUser?.value?.email" />

      <CardText
        v-if="item.basePath"
        :card
        :path="`${item.basePath}.name`"
        tag="span"
        class="block relative"
        :class="[
          styles.hoverEffect === 'underline' ? 'menu-text after:border-t-2 after:border-primary-500 dark:after:border-primary-400 after:rounded-lg' : '',
          item.isActive ? 'active' : '',
        ]"
        :animate
      />
      <span v-else-if="$slots.default" class="block"><slot /></span>
      <span v-else class="block" v-html="item.name" />
      <span v-if="item.target === '_blank'" class="block opacity-30 group-hover:translate-x-[1px] group-hover:-translate-y-[1px] transition-all">
        <span class="block i-heroicons-arrow-up-right-20-solid" />
      </span>
      <span v-else-if="item.items?.length && depth === 0" class="block opacity-30 group-hover:opacity-60 transition-all i-tabler-chevron-down" />

    </span>
  </component>
</template>

<style lang="less">
.menu-text:after{
  transition: transform .2s ease-out,border-color .2s ease-out;
  position: absolute;
  display: block;
  bottom: -6px;
  left: 0;
  width: 100%;
  transform: scaleX(0);
  content: "";
  padding-bottom: inherit;
}

.menu-text{
  &:hover, &.active{
    &:after{
      transform: scaleX(1);
    }

  }
}
</style>
