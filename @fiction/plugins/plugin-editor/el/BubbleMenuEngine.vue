<script setup lang="ts">
import { BubbleMenu } from '@tiptap/vue-3'
import type { Editor } from '@tiptap/core'
import type { NavItem } from '@fiction/core'
import { vue } from '@fiction/core'
import type { MenuType } from './menu'
import { BubbleMenuTools } from './menu'

const props = defineProps({
  editor: { type: Object as vue.PropType<Editor>, required: true },
  menuType: { type: String as vue.PropType<MenuType>, default: undefined },

})

const menuTools = new BubbleMenuTools({ editor: props.editor })

const groupClass = 'bg-theme-0 text-theme-900 dark:bg-theme-800 dark:text-theme-0 overflow-hidden'
const ringClass = 'ring-1 ring-theme-300 dark:ring-theme-600 ring-inset'
const hoverClass = 'hover:bg-theme-50 hover:dark:bg-theme-700'
const btnClass = `relative inline-flex items-center px-3 py-2 text-sm font-semibold focus:z-10`

function getItemClass(args: { item: NavItem, i: number, items: NavItem[], noHover?: boolean }) {
  const { item, i, items = [], noHover = false } = args
  return [
    groupClass,
    btnClass,
    ringClass,
    noHover ? '' : hoverClass,
    i !== 0 ? '-ml-px' : 'rounded-l-md',
    i === items.length - 1 ? 'rounded-r-md' : '',
    item.isActive ? 'bg-theme-200 dark:bg-theme-700' : '',
  ]
}

const items = vue.computed(() => menuTools.activeMenu.value)
</script>

<template>
  <BubbleMenu

    :editor="editor"
    :tippy-options="{ duration: 100 }"
    class="isolate inline-flex rounded-md shadow-sm"
    @click.stop
  >
    <div
      v-for="(item, i) in items"
      :key="i"
      class="relative"
    >
      <button

        type="button"
        :class="getItemClass({ item, i, items })"
        @click="item.onClick ? item.onClick({ event: $event, item }) : ''"
      >
        <span class="text-lg" :class="item.icon" :title="item.name" />
        <span v-if="item.items" class="text-lg i-tabler-chevron-down" />
      </button>

      <div
        v-if="item.items"
        v-show="item.isActive"
        class="absolute z-10 mt-2 transform px-2  sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2"
      >
        <div class="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden ">
          <div class="relative inline-flex ">
            <template v-for="(subItem, ii) in item.items" :key="ii">
              <component
                :is="subItem.figure.el"
                v-if="subItem.figure?.el"
                v-bind="subItem.figure?.props || {}"
                :class="getItemClass({ item: subItem, i: ii, items: item.items, noHover: true })"
                :item="subItem"
                :parent="item"
                :editor="editor"
              />
              <button
                v-else
                type="button"
                :class="getItemClass({ item: subItem, i: ii, items: item.items })"
                @click="subItem.onClick ? subItem.onClick({ event: $event, item }) : ''"
              >
                <span class="text-base" :class="subItem.icon" :title="item.name" />
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </BubbleMenu>
</template>
