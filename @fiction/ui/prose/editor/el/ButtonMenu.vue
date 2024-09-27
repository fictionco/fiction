<script setup lang="ts">
import { type NavItem, onResetUi, vue } from '@fiction/core'

defineProps({
  items: { type: Array as vue.PropType<NavItem[]>, required: true },
})

const groupClass = 'bg-theme-0 text-theme-900 dark:bg-theme-800 dark:text-theme-0 overflow-hidden'
const ringClass = 'ring-1 ring-theme-300 dark:ring-theme-600 ring-inset'
const hoverClass = 'hover:bg-theme-50 hover:dark:bg-theme-700'
const btnClass = `relative inline-flex items-center px-3 py-2 text-sm font-semibold focus:z-10 cursor-pointer`

const activeSubMenu = vue.ref<string>()
onResetUi(() => {
  activeSubMenu.value = undefined
})

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

const attrs = vue.useAttrs()
const passProps = vue.computed(() => {
  const { class: _, ...rest } = attrs
  return rest
})
</script>

<template>
  <div class="flex" @click.stop>
    <div
      v-for="(item, i) in items"
      :key="i"
      class="relative"
    >
      <div
        class="whitespace-nowrap "
        :class="getItemClass({ item, i, items })"
        :title="item.name"
        @click.prevent="item.onClick ? item.onClick({ event: $event, item }) : ''"
      >
        <span class="text-lg" :class="item.icon" />
        <span v-if="item.items" class="text-lg i-tabler-chevron-down" />
      </div>

      <div
        v-if="item.items"
        v-show="item.isActive"
        class="absolute z-10 mt-2 transform px-2  sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2"
      >
        <div class=" overflow-hidden ">
          <div class="relative inline-flex ">
            <template v-for="(subItem, ii) in item.items" :key="ii">
              <component
                :is="subItem.figure.el"
                v-if="subItem.figure?.el"
                v-bind="{ ...passProps, ...subItem.figure?.props }"
                :class="getItemClass({ item: subItem, i: ii, items: item.items, noHover: true })"
                :item="subItem"
                :parent="item"
              />
              <div
                v-else
                :class="getItemClass({ item: subItem, i: ii, items: item.items })"
                @click.prevent="subItem.onClick ? subItem.onClick({ event: $event, item }) : ''"
              >
                <span class="text-base" :class="subItem.icon" :title="item.name" />
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
