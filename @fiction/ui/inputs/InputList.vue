<script lang="ts" setup>
import type { Sortable } from '@shopify/draggable'
import type { InputOption } from '.'
import { getNested, setNested, shortId, vue, waitFor } from '@fiction/core'
import TransitionSlide from '../anim/TransitionSlide.vue'
import XButton from '../buttons/XButton.vue'
import ElInput from './ElInput.vue'

export type BasicItem = Record<string, unknown> & { _key?: string }

const { modelValue = [], options = [], itemName = 'Item', depth = 0, inputClass = '' } = defineProps<{
  modelValue?: BasicItem[]
  options?: InputOption[]
  itemName?: string
  inputClass?: string
  depth?: number
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: BasicItem[]): void
}>()

type KeyedItem = Record<string, unknown> & { _key: string }

const itemSelector = `[data-drag-depth="${depth}"]`
const dragSelector = `[data-drag-handle="${depth}"]`
const openItem = vue.ref(-1)
const wrapperEl = vue.ref<HTMLElement>()
const listKey = vue.ref(0)

const keyedModelValue = vue.computed<KeyedItem[]>(() => {
  return modelValue.map((item, i) => {
    item._key = item._key || shortId()
    return item
  }) as KeyedItem[]
})

function updateModelValue(val: Record<string, unknown>[]) {
  emit('update:modelValue', val)
}

async function updateOrder() {
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
  listKey.value++ // Increment the key to force re-render
}

function updateInputValue(args: { index: number, key: string, value: unknown }) {
  const { index, key, value } = args

  const val = [...modelValue]
  val[index] = setNested({ path: key, data: val[index], value })

  updateModelValue(val)
}

function getDefaultItem() {
  const item: Record<string, unknown> = {}
  options.forEach((opt) => {
    const v = opt.settings.getDefaultValue?.()
    if (v !== undefined)
      item[opt.key.value] = v
  })
  return item
}

function addItem() {
  const _key = shortId()
  const defaultItem = getDefaultItem()
  const val = [...modelValue, { name: `New ${itemName}`, _key, ...defaultItem }]
  openItem.value = val.length - 1
  updateModelValue(val)
}

function removeItem(item: Record<string, unknown> & { _key: string }) {
  const confirmed = confirm('Are you sure?')
  if (!confirmed)
    return
  const val = modelValue.filter(i => i._key !== item._key)
  updateModelValue(val)

  openItem.value = -1
}

function toggleItem(index: number) {
  openItem.value = openItem.value === index ? -1 : index
}

let sortable: Sortable | undefined

async function createDraggable() {
  if (!wrapperEl.value)
    return
  const { Plugins, Sortable } = await import('@shopify/draggable')

  if (sortable)
    sortable.destroy()

  sortable = new Sortable(wrapperEl.value, {
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
}

vue.onMounted(async () => {
  await waitFor(200)

  vue.watch(() => listKey.value, async () => {
    await createDraggable()
  }, { immediate: true })
})
</script>

<template>
  <div ref="wrapperEl" :key="listKey">
    <div
      v-for="(item, i) in keyedModelValue"
      :key="i"
      class="rounded-md border border-theme-300 dark:border-theme-600 mb-2 shadow-sm bg-theme-0 dark:bg-theme-800/20 cursor-pointer text-theme-700 dark:text-theme-100"
      :data-drag-id="item._key"
      :data-drag-depth="depth"
      :data-handle-index="i"
    >
      <div
        class="px-1 py-1 bg-theme-50/50 dark:bg-theme-600/50 hover:bg-theme-50 text-xs font-mono  font-medium flex justify-between items-center"
        :class="openItem === i ? 'rounded-t-md border-b border-theme-200 dark:border-theme-600' : 'rounded-md'"
        :data-drag-handle="depth"
        data-test-id="handle"
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
          <div class="py-4 px-3 space-y-5">
            <div v-for="(opt, ii) in options" :key="ii">
              <ElInput
                v-if="opt.isHidden.value !== true"
                :input-class="inputClass"
                class="setting-input"
                v-bind="opt.outputProps.value"
                :depth="depth + 1"
                :input="opt.input.value"
                :data-option-path="opt.key.value"
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

    <div class="actions mt-3">
      <XButton
        rounding="full"
        theme="primary"
        size="xs"
        data-test="add"
        icon="i-tabler-plus"
        @click.prevent="addItem()"
      >
        Add {{ itemName }}
      </XButton>
    </div>
  </div>
</template>
