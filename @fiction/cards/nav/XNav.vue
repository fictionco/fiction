<script setup lang="ts">
import { useService, vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import CardNavLink from '@fiction/cards/CardNavLink.vue'
import TransitionSlide from '@fiction/ui/anim/TransitionSlide.vue'

import type { SchemaNavItem, UserConfig } from './index.js'

const props = defineProps({
  nav: { type: Array as vue.PropType<SchemaNavItem[]>, required: true },
  itemClass: { type: String, default: '' },
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
  activeItem: { type: Object as vue.PropType<SchemaNavItem>, required: false },
})

const emit = defineEmits<{
  (event: 'update:activeItem', payload: SchemaNavItem | undefined): void
}>()

const { fictionRouter } = useService()
const nav = vue.computed(() => (props.nav || []).map(item => ({ ...item, isActive: item.href === fictionRouter.current.value.path })))

function setActiveHover(item: SchemaNavItem | undefined) {
  emit('update:activeItem', item)
}
</script>

<template>
  <div>
    <div
      v-for="(item, i) in nav"
      :key="i"
      class="group relative"
      :class="item.isHidden ? 'hidden' : ''"
      @mouseover="setActiveHover(item)"
      @mouseleave="setActiveHover(undefined)"
    >
      <CardNavLink
        :card
        :item
        :class="itemClass"
        :depth="0"
        hover-effect="underline"
      />
      <TransitionSlide>
        <div
          v-if="activeItem?.items?.length && (!activeItem.subStyle || activeItem?.subStyle === 'default') && activeItem.href === item.href"
          class="z-30 font-sans absolute top-[calc(100%+.5rem)] dropdown block group-hover:block bg-theme-0 dark:bg-theme-800 border dark:border-theme-600/90 rounded-lg w-56 space-y-1 "
          :class="i === nav.length - 1 ? 'right-0' : i === 0 ? 'left-0' : 'left-1/2 -translate-x-1/2'"
        >
          <div class="py-1">
            <template v-for="(subItem, ii) in activeItem.items" :key="ii">
              <CardNavLink :card :item="subItem" class="px-4 py-2  dark:hover:bg-theme-700 font-normal" :class="subItem.isHidden ? 'hidden' : 'block'" />

              <div v-if="subItem?.items?.length">
                <template v-for="(subSubItem, iii) in subItem.items" :key="iii">
                  <CardNavLink :card :item="subSubItem" class="pl-7 pr-4 py-1.5  dark:hover:bg-theme-700 font-normal text-[.9em]" :class="subSubItem.isHidden ? 'hidden' : 'block'" />
                </template>
              </div>
            </template>
          </div>
        </div>
      </TransitionSlide>
    </div>
  </div>
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

.menu-text:hover:after{
  transform: scaleX(1);
}

.menu-text.active:after{
  transform: scaleX(1);
}
</style>
