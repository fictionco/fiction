<script lang="ts" setup>
import type { StandardSize } from '@fiction/core'
import type { Site } from '@fiction/site'
import type { Sortable } from '@shopify/draggable'
import type { InputOption } from '.'
import { isTest, shortId, vue, waitFor } from '@fiction/core'
import TransitionSlide from '../anim/TransitionSlide.vue'
import XButton from '../buttons/XButton.vue'
import FormEngine from './FormEngine.vue'

defineOptions({ name: 'InputList' })

const {
  modelValue = [],
  options = [],
  itemLabel = 'Item',
  itemName = 'Item',
  site,
  activePath,
  editPath,
} = defineProps<{
  modelValue?: BasicItem[]
  options?: InputOption[]
  itemLabel?: string | ((args: { item?: BasicItem, index?: number }) => string)
  itemName?: string
  inputClass?: string
  depth?: number
  min?: number
  max?: number
  uiSize?: StandardSize
  site?: Site
  activePath?: string
  editPath?: string
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: BasicItem[]): void
  (event: 'update:activePath', payload: string): void
  (event: 'activate', payload: string): void
}>()

export type BasicItem = Record<string, unknown> & { _key?: string }

type KeyedItem = Record<string, unknown> & { _key: string }

const randomId = shortId()
const itemSelector = `[data-drag-depth="${randomId}"]`
const dragSelector = `[data-drag-handle="${randomId}"]`
const openItem = vue.ref(-1)
const wrapperEl = vue.ref<HTMLElement>()
const listKey = vue.ref(0)

const keyedModelValue = vue.computed<KeyedItem[]>(() => {
  if (!modelValue || !Array.isArray(modelValue))
    return []

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

function updateIndexValue(index: number, value: Record<string, unknown>) {
  const val = [...modelValue]
  val[index] = value
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

function getItemLabel(item?: BasicItem, index: number = -1) {
  if (typeof itemLabel === 'function')
    return itemLabel({ item, index })

  const out: any[] = [itemLabel]

  if (index > -1)
    out.push(`${index + 1}`)

  return out.join(' ')
}

function addItem() {
  const _key = shortId()
  const defaultItem = getDefaultItem()
  const itemLabel = getItemLabel()

  const existing = modelValue && Array.isArray(modelValue) ? modelValue : []
  const val = [...existing, { name: `New ${itemLabel}`, _key, ...defaultItem }]
  openItem.value = val.length - 1
  updateModelValue(val)
}

function removeItem(item: Record<string, unknown> & { _key: string }) {
  const confirmed = confirm(`Delete this ${itemName}?`)
  if (!confirmed)
    return
  const val = modelValue.filter(i => i._key !== item._key)
  updateModelValue(val)

  openItem.value = -1
}

function toggleItem(index: number, action?: 'show' | 'hide') {
  if (action === 'show') {
    openItem.value = index
  }
  else if (action === 'hide') {
    openItem.value = -1
  }
  else {
    openItem.value = openItem.value === index ? -1 : index
  }
}

let sortable: Sortable | undefined

async function createDraggable() {
  if (typeof window === 'undefined' || !wrapperEl.value || isTest())
    return

  try {
    const { Plugins, Sortable } = await import('@shopify/draggable')

    if (sortable)
      sortable.destroy()

    sortable = new Sortable(wrapperEl.value, {
      draggable: itemSelector,
      distance: 3,
      handle: dragSelector,
      mirror: { constrainDimensions: true },
      swapAnimation: { duration: 200, easingFunction: 'ease-in-out', horizontal: false },
      plugins: [Plugins.SwapAnimation],
    })

    sortable.on('sortable:stop', (_evt) => {
      setTimeout(() => updateOrder(), 50)
    })
  }
  catch (error) {
    console.warn('Failed to initialize draggable:', error)
  }
}

vue.onMounted(async () => {
  await waitFor(200)

  vue.watch(
    () => listKey.value,
    async () => {
      await createDraggable()
    },
    { immediate: true },
  )
})

function activateItem(args: { index: number, path: string }) {
  const { index, path } = args
  toggleItem(index, 'show')
  emit('activate', path)
}
</script>

<template>
  <div ref="wrapperEl" :key="listKey" :data-namespace="randomId">
    <div
      v-for="(item, i) in keyedModelValue"
      :key="i"
      class="rounded-md mb-2 shadow-sm bg-theme-0 dark:bg-theme-700/20 cursor-pointer text-theme-700 dark:text-theme-100 focus:outline-none"
      :data-drag-id="item._key"
      :data-drag-depth="randomId"
      :data-handle-index="i"
    >
      <div
        class="p-2 bg-theme-50/50 dark:bg-theme-600/20 hover:opacity-80 text-xs font-mono font-medium flex justify-between items-center"
        :class="openItem === i ? '' : 'rounded-md'"
        :data-drag-handle="randomId"
        data-test-id="handle"
        @click="toggleItem(i)"
      >
        <div class="flex gap-1 items-center cursor-move min-w-0">
          <div class="text-lg text-theme-300 dark:text-theme-500 i-tabler-grip-vertical" />
          <div class="text-theme-500 dark:text-theme-50 truncate min-w-0">
            {{ getItemLabel(item, i) }}
          </div>
          <div class="text-[1.2em] text-theme-300 i-tabler-chevron-down transition-all" :class="openItem === i ? 'rotate-180' : ''" />
        </div>
        <div class="flex gap-1 items-center">
          <div class="text-[1.2em] text-theme-300 i-tabler-x transition-all opacity-70 hover:opacity-100" @click.stop="removeItem(item)" />
        </div>
      </div>
      <TransitionSlide>
        <div v-show="openItem === i">
          <div class="py-4 px-3 space-y-5">
            <FormEngine
              :model-value="item"
              :options
              :depth="1"
              :engine-index="i"
              :active-path="activePath"
              :edit-path="`${editPath}.${i}`"
              :input-props="{ site }"
              @update:model-value="updateIndexValue(i, $event)"
              @update:active-path="emit('update:activePath', $event)"
              @activate="activateItem({ index: i, path: $event })"
            />
          </div>
        </div>
      </TransitionSlide>
    </div>

    <div class="actions mt-3 text-center flex items-center justify-center gap-3">
      <div class="border-b h-0 border-theme-200 dark:border-theme-600/50 border-dashed grow" />
      <XButton
        theme="default"
        size="xs"
        data-test="add"
        icon="i-tabler-plus"
        @click.prevent="addItem()"
      >
        Add {{ itemName }}
      </XButton>
      <div class="border-b h-0 border-theme-200 dark:border-theme-600/50 border-dashed grow" />
    </div>
  </div>
</template>
