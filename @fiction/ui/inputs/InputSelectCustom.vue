<script lang="ts" setup>
import type { ListItem, StandardSize } from '@fiction/core'
import type { RouteLocationRaw } from 'vue-router'
import { normalizeList, onResetUi, resetUi, shortId, vue } from '@fiction/core'
import { selectInputClasses } from './theme'

type RouteListItem = ListItem & { route?: RouteLocationRaw }

const props = defineProps({
  modelValue: { type: [Number, String, Boolean], default: undefined },
  list: { type: Array as vue.PropType<(RouteListItem | string)[] | readonly (RouteListItem | string)[]>, default: () => [] },
  loading: { type: Boolean, default: false },
  search: { type: String, default: undefined },
  allowSearch: { type: Boolean, default: false },
  defaultValue: { type: [Number, String, Boolean], default: '' },
  defaultText: { type: String, default: undefined },
  zeroText: { type: String, default: 'No items.' },
  listSuffix: { type: String, default: undefined },
  classOption: { type: String, default: undefined },
  disabled: { type: Boolean, default: false },
  inputClass: { type: String, default: undefined },
  uiSize: { type: String as vue.PropType<StandardSize>, default: 'md' },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: number | string | boolean | undefined): void
  (event: 'update:search', payload: string | undefined): void
  (event: 'update:focused', payload: boolean): void
}>()

const randomId = shortId()

const active = vue.ref(false)
const hovered = vue.ref(-1)

if (!props.modelValue && props.defaultValue) {
  emit('update:modelValue', props.defaultValue)
}
else if (!props.modelValue) {
  // handle isDefault value in list
  const defaultValue = props.list.find(i => typeof i === 'object' && i.isDefault) as RouteListItem | undefined
  if (defaultValue)
    emit('update:modelValue', defaultValue.value)
}

const li = vue.computed(() => normalizeList(props.list))

function setInactive() {
  setSearchTextValue(undefined)
  active.value = false
}

function setSearchTextValue(value?: string): void {
  emit('update:search', value)
}

function setFocused(value: boolean): void {
  emit('update:focused', value)
}

async function selectValue(item: RouteListItem): Promise<void> {
  setInactive()
  emit('update:modelValue', item.value)
  hovered.value = -1
}

onResetUi(() => {
  active.value = false
})

function isSelected(value?: string | number): boolean {
  return !!(value && props.modelValue === value)
}
const themeClasses = selectInputClasses({ uiSize: props.uiSize, inputClass: props.inputClass || '' })

function listItemClass(item: ListItem, i: number): string {
  const o = themeClasses.optionClasses
  const out: string[] = [o.always]

  if (item.disabled) {
    out.push(o.disabled)
  }
  else {
    if ((isSelected(item.value) && hovered.value === -1) || hovered.value === i)
      out.push(o.hovered)
    else if (isSelected(item.value))
      out.push(o.selected)
    else
      out.push(o.notSelected)
  }

  return out.join(' ')
}

const defaultItem = vue.computed(() => li.value.find(item => item.value === props.defaultValue))
const selectedItem = vue.computed<ListItem | undefined>(() => li.value.find(item => item.value === props.modelValue) || defaultItem.value)
const selectedIndex = vue.computed<number>(() => li.value.findIndex(_ => _.value === props.modelValue))

function scrollToSelected() {
  vue.nextTick(() => {
    const selectedElement = document.querySelector(`#${randomId} [data-value="${props.modelValue}"]`) as HTMLElement | null
    const dropdownContainer = document.querySelector(`#${randomId} .dropdown-container`) as HTMLElement | null
    if (selectedElement && dropdownContainer) {
      dropdownContainer.scrollTop = selectedElement.offsetTop - dropdownContainer.offsetTop
    }
  })
}
function toggle(): void {
  if (props.disabled)
    return

  resetUi({ scope: 'inputs', cause: 'startDropdown', trigger: 'manualReset' })
  hovered.value = selectedIndex.value
  active.value = true

  scrollToSelected()
}

async function selectByIndex(index: number): Promise<void> {
  const item = li.value[index]
  if (item)
    await selectValue(item)
}

function handleKeydown(event: KeyboardEvent) {
  if (props.disabled)
    return

  event.preventDefault()

  switch (event.key) {
    case 'ArrowDown':
      hovered.value = hovered.value === li.value.length - 1 ? 0 : hovered.value + 1
      break
    case 'ArrowUp':
      hovered.value = hovered.value ? hovered.value - 1 : li.value.length - 1
      break
    case 'Enter':
      if (!active.value)
        toggle()
      else
        selectByIndex(hovered.value)

      break
    case 'Escape':
      setInactive()
      break
  }
}
</script>

<template>
  <div :id="randomId" @keydown.stop @click.stop>
    <div :class="[themeClasses.wrapClass, inputClass]">
      <div
        class="relative"
        tabindex="-1"
        data-test-id="select-custom-dropdown-toggle"
        @click="toggle()"
        @keydown="handleKeydown($event)"
      >
        <input
          type="text"
          :class="[themeClasses.buttonClasses.always, disabled ? themeClasses.buttonClasses.disabled : themeClasses.buttonClasses.regular]"

          :value="search ?? selectedItem?.name"
          :placeholder="String(defaultValue) || defaultText || 'Select'"
          :readonly="!props.allowSearch"
          @input="setSearchTextValue(($event.target as HTMLInputElement)?.value)"
          @focus="setFocused(true)"
          @blur="setFocused(false)"
        >

        <div class="z-10 absolute right-1 top-0 h-full flex items-center px-1" :class="[themeClasses.selector.always, active ? themeClasses.selector.active : '']" @click.stop="toggle()">
          <div v-if="loading" class="i-ci-loading animate-spin text-2xl" />
          <div v-else class="i-tabler-selector text-2xl" />
        </div>
        <!-- For validation -->
        <input
          class="pointer-events-none absolute bottom-0 left-1/2 h-0 w-0 -translate-x-1/2 p-0 opacity-0"
          v-bind="$attrs"
          type="text"
          :value="modelValue"
        >
      </div>

      <transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="active" :class="themeClasses.dropdownClasses" class="dropdown-container">
          <ul
            role="listbox"
            aria-labelledby="listbox-label"
            :aria-activedescendant="`listbox-item-${selectedIndex}`"
            class="focus:outline-none p-2"
          >
            <div v-if="!li || li.length === 0" class="p-2 text-center text-theme-300 dark:text-theme-600 text-sm">
              <template v-if="loading">
                <div class="i-svg-spinners-3-dots-bounce text-2xl" />
              </template>
              <template v-else>
                {{ zeroText }}
              </template>
            </div>
            <template v-for="(item, i) of li" v-else :key="i">
              <li v-if="item.format === 'divider' || item.value === 'divider'">
                <div :class="themeClasses.optionClasses.divider" />
              </li>
              <li
                v-else-if="item.format === 'title'"
                :class="themeClasses.optionClasses.title"
              >
                {{ item.name }}
              </li>
              <li
                v-else
                :id="`listbox-item-${i}`"
                role="option"
                :class="listItemClass(item, i)"
                :data-index="i"
                :data-value="item.value"
                @click="selectValue(item)"
              >
                <div class="min-w-0 grow">
                  <div class="shrink-0  font-medium" :class="item.desc ? '' : 'w-full'">
                    {{ item.name }}
                  </div>
                  <div
                    v-if="item.desc"
                    class="text-[.9em] opacity-80"
                  >
                    {{ item.desc }}
                  </div>
                </div>
                <span
                  v-if="isSelected(item.value)"
                  class="flex items-center pr-2"
                >
                  <div class="i-carbon-checkmark text-base" />
                </span>
              </li>
            </template>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>
