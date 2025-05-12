<script lang="ts" setup>
import type { ColorThemeUser, StandardSize } from '@fiction/core'
import { debounce, toLabel, toSlug, useService, vue, waitFor } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import EffectDraggableSort from '@fiction/ui/effect/EffectDraggableSort.vue'
import ElModal from '@fiction/ui/ElModal.vue'
import InputText from '@fiction/ui/inputs/InputText.vue'
import { inputClasses, textInputClasses } from './theme'

defineOptions({ name: 'InputTags' })

const props = defineProps<{
  modelValue?: string[]
  uiSize?: StandardSize
  placeholder?: string
  label?: string // Generic label (e.g. "tags", "categories")
  table?: string
  column?: string
  maxItems?: number
  inputClass?: string
  theme?: ColorThemeUser
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string[]): void
}>()

const { fictionUser } = useService()

// State
const inputText = vue.ref('')
const isFocused = vue.ref(false)
const items = vue.ref<Array<{ value: string, count: number }>>([])
const showDropdown = vue.computed(() => isFocused.value && items.value.length > 0)
const selectedIndex = vue.ref(-1)
const isModalOpen = vue.ref(false)
const modalSearch = vue.ref('')
const modalItems = vue.ref<Array<{ value: string, count: number }>>([])

// Cache for search results
const searchCache = new Map<string, Array<{ value: string, count: number }>>()

// Size configuration
const sizeClasses = vue.computed(() => {
  const sizes = {
    'xxs': { wrap: 'gap-0.5 py-0.5', avatar: 'size-3', buttonContent: 'text-xs gap-0.5', button: 'xxs' },
    'xs': { wrap: 'gap-1 py-0.5', avatar: 'size-4', buttonContent: 'text-xs gap-0.5', button: 'xxs' },
    'sm': { wrap: 'gap-1.5 py-0.5', avatar: 'size-4', buttonContent: 'text-sm gap-0.5', button: 'xs' },
    'md': { wrap: 'gap-2 py-1', avatar: 'size-5', buttonContent: 'text-sm gap-1', button: 'sm' },
    'lg': { wrap: 'gap-3 py-2', avatar: 'size-6', buttonContent: 'text-sm gap-1', button: 'sm' },
    'xl': { wrap: 'gap-4 py-3', avatar: 'size-7', buttonContent: 'text-base gap-1.5', button: 'md' },
    '2xl': { wrap: 'gap-5 py-4', avatar: 'size-8', buttonContent: 'text-base  gap-1.5', button: 'lg' },
  }

  return sizes[props.uiSize as keyof typeof sizes] || sizes.md
})

// Load initial popular items
vue.onMounted(async () => {
  await fetchItems()
})

// Filtered modal items based on search
const filteredModalItems = vue.computed(() => {
  const search = modalSearch.value.toLowerCase()
  if (!search)
    return modalItems.value
  return modalItems.value.filter(item =>
    item.value.toLowerCase().includes(search),
  )
})

// Fetch items from DB
async function fetchItems(search?: string) {
  if (!props.table || !props.column)
    return

  try {
    const orgId = fictionUser.activeOrgId.value
    if (!orgId)
      return

    // Check cache
    if (search && searchCache.has(search)) {
      items.value = searchCache.get(search) || []
      return
    }

    const response = await fictionUser.requests.GetTopValues.projectRequest({
      table: props.table,
      column: props.column,
      search,
      arrayColumn: true,
      limit: 20, // Show more items when not searching
    })

    if (response.data) {
      const data = response.data
      items.value = data
      modalItems.value = search ? [...modalItems.value, ...data] : data
      if (search)
        searchCache.set(search, data)
    }
  }
  catch (error) {
    console.error('Error fetching items:', error)
  }
}

const tempItems = vue.ref<string[]>([])

function addItem(value: string) {
  if (!value)
    return

  const newItems = value.split(',')
    .map(t => toSlug(t.trim()))
    .filter((t) => {
      const isValid = t?.length >= 2 && t.length <= 30 && !props.modelValue?.includes(t)
      const withinLimit = !props.maxItems || (props.modelValue?.length || 0) < props.maxItems
      return isValid && withinLimit
    })

  if (newItems.length) {
    emit('update:modelValue', [...(props.modelValue || []), ...newItems])
  }

  inputText.value = ''
  selectedIndex.value = -1
  tempItems.value = []
  isModalOpen.value = false
}

function removeItem(value: string) {
  emit('update:modelValue', (props.modelValue || []).filter(t => t !== value))
}

// Input handlers
const handleInput = debounce((e: Event) => {
  const value = (e.target as HTMLInputElement).value
  inputText.value = value
  const searchText = value.split(',').pop()?.trim() || ''
  if (searchText.length >= 2) {
    fetchItems(searchText)
  }
}, 300)

function handleKeydown(event: KeyboardEvent) {
  if (['Tab', 'Enter', ','].includes(event.key)) {
    event.preventDefault()
    if (selectedIndex.value >= 0 && items.value[selectedIndex.value]) {
      addItem(items.value[selectedIndex.value].value)
    }
    else if (inputText.value) {
      addItem(inputText.value)
    }
  }
  else if (event.key === 'Backspace' && !inputText.value && props.modelValue?.length) {
    removeItem(props.modelValue[props.modelValue.length - 1])
  }
  else if (event.key === 'ArrowDown' && showDropdown.value) {
    event.preventDefault()
    selectedIndex.value = Math.min(selectedIndex.value + 1, items.value.length - 1)
  }
  else if (event.key === 'ArrowUp' && showDropdown.value) {
    event.preventDefault()
    selectedIndex.value = Math.max(selectedIndex.value - 1, -1)
  }
}

// Sort handler
async function handleSort(sorted: string[]) {
  await waitFor(20)
  emit('update:modelValue', sorted.filter(v => props.modelValue?.includes(v)))
}

const containerClasses = vue.computed(() =>
  textInputClasses({
    uiSize: props.uiSize,
    inputClass: `flex flex-wrap items-center ${sizeClasses.value.wrap} overflow-hidden p-1`,
  }),
)

const tagInput = vue.ref<HTMLInputElement>()
</script>

<template>
  <div class="space-y-3 relative">
    <div class="flex items-stretch gap-2">
      <!-- Main input -->
      <div :class="containerClasses" @click.self="tagInput?.focus()">
        <EffectDraggableSort
          class="inline-flex gap-1 flex-wrap items-center"
          :allow-horizontal="true"
          @update:sorted="handleSort"
        >
          <template v-if="modelValue?.length">
            <XButton
              v-for="item in modelValue"
              :key="item"
              :data-drag-id="item"
              :size="(sizeClasses.button as StandardSize)"
              :theme="theme || 'default'"
              rounding="full"
              design="solid"
              class="group"
              hover="none"
              :classes="{ button: 'cursor-grab' }"
              @click.stop
            >
              <span class="flex items-center" :class="sizeClasses.buttonContent">
                <span>{{ toLabel(item) }}</span>
                <span
                  class="i-tabler-x opacity-50 hover:opacity-100 cursor-pointer"
                  @click.stop="removeItem(item)"
                />
              </span>
            </XButton>
          </template>

          <input
            ref="tagInput"
            v-model="inputText"
            type="text"
            :placeholder="modelValue?.length ? '' : (placeholder || `Add ${label || 'items'}...`)"
            class="flex-1 min-w-[80px] p-1 font-mono text-sm"
            :class="inputClasses({ uiSize }).reset"
            @keydown="handleKeydown"
            @input="handleInput"
            @focus="isFocused = true"
            @blur="() => { isFocused = false; inputText && addItem(inputText) }"
          >
        </EffectDraggableSort>
      </div>

      <!-- Browse button -->
      <XButton
        v-if="table && column"
        icon="i-tabler-search"
        :ui-size="uiSize"
        theme="default"
        rounding="md"
        class="shrink-0"
        @click.stop="isModalOpen = true"
      />
    </div>

    <!-- Dropdown -->
    <div
      v-if="showDropdown"
      class="absolute z-50 mt-1 w-full max-w-md bg-theme-0 dark:bg-theme-800
             border border-theme-200 dark:border-theme-600 rounded-lg shadow-lg"
    >
      <ul class="py-1">
        <li
          v-for="(item, index) in items"
          :key="item.value"
          class="px-4 py-2 cursor-pointer text-sm flex justify-between items-center"
          :class="[index === selectedIndex ? 'bg-theme-100 dark:bg-theme-700'
            : 'hover:bg-theme-50 dark:hover:bg-theme-700']"
          @mousedown="addItem(item.value)"
          @mouseover="selectedIndex = index"
        >
          <span class="flex items-center gap-2">
            {{ item.value }}
          </span>
          <span class="text-xs text-theme-500 dark:text-theme-400">{{ item.count }}</span>
        </li>
      </ul>
    </div>

    <!-- Browse Modal -->
    <ElModal
      v-model:vis="isModalOpen"
      modal-class="max-w-2xl p-6"
      has-close
    >
      <div class="space-y-6">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold">
            Browse {{ label || 'Items' }}
          </h3>
        </div>

        <InputText
          v-model="modalSearch"
          placeholder="Search..."
          class="w-full"
          prefix-icon="i-tabler-search"
        />

        <div class="flex gap-2 max-h-[350px] overflow-y-auto">
          <XButton
            v-for="item in filteredModalItems"
            :key="item.value"
            :title="modelValue?.includes(item.value) ? 'Already added' : 'Add item'"
            :theme="theme || 'default'"
            :design="tempItems?.includes(item.value) ? 'solid' : 'outline'"
            @click="tempItems.push(item.value)"
          >
            <span class="flex items-center gap-2">
              <span>{{ item.value }}</span>
              <span class="text-xs text-theme-500 dark:text-theme-400">
                {{ item.count }}
              </span>
            </span>
          </XButton>
        </div>
        <div class="border-t border-theme-200 dark:border-theme-700 flex justify-between ">
          <XButton
            theme="default"
            size="md"
            icon="i-tabler-x"
            data-test-id="media-cancel"
            @click="isModalOpen = false"
          >
            Cancel
          </XButton>
          <XButton
            theme="primary"
            size="md"
            icon="i-tabler-check"
            data-test-id="media-apply"
            @click="addItem(tempItems.join(','))"
          >
            Apply Changes
          </XButton>
        </div>
      </div>
    </ElModal>
  </div>
</template>
