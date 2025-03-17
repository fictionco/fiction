<script setup lang="ts">
import type { NavListItem } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import type { UserConfig } from './config'
import CardNavLink from '@fiction/cards/CardNavLink.vue'
import { useService, vue } from '@fiction/core'
import TransitionSlide from '@fiction/ui/anim/TransitionSlide.vue'
import { getColorThemeStyles } from '@fiction/ui/utils'

const props = defineProps({
  nav: { type: Array as vue.PropType<NavListItem[]>, required: true },
  itemClass: { type: String, default: '' },
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
  activeItem: { type: Object, required: false },
})

const emit = defineEmits<{
  (event: 'update:activeItem', payload: NavListItem | undefined): void
}>()

const { fictionRouter } = useService()

const processedNav = vue.computed(() =>
  (props.nav || []).map(item => ({
    ...item,
    isActive: item.href === fictionRouter.current.value.path,
  })),
)

function setActiveHover(item?: NavListItem) {
  emit('update:activeItem', item)
}

function closeMenu() {
  emit('update:activeItem', undefined)
}

function isDropdownActive(item: NavListItem) {
  const activeItem = props.activeItem
  // Check for regular dropdown vs mega menu
  return activeItem?.id === item.id && (!item.list?.variant || item.list?.variant === 'default')
}

function getHighlightStyle(item: NavListItem) {
  if (!item.theme) {
    return {
      text: 'text-primary-500 dark:text-primary-400',
    }
  }

  const style = getColorThemeStyles(item.theme || 'primary')

  return {
    text: style?.text,
  }
}
</script>

<template>
  <div>
    <div
      v-for="(item, i) in processedNav"
      :key="i"
      class="group relative"
      @mouseover="setActiveHover(item)"
      @mouseleave="setActiveHover(undefined)"
    >
      <CardNavLink
        :card
        :item
        :class="[
          itemClass,
          item.emphasis === 'highlighted' ? getHighlightStyle(item).text : '',
        ]"
        :depth="0"
        hover-effect="underline"
        @click="closeMenu()"
      />

      <!-- Standard Dropdown -->
      <TransitionSlide>
        <div
          v-if="(isDropdownActive(item) && item.list?.items?.length)"
          class="max-h-[80vh] z-40 font-sans absolute top-[calc(100%+.5rem)] dropdown block group-hover:block bg-theme-0 dark:bg-theme-800 border shadow border-theme-200  dark:border-theme-600/90 rounded-lg w-56 space-y-1 left-1/2 -translate-x-1/2"
        >
          <div class="py-1">
            <template
              v-for="(subItem, ii) in item.list?.items"
              :key="ii"
            >
              <div :class="subItem.variant === 'button' ? 'p-2 flex justify-center' : ''">
                <CardNavLink
                  :card
                  :item="subItem"
                  class="block px-4 py-2 font-normal"
                  :class="[

                    subItem.href || subItem.onClick ? 'cursor-pointer hover:bg-theme-100/50 dark:hover:bg-theme-700' : 'cursor-default',
                  ]"
                  data-menu-level="1"
                  @click="closeMenu()"
                />
              </div>

              <div
                v-if="subItem.list?.items?.length"
              >
                <template
                  v-for="(subSubItem, iii) in subItem.list.items"
                  :key="iii"
                >
                  <CardNavLink
                    :card
                    :item="subSubItem"
                    class="block pl-7 py-1 text-sm hover:bg-theme-100/50 dark:hover:bg-theme-700 font-normal"
                    data-menu-level="2"
                    @click="closeMenu()"
                  />
                </template>
              </div>
            </template>
          </div>
        </div>
      </TransitionSlide>
    </div>
  </div>
</template>
