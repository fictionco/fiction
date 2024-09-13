<script lang="ts" setup>
import type { InputOption } from '.'
import { getNested, setNested, shortId, vue, waitFor } from '@fiction/core'
import TransitionSlide from '../anim/TransitionSlide.vue'
import XButton from '../buttons/XButton.vue'
import ElInput from './ElInput.vue'

type BasicItem = Record<string, unknown> & { _key: string }

const props = defineProps({
  modelValue: { type: Array as vue.PropType<BasicItem[]>, default: () => [] },
  options: { type: Array as vue.PropType<InputOption[]>, default: () => [] },
  depth: { type: Number, default: 0 },
  inputClass: { type: String, default: '' },
  itemName: { type: String, default: 'Item' },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: Record<string, unknown>[]): void
}>()

type KeyedItem = Record<string, unknown> & { _key: string }

const itemSelector = `[data-drag-depth="${props.depth}"]`
const dragSelector = `[data-drag-handle="${props.depth}"]`
const openItem = vue.ref(-1)
const wrapperEl = vue.ref<HTMLElement>()

const keyedModelValue = vue.computed<KeyedItem[]>(() => {
  return props.modelValue.map((item, i) => {
    item._key = item._key || shortId()
    return item
  }) as KeyedItem[]
})

function updateModelValue(val: Record<string, unknown>[]) {
  emit('update:modelValue', val)
}

function updateOrder() {
  if (!wrapperEl.value)
    return

  const val: Record<string, unknown>[] = []
  wrapperEl.value.querySelectorAll(itemSelector).forEach((el) => {
    const element = el as HTMLElement
    const value = element.dataset.dragId

    if (value) {
      const item = keyedModelValue.value.find(i => i._key === value)
      if (item)
        val.push(item)
    }
  })

  updateModelValue(val)
}

function updateInputValue(args: { index: number, key: string, value: unknown }) {
  const { index, key, value } = args

  const val = [...props.modelValue]
  val[index] = setNested({ path: key, data: val[index], value })

  updateModelValue(val)
}

function addItem() {
  const _key = shortId()
  const val = [...props.modelValue, { name: 'New Item', _key }]
  openItem.value = val.length - 1
  updateModelValue(val)
}

function removeItem(item: Record<string, unknown> & { _key: string }) {
  const confirmed = confirm('Are you sure?')
  if (!confirmed)
    return
  const val = props.modelValue.filter(i => i._key !== item._key)
  updateModelValue(val)

  openItem.value = -1
}

function toggleItem(index: number) {
  openItem.value = openItem.value === index ? -1 : index
}

vue.onMounted(async () => {
  await waitFor(200)

  if (!wrapperEl.value)
    return
  const { Plugins, Sortable } = await import('@shopify/draggable')
  const sortable = new Sortable(wrapperEl.value, {
    draggable: itemSelector,
    distance: 3,
    handle: dragSelector,
    mirror: { constrainDimensions: true },
    swapAnimation: { duration: 200, easingFunction: 'ease-in-out', horizontal: false },
    plugins: [Plugins.SwapAnimation], // Or [SwapAnimation]
  })

  sortable.on('sortable:stop', (_evt) => {
    setTimeout(() => updateOrder(), 50)
  })
})
</script>

<template>
  <div ref="wrapperEl">
    <div
      v-for="(item, i) in keyedModelValue"
      :key="i"
      class="rounded-md border border-theme-300 dark:border-theme-600 mb-2 shadow-sm bg-theme-0 dark:bg-theme-800 cursor-pointer text-theme-700 dark:text-theme-100"
      :data-drag-id="item._key"
      :data-drag-depth="depth"
    >
      <div
        class="px-1 py-1 bg-theme-50/50 dark:bg-theme-600/50 hover:bg-theme-50 text-xs font-mono  font-medium flex justify-between items-center"
        :class="openItem === i ? 'rounded-t-md border-b border-theme-200 dark:border-theme-600' : 'rounded-md'"
        :data-drag-handle="depth"
        @click="toggleItem(i)"
      >
        <div class="flex gap-1 items-center cursor-move">
          <div class="text-lg text-theme-300 dark:text-theme-500 i-tabler-grip-vertical" />
          <div class="text-theme-500 dark:text-theme-50">
            {{ itemName }} {{ i + 1 }}
          </div>
        </div>
        <div class="text-lg text-theme-300 i-tabler-chevron-down transition-all" :class="openItem === i ? 'rotate-180' : ''" />
      </div>
      <TransitionSlide>
        <div v-if="openItem === i">
          <div class="py-4 px-2 space-y-3">
            <div v-for="(opt, ii) in options" :key="ii">
              <ElInput
                v-if="opt.isHidden.value !== true"
                :input-class="inputClass"
                class="setting-input"
                v-bind="opt.outputProps.value"
                :depth="depth + 1"
                :input="opt.input.value"
                :model-value="getNested({ path: opt.key.value, data: item })"
                @update:model-value="updateInputValue({ index: i, key: opt.key.value || '', value: $event })"
              />
            </div>
            <div class="flex justify-between pt-4">
              <div />
              <XButton rounding="full" size="sm" theme="default" icon="i-heroicons-trash" @click="removeItem(item)">
                Remove Item
              </XButton>
            </div>
          </div>
        </div>
      </TransitionSlide>
    </div>

    <div class="actions mt-2">
      <XButton
        rounding="full"
        theme="primary"
        size="xs"
        data-test="add"
        @click="addItem()"
      >
        Add +
      </XButton>
    </div>
  </div>
</template>
