<script lang="ts" setup>
import type { ListItem } from '@fiction/core'
import { normalizeList, onResetUi, resetUi, vue } from '@fiction/core'
import type { RouteLocationRaw } from 'vue-router'
import { twMerge } from 'tailwind-merge'

type RouteListItem = ListItem & { route?: RouteLocationRaw }

const props = defineProps({
  modelValue: { type: [Number, String, Boolean], default: '' },
  list: {
    type: Array as vue.PropType<
      (RouteListItem | string)[] | readonly (RouteListItem | string)[]
    >,
    default: () => [],
  },
  defaultValue: { type: [Number, String, Boolean], default: '' },
  defaultText: { type: String, default: '' },
  zeroText: { type: String, default: 'No items.' },
  listSuffix: { type: String, default: '' },
  classButton: { type: String, default: '' },
  classOption: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  inputClass: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])
const active = vue.ref(false)
const hovered = vue.ref(-1)

if (!props.modelValue && props.defaultValue) {
  emit('update:modelValue', props.defaultValue)
}
else if (!props.modelValue) {
  // handle isDefault value in list
  const defaultValue = props.list.find(
    i => typeof i === 'object' && i.isDefault,
  ) as RouteListItem | undefined
  if (defaultValue)
    emit('update:modelValue', defaultValue.value)
}

const li = vue.computed(() => normalizeList(props.list ?? []))

const selectedItem = vue.computed<ListItem | undefined>(() => {
  let f = li.value.find(l => l.value === props.modelValue)
  // If can't find value and default prop is set, use that
  if (!f && props.defaultValue)
    f = li.value.find(l => l.value === props.defaultValue)

  return f
})

const selectedIndex = vue.computed<number>(() => {
  return li.value.findIndex(_ => _.value === props.modelValue)
})

function reset(): void {
  hovered.value = -1
}

/**
 * Handle click of a drop down value
 */
async function selectValue(item: RouteListItem): Promise<void> {
  active.value = false

  emit('update:modelValue', item.value)
  reset()
}
/**
 * Select by index in list
 */
async function selectByIndex(index: number): Promise<void> {
  const item = li.value[index]
  if (item)
    await selectValue(item)
}
/**
 * Close on all global resets
 */
onResetUi(() => (active.value = false))
/**
 * Toggle dropdown visibility
 */
function toggle(): void {
  if (props.disabled)
    return

  if (active.value) {
    reset()
  }
  else {
    resetUi({ scope: 'inputs', cause: 'startDropdown' })
    hovered.value = selectedIndex.value
    active.value = true
  }
}

function isSelected(value?: string | number): boolean {
  return !!(value && props.modelValue === value)
}

function listItemClass(item: ListItem, i: number): string {
  const out: string[] = []

  if (item.disabled) {
    out.push('opacity-60 cursor-not-allowed')
  }
  else {
    if (
      (isSelected(item.value) && hovered.value === -1)
      || hovered.value === i
    )
      out.push('bg-theme-100/50 dark:bg-theme-500/50 text-theme-900 dark:text-theme-0')
    else if (isSelected(item.value))
      out.push('bg-theme-50 dark:bg-theme-900')
    else
      out.push('font-normal cursor-pointer  hover:text-theme-900 dark:hover:text-theme-50 hover:bg-theme-100/30 dark:hover:bg-theme-600/50')
  }

  return out.join(' ')
}

const buttonClasses = twMerge([
  'select-none',
  'group',
  'relative',
  'w-full',
  'cursor-pointer',
  'rounded-input',
  'border',
  'border-theme-200',
  'dark:border-theme-500',
  'py-1.5',
  'px-3',
  'shadow-sm',
  'text-left',
  'focus:outline-none',
  'bg-theme-50',
  'dark:bg-theme-700',
  props.inputClass,
])
</script>

<template>
  <div
    class="max-w-input font-mono"
    @click.stop
    @keyup.stop
    @keydown.stop
  >
    <div
      class="text-theme-700 dark:text-theme-0 relative"
      @keydown.down.prevent="
        hovered = hovered === li.length - 1 ? 0 : hovered + 1
      "
      @keydown.up.prevent="hovered = hovered ? hovered - 1 : 0"
      @keydown.enter.prevent="!active ? toggle() : selectByIndex(hovered)"
    >
      <div
        :class="[
          buttonClasses,
          disabled ? 'opacity-80' : 'hover:border-input-edge',
          classButton,
          disabled
            ? 'cursor-not-allowed'
            : 'focus:ring-input-primary focus:border-input-primary focus:ring-1',
        ]"
        class="space-between flex items-center space-x-3"
        @click="toggle()"
      >
        <div class="w-full grow items-baseline truncate">
          <div class="truncate font-medium">
            {{ selectedItem?.name || defaultValue || defaultText || "Select" }}
          </div>
        </div>
        <slot
          v-if="$slots.avatar"
          name="avatar"
          :item="selectedItem"
        />
        <span
          class="text-theme-300 dark:text-theme-0 group-hover:text-theme-400 dark:group-hover:text-theme-50 pointer-events-none flex items-center"
          :class="active ? 'text-theme-500' : ''"
        >
          <svg
            class="-mr-1 h-[1.4em] w-[1.4em]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
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
        <div
          v-if="active"
          class="bg-theme-0 dark:bg-theme-700 ring-theme-200 dark:ring-theme-600 absolute z-50 mt-1 w-full rounded-md shadow-xl ring-1"
        >
          <ul
            role="listbox"
            aria-labelledby="listbox-label"
            :aria-activedescendant="`listbox-item-${selectedIndex}`"
            class="max-h-72 overflow-auto rounded-md shadow focus:outline-none p-2"
          >
            <div v-if="!li || li.length === 0" class="p-4">
              {{ zeroText }}
            </div>
            <template
              v-for="(item, i) of li"
              v-else
              :key="i"
            >
              <li
                v-if="item.format === 'divider' || item.value === 'divider'"
                class=""
              >
                <div class="border-input-edge w-full border-t" />
              </li>
              <li
                v-else-if="item.format === 'title'"
                class="py-input-y px-input-x  mt-[.5em]"
              >
                <div class="text-theme-300 dark:text-theme-0 text-[.8em] ">
                  {{ item.name }}
                </div>
              </li>
              <li
                v-else
                :id="`listbox-item-${i}`"
                role="option"
                :class="listItemClass(item, i)"
                class="py-2 pl-3 pr-1 group relative cursor-pointer select-none rounded-md mb-0.5"
                @click="selectValue(item)"
              >
                <div
                  class="flex items-center justify-between space-x-1"
                  :class="classOption"
                >
                  <div class="min-w-0 grow">
                    <div
                      class="shrink-0  font-medium"
                      :class="item.desc ? '' : 'w-full'"
                    >
                      {{ item.name }}
                    </div>
                    <div
                      v-if="item.desc"
                      class=" text-[.9em] opacity-80"
                    >
                      {{ item.desc }}
                    </div>
                  </div>
                  <slot
                    v-if="$slots.avatar"
                    name="avatar"
                    :item="item"
                  />
                  <span
                    v-else-if="isSelected(item.value)"
                    class="flex items-center pr-2"
                    :class="
                      hovered !== i
                        ? ' group-hover:text-white'
                        : ''
                    "
                  >
                    <div class="i-carbon-checkmark text-base" />
                  </span>
                </div>
              </li>
            </template>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>
