<script lang="ts" setup>
import { getNested, setNested, shortId, vue, waitFor } from '@fiction/core'

import type { InputOption } from './inputs'
import ElInput from './ElInput.vue'
import ElButton from './ElButton.vue'
import TransitionSlide from './TransitionSlide.vue'

const props = defineProps({
  modelValue: {
    type: Array as vue.PropType<Record<string, unknown>[]>,
    default: () => [],
  },
  options: {
    type: Array as vue.PropType<InputOption[]>,
    default: () => [],
  },
  depth: {
    type: Number,
    default: 0,
  },
  inputClass: {
    type: String,
    default: '',
  },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: Record<string, unknown>[]): void
}>()

type KeyedItem = Record<string, unknown> & { _key: string }

const itemSelector = `[data-drag-depth="${props.depth}"]`
const dragSelector = `[data-drag-handle="${props.depth}"]`
const openItem = vue.ref('')
const wrapperEl = vue.ref<HTMLElement>()
const keyedModelValue = vue.computed<KeyedItem[]>(() => {
  return props.modelValue.map((item) => {
    item._key = item._key || shortId()
    return item
  }) as KeyedItem[]
})

function updateOrder() {
  if (!wrapperEl.value)
    return

  const rank: Record<string, unknown>[] = []
  wrapperEl.value.querySelectorAll(itemSelector).forEach((el) => {
    const element = el as HTMLElement
    const value = element.dataset.dragId

    if (value) {
      const item = keyedModelValue.value.find(i => i._key === value)
      if (item)
        rank.push(item)
    }
  })

  emit('update:modelValue', rank)
}

function updateInputValue(args: { index: number, key: string, value: unknown }) {
  const { index, key, value } = args

  const val = [...props.modelValue]
  val[index] = setNested({ path: key, data: val[index], value })

  emit('update:modelValue', val)
}

function addItem() {
  const _key = shortId()
  const val = [...props.modelValue, { name: 'New Item', _key }]
  openItem.value = _key
  emit('update:modelValue', val)
}

function toggleItem(item: Record<string, unknown> & { _key: string }) {
  openItem.value = openItem.value === item._key ? '' : item._key
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
      class="rounded-md border border-theme-300 dark:border-theme-600 mb-2 shadow-sm bg-theme-0 dark:bg-theme-700 cursor-pointer text-theme-700 dark:text-theme-100"
      :data-drag-id="item._key"
      :data-drag-depth="depth"
    >
      <div
        class="px-1 py-1 bg-theme-100 dark:bg-theme-600/50 hover:bg-theme-200 text-xs font-mono  font-medium flex justify-between"
        :class="openItem === item._key ? 'rounded-t-md border-b border-theme-300 dark:border-theme-600' : 'rounded-md'"
        :data-drag-handle="depth"
        @click="toggleItem(item)"
      >
        <div class="flex gap-1 items-center cursor-move">
          <div class="text-lg text-theme-300 dark:text-theme-500">
            <div class="i-tabler-grip-vertical" />
          </div>
          <div class="text-theme-500 dark:text-theme-50">
            Item {{ i + 1 }}
          </div>
        </div>
        <div class="text-lg text-theme-300">
          <div class="i-tabler-chevron-down transition-all" :class="openItem === item._key ? 'rotate-180' : ''" />
        </div>
      </div>
      <TransitionSlide>
        <div v-if="openItem === item._key">
          <div class="py-4 px-2 space-y-3">
            <div v-for="(opt, ii) in options" :key="ii">
              <ElInput
                :input-class="inputClass"
                class="setting-input"
                v-bind="opt.outputProps.value"
                :depth="depth + 1"
                :input="opt.input.value"
                :model-value="getNested({ path: opt.key.value, data: item })"
                @update:model-value="updateInputValue({ index: i, key: opt.key.value || '', value: $event })"
              />
            </div>
          </div>
        </div>
      </TransitionSlide>
    </div>

    <div class="actions mt-2">
      <ElButton
        btn="default"
        size="xs"
        data-test="add"
        @click="addItem()"
      >
        Add +
      </ElButton>
    </div>
  </div>
</template>
