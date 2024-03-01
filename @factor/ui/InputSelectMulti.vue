<script lang="ts" setup>
import { normalizeList, onResetUi, resetUi, vue } from '@factor/api'
import type { ListItem } from '@factor/api/types'

const props = defineProps({
  modelValue: {
    type: [Array, String],
    default: () => [],
  },
  list: { type: Array as vue.PropType<ListItem[]>, default: () => {} },
})

const emit = defineEmits(['update:modelValue'])
const active = vue.ref(false)
const hovered = vue.ref(-1)

const li = vue.computed(() => {
  return normalizeList(props.list ?? ['no items']).filter(
    _ => _.value || _.format,
  )
})

const val = vue.computed<(string | number)[]>(() => {
  return typeof props.modelValue === 'string'
    ? props.modelValue.split(',').map(_ => _.trim())
    : (props.modelValue as string[])
})

const selected = vue.computed<(string | number)[]>({
  get: () => {
    return val.value ?? []
  },
  set: (v) => {
    emit('update:modelValue', v)
  },
})

function removeValue(value: string | number): void {
  const index = selected.value.indexOf(value)
  if (index > -1) {
    selected.value.splice(index, 1)
    selected.value = [...selected.value]
  }
}
async function selectValue(item: ListItem & { route?: string }): Promise<void> {
  if (item.disabled)
    return
  const val = item.value ?? ''
  if (selected.value.includes(val))
    removeValue(val)
  else
    selected.value = [...selected.value, val]
}

function getItemName(val: string | number): string | number | undefined {
  return li.value.find(_ => _.value === val)?.name || val
}

function isSelected(value?: string | number): boolean {
  return value ? selected.value.includes(value) : false
}

function reset(): void {
  hovered.value = -1
  resetUi()
}

function listItemClass(item: ListItem, i: number): string {
  const out = []
  const val = item.value ?? ''

  if (item.disabled) {
    out.push('text-theme-300')
  }
  else {
    if (hovered.value === i)
      out.push('bg-theme-100 text-theme-800')
    else if (isSelected(val))
      out.push('bg-theme-0 text-theme-500')
    else
      out.push('text-theme-900')

    out.push('cursor-pointer hover:text-theme-800 hover:bg-theme-50')
  }

  return out.join(' ')
}

/**
 * Select by index in list
 */
async function selectByIndex(index: number): Promise<void> {
  const v = li.value[index]
  if (v)
    await selectValue(v)
}
/**
 * Close on all global resets
 */
onResetUi(() => (active.value = false))
/**
 * Toggle dropdown visibility
 */
function toggle(): void {
  reset()
  if (!active.value)
    active.value = true
}

const buttonClasses = [
  'group',
  'relative',
  'w-full',
  'cursor-pointer',
  'rounded-input',
  'border',
  'border-theme-300',
  'py-input-y',
  'pl-input-x',
  'pr-10',
  'text-left',
  'text-input-size',
  'bg-theme-50',
  'text-theme-700',
  'hover:border-theme-300',
  'focus:border-theme-400',
  'focus:outline-none',
  'focus:ring-4',
  'focus:ring-theme-50',
  'focus:ring-offset-2',
]
</script>

<template>
  <label
    class="max-w-input-lg block"
    @click.stop
    @keyup.stop
    @keydown.stop
  >
    <div
      class="text-theme-800 relative"
      @keydown.down.prevent="
        hovered = hovered === li.length - 1 ? 0 : hovered + 1
      "
      @keydown.up.prevent="hovered = hovered ? hovered - 1 : 0"
      @keydown.enter.prevent="!active ? toggle() : selectByIndex(hovered)"
    >
      <div :class="buttonClasses" @click.prevent="toggle()">
        <span class="flex w-full flex-wrap items-center">
          <span v-if="selected.length === 0" class="truncate">Select</span>
          <div
            v-for="(v, i) in selected"
            v-else
            :key="i"
            class="border-theme-300 bg-theme-200 text-theme-600 my-1 mr-2 inline-flex select-none justify-center overflow-hidden rounded-md border text-[.8em]"
            @click.stop
          >
            <div
              class="px-input-x py-input-y max-w-full flex-initial font-medium leading-none"
            >
              {{ getItemName(v) }}
            </div>
            <div
              class="text-theme-400 border-theme-200 hover:bg-theme-100 flex cursor-pointer flex-col justify-center border-l px-1"
              @click.stop.prevent="removeValue(v)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-[1em] w-[1em]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line
                  x1="18"
                  y1="6"
                  x2="6"
                  y2="18"
                />
                <line
                  x1="6"
                  y1="6"
                  x2="18"
                  y2="18"
                />
              </svg>
            </div>
          </div>
          <span
            class="group-hover:text-theme-300 pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
            :class="active ? 'text-theme-300' : 'text-theme-500'"
          >
            <svg
              class="h-5 w-5"
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
          class="absolute top-full z-50 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black/10"
        >
          <ul
            role="listbox"
            aria-labelledby="listbox-label"
            class="max-h-60 overflow-auto rounded-md shadow focus:outline-none"
          >
            <template v-for="(item, i) of li" :key="i">
              <li v-if="item.format === 'divider'">
                <div class="border-theme-300 w-full border-t" />
              </li>
              <li
                v-else-if="item.format === 'title'"
                class="text-theme-300 mb-2 mt-4"
              >
                <div class="px-4 text-xs font-semibold uppercase">
                  {{ item.name }}
                </div>
              </li>
              <li
                v-else
                :id="`listbox-item-${i}`"
                :key="i"
                role="option"
                :class="listItemClass(item, i)"
                class="py-input-y px-input-x text-input-size group relative select-none"
                @click.prevent="selectValue(item)"
                @mouseover="hovered = i"
                @mouseleave="hovered = -1"
              >
                <div class="flex items-center">
                  <span class="truncate">{{ item.name }}</span>
                  <span v-if="item.desc" class="ml-2 truncate opacity-60">{{
                    item.desc
                  }}</span>
                  <span
                    v-if="isSelected(item.value)"
                    class="absolute inset-y-0 right-0 flex items-center pr-2"
                    :class="
                      hovered > -1 && hovered !== i
                        ? 'text-primary group-hover:text-primary-500'
                        : ''
                    "
                  >
                    <!-- Heroicon name: check -->
                    <div class="text-primary rounded-full p-0.5">
                      <svg
                        class="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </span>
                </div>
              </li>
            </template>
          </ul>
        </div>
      </transition>
    </div>
  </label>
</template>

<style scoped lang="less">
.top-100-plus-10 {
  top: calc(100% + 10px);
}
</style>
