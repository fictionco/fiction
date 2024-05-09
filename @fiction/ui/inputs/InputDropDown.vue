<script lang="ts" setup>
import type { ListItem, MenuGroup } from '@fiction/core'
import { normalizeList, onResetUi, resetUi, vue } from '@fiction/core'
import { getButtonClasses } from '../utils'
import type { UiElementFormat, UiElementSize, UiElementStyle } from '../utils'

const props = defineProps({
  modelValue: { type: String, default: undefined },
  list: { type: Array as vue.PropType<(ListItem | string | undefined)[]>, default: () => [] },
  menu: { type: Object as vue.PropType<MenuGroup[]>, default: undefined },
  defaultText: { type: String, default: 'Select' },
  direction: { type: String as vue.PropType<'up' | 'down'>, default: 'down' },
  justify: { type: String as vue.PropType<'left' | 'right'>, default: 'left' },
  disabled: { type: Boolean, default: false },
  format: { type: String as vue.PropType<UiElementFormat>, default: 'inline' },
  btn: { type: String as vue.PropType<UiElementStyle >, default: '' },
  size: { type: String as vue.PropType<UiElementSize>, default: '' },
})
const emit = defineEmits<{
  (event: 'update:modelValue', payload: string | number | undefined): void
}>()
const menuVis = vue.ref(false)
onResetUi(() => (menuVis.value = false))

const menuList = vue.computed(() => {
  return props.menu?.flatMap((group) => {
    return (group.menu) ? [{ value: 'title', name: group.groupName }, ...group.menu.map(item => ({ name: item.name, value: item.route?.value || item.url }))] as ListItem[] : []
  }) || []
})

const normalizedList = vue.computed(() => {
  return normalizeList([...props.list, ...menuList.value])
})

const selected = vue.computed(() => normalizedList.value.find(item => item.value === props.modelValue))

async function update(value?: string | number) {
  emit('update:modelValue', value)
  menuVis.value = false
}

function toggleVis() {
  resetUi({ scope: 'inputs', cause: 'dropdown' })
  menuVis.value = !menuVis.value
}

const buttonClasses = vue.computed(() => {
  return getButtonClasses({ size: props.size, btn: props.btn, format: props.format, isDisabled: props.disabled, useShadow: false })
})
</script>

<template>
  <div class="text-input-size relative inline-block text-left">
    <div>
      <div
        :class="[buttonClasses, menuVis ? 'opacity-70' : '']"
        @click.stop="toggleVis()"
      >
        <div class="flex w-full min-w-0 items-center whitespace-nowrap">
          {{ selected?.name || defaultText || "Select" }}
        </div>

        <svg
          class="ml-[.25em] mr-[-.35em] h-[1em] w-[1em] transition-all"
          :class="menuVis ? `rotate-180  ` : ` `"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>

    <div
      v-if="menuVis"
      class="bg-theme-0 ring-theme-300 absolute z-30 mt-2 w-[13em] origin-top-right rounded-md shadow-md ring-1 focus:outline-none"
      :class="[
        direction === 'up' ? 'bottom-full mb-2' : 'mt-2',
        justify === 'right' ? 'right-0' : 'left-0',
      ]"
    >
      <div class="py-1" role="none">
        <template v-for="(item, i) in normalizedList" :key="i">
          <div v-if="item.value === 'divider'" class="">
            <div class="border-theme-200 w-full border-t" />
          </div>
          <div v-else-if="item.value === 'title'" class="">
            <div
              class="text-theme-400 my-2 mb-1 px-4 text-xs font-bold uppercase"
            >
              {{ item.name }}
            </div>
          </div>
          <div
            v-else
            class="text-theme-700 hover:bg-theme-50 text-input-size block cursor-pointer px-[.8em] py-[.35em] hover:font-semibold"
            :class="item.selected ? 'bg-theme-50' : ''"
            @click="update(item.value)"
          >
            {{ item.name }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
