<script lang="ts" setup>
import type { ListItem } from '@fiction/core'
import { debounce, normalizeList, onResetUi, resetUi, vue } from '@fiction/core'
import type { RouteLocationRaw } from 'vue-router'
import { selectInputClasses } from './theme'

type RouteListItem = ListItem & { route?: RouteLocationRaw }

const props = defineProps({
  modelValue: { type: [Number, String, Boolean], default: '' },
  list: { type: Array as vue.PropType<(RouteListItem | string)[] | readonly (RouteListItem | string)[]>, default: () => [] },
  defaultValue: { type: [Number, String, Boolean], default: '' },
  defaultText: { type: String, default: '' },
  zeroText: { type: String, default: 'No items.' },
  listSuffix: { type: String, default: '' },
  classOption: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  inputClass: { type: String, default: '' },
  fetchList: { type: Function as vue.PropType<(search: string) => Promise<ListItem[]>>, default: undefined },
})
const emit = defineEmits(['update:modelValue'])
const active = vue.ref(false)
const hovered = vue.ref(-1)
const searchText = vue.ref<string | undefined>()
const loading = vue.ref(false)

if (!props.modelValue && props.defaultValue) {
  emit('update:modelValue', props.defaultValue)
}
else if (!props.modelValue) {
  // handle isDefault value in list
  const defaultValue = props.list.find(i => typeof i === 'object' && i.isDefault) as RouteListItem | undefined
  if (defaultValue)
    emit('update:modelValue', defaultValue.value)
}

const isFocused = vue.ref(false)
const dynamic = vue.ref<ListItem[]>([])

function setInactive() {
  searchText.value = undefined
  active.value = false
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
const themeClasses = selectInputClasses({ inputClass: props.inputClass })
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

const searchCache = new Map<string, ListItem[]>()
async function loadData(search: string) {
  if (!props.fetchList)
    return

  if (searchCache.has(search)) {
    dynamic.value = searchCache.get(search) ?? []
    return
  }

  loading.value = true
  try {
    dynamic.value = await props.fetchList(search)

    if (search)
      searchCache.set(search, dynamic.value)
  }
  catch (error) {
    console.error('Error fetching data:', error)
  }
  finally {
    loading.value = false
  }
}

const renderList = vue.computed(() => {
  // Normalize the search text by converting to lower case and removing all whitespace
  const search = searchText.value?.toLowerCase().replace(/\s+/g, '')

  const list = normalizeList([...props.list, ...dynamic.value])

  return !search || !isFocused.value
    ? list
    : list.filter((item) => {
      // Construct a single string from name, description, and value, also normalized
      const searchString = `${item.name?.toLowerCase() || ''} ${item.desc?.toLowerCase() || ''} ${item.value}`
        .replace(/\s+/g, '') // Remove all whitespace for robust matching

      return searchString.includes(search)
    })
})

const defaultItem = vue.computed(() => renderList.value.find(item => item.value === props.defaultValue))
const selectedItem = vue.computed<ListItem | undefined>(() => renderList.value.find(item => item.value === props.modelValue) || defaultItem.value)
const selectedIndex = vue.computed<number>(() => renderList.value.findIndex(_ => _.value === props.modelValue))

function toggle(): void {
  if (props.disabled)
    return

  resetUi({ scope: 'inputs', cause: 'startDropdown' })
  hovered.value = selectedIndex.value
  active.value = true
}

async function selectByIndex(index: number): Promise<void> {
  const item = renderList.value[index]
  if (item)
    await selectValue(item)
}

vue.watch(() => [searchText.value, isFocused.value], () => {
  if (isFocused.value)
    debounce(loadData, 150)()
  // else
  //   searchText.value = ''
})
</script>

<template>
  <div @keydown.stop @click.stop>
    <div
      :class="themeClasses.wrapClass"
    >
      <div
        class="relative"
        tabindex="-1"
        @click="toggle()"
        @keydown.down.prevent="hovered = hovered === renderList.length - 1 ? 0 : hovered + 1"
        @keydown.up.prevent="hovered = hovered ? hovered - 1 : 0"
        @keydown.enter.prevent="!active ? toggle() : selectByIndex(hovered)"
        @keydown.esc.prevent="setInactive()"
      >
        <input
          type="text"
          :class="[themeClasses.buttonClasses.always, disabled ? themeClasses.buttonClasses.disabled : themeClasses.buttonClasses.regular]"

          :value="searchText ?? selectedItem?.name"
          :placeholder="String(defaultValue) || defaultText || 'Select'"
          :readonly="!props.fetchList"
          @input="searchText = ($event.target as HTMLInputElement)?.value"
          @focus="isFocused = true"
          @blur="isFocused = false"
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
        <div v-if="active" :class="themeClasses.dropdownClasses">
          <ul
            role="listbox"
            aria-labelledby="listbox-label"
            :aria-activedescendant="`listbox-item-${selectedIndex}`"
            class="focus:outline-none p-2"
          >
            <div v-if="!renderList || renderList.length === 0" class="p-2 text-center text-theme-300 dark:text-theme-600 text-sm">
              <template v-if="loading">
                <div class="i-svg-spinners-3-dots-bounce text-2xl" />
              </template>
              <template v-else>
                {{ zeroText }}
              </template>
            </div>
            <template v-for="(item, i) of renderList" v-else :key="i">
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
