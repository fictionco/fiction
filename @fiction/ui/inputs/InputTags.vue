# InputTags.vue
<script lang="ts" setup>
import type { StandardSize } from '@fiction/core'
import { debounce, log, toSlug, useService, vue, waitFor } from '@fiction/core'
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
  table?: string
  column?: string
  maxTags?: number
  inputClass?: string
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string[]): void
}>()

const logger = log.contextLogger('InputTags')
const { fictionUser } = useService()

// State
const inputText = vue.ref<string>('')
const isFocused = vue.ref(false)
const suggestions = vue.ref<Array<{ value: string, count: number }>>([])
const showSuggestions = vue.computed(() => isFocused.value && suggestions.value.length > 0)
const selectedSuggestion = vue.ref(-1)
const isModalOpen = vue.ref(false)
const searchCache = new Map<string, Array<{ value: string, count: number }>>()

// Modal browse state
const modalSearch = vue.ref('')
const modalSuggestions = vue.ref<Array<{ value: string, count: number }>>([])

const filteredModalSuggestions = vue.computed(() => {
  const search = modalSearch.value.toLowerCase()
  return modalSuggestions.value.filter(tag =>
    tag.value.toLowerCase().includes(search),
  )
})

// Fetch suggestions from DB
async function fetchSuggestions(search: string) {
  if (!props.table || !props.column)
    return

  try {
    const orgId = fictionUser.activeOrgId.value
    if (!orgId)
      return

    // Check cache first
    if (searchCache.has(search)) {
      suggestions.value = searchCache.get(search) || []
      return
    }

    const response = await fictionUser.requests.GetTopValues.projectRequest({
      table: props.table,
      column: props.column,
      search,
      arrayColumn: true,
      limit: 10,
    })

    if (response.data) {
      suggestions.value = response.data
      searchCache.set(search, response.data)
    }
  }
  catch (error) {
    logger.error('Error fetching suggestions', { error })
  }
}

function addTag(tag: string) {
  if (!tag)
    return

  const newTags = tag.split(',')
    .map(t => toSlug(t.trim()))
    .filter((t) => {
      // Filter out empty, duplicate, and enforce maxTags
      const isValid = t
        && t.length >= 2
        && t.length <= 30
        && !props.modelValue?.includes(t)

      const withinLimit = !props.maxTags
        || (props.modelValue?.length || 0) < props.maxTags

      return isValid && withinLimit
    })

  if (newTags.length) {
    const updatedTags = [...(props.modelValue || []), ...newTags]
    emit('update:modelValue', updatedTags)
  }

  inputText.value = ''
  selectedSuggestion.value = -1
}

function removeTag(tagToRemove: string) {
  const updatedTags = (props.modelValue || []).filter(tag => tag !== tagToRemove)
  emit('update:modelValue', updatedTags)
}

function handleInputChange(e: Event) {
  const value = (e.target as HTMLInputElement).value
  inputText.value = value

  // Only search after comma for multiple tags
  const searchText = value.split(',').pop()?.trim() || ''
  if (searchText.length >= 2) {
    debounce(() => fetchSuggestions(searchText), 300)()
  }
  else {
    suggestions.value = []
  }
}

function handleKeydown(event: KeyboardEvent) {
  // Add on tab, enter or comma
  if (event.key === 'Tab' || event.key === 'Enter' || event.key === ',') {
    event.preventDefault()

    if (selectedSuggestion.value >= 0 && suggestions.value[selectedSuggestion.value]) {
      addTag(suggestions.value[selectedSuggestion.value].value)
    }
    else if (inputText.value) {
      addTag(inputText.value)
    }
  }
  // Remove last tag on backspace if input is empty
  else if (event.key === 'Backspace' && !inputText.value && props.modelValue?.length) {
    removeTag(props.modelValue[props.modelValue.length - 1])
  }
  // Navigation
  else if (event.key === 'ArrowDown' && showSuggestions.value) {
    event.preventDefault()
    selectedSuggestion.value = Math.min(
      selectedSuggestion.value + 1,
      suggestions.value.length - 1,
    )
  }
  else if (event.key === 'ArrowUp' && showSuggestions.value) {
    event.preventDefault()
    selectedSuggestion.value = Math.max(selectedSuggestion.value - 1, -1)
  }
}

function handleBlur() {
  // Add any remaining input when focus is lost
  setTimeout(() => {
    if (inputText.value) {
      addTag(inputText.value)
    }
    isFocused.value = false
    suggestions.value = []
  }, 200)
}

// Handle drag-sort
async function handleSort(sortedValues: string[]) {
  await waitFor(20)
  const newValue = sortedValues
    .map(val => props.modelValue?.find(item => item === val))
    .filter(Boolean) as string[]
  emit('update:modelValue', newValue)
}

// Modal tag browse
async function openTagBrowser() {
  isModalOpen.value = true
  await fetchSuggestions('')
  modalSuggestions.value = suggestions.value
}

// Watch modal search
vue.watch(() => modalSearch.value, async (search) => {
  if (search.length >= 2) {
    debounce(() => fetchSuggestions(search), 300)()
    modalSuggestions.value = suggestions.value
  }
})

const containerStyles = vue.computed(() =>
  textInputClasses({
    uiSize: props.uiSize,
    inputClass: 'flex flex-wrap items-center gap-1 !p-1.5', // Adjust padding for tags
  }),
)

const tagInput = vue.ref<HTMLInputElement>()
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-stretch gap-2">
      <!-- Main input container -->
      <div :class="containerStyles" @click.self="$refs.tagInput.focus()">
        <EffectDraggableSort
          class="inline-flex gap-2 flex-wrap items-center"
          :allow-horizontal="true"
          @update:sorted="handleSort"
        >
          <!-- Selected tags -->
          <template v-if="modelValue?.length">
            <XButton
              v-for="tag in modelValue"
              :key="tag"
              :data-drag-id="tag"
              size="sm"
              theme="default"
              rounding="full"
              class="group cursor-grab bg-theme-100 dark:bg-theme-700"
              @click.stop
            >
              <span class="flex items-center gap-1.5">
                <span
                  class="i-tabler-grip-vertical opacity-50 group-hover:opacity-100 cursor-move"
                />
                <span>{{ tag }}</span>
                <span
                  class="i-tabler-x opacity-50 group-hover:opacity-100 cursor-pointer"
                  @click.stop="removeTag(tag)"
                />
              </span>
            </XButton>
          </template>
          <!-- Input field -->
          <input
            ref="tagInput"
            v-model="inputText"
            type="text"
            :placeholder="modelValue?.length ? '' : (placeholder || 'Add...')"
            class="flex-1 min-w-[80px] p-1 font-mono text-sm"
            :class="inputClasses({ uiSize }).reset"
            @keydown="handleKeydown"
            @input="handleInputChange"
            @focus="isFocused = true"
            @blur="handleBlur"
          >
        </EffectDraggableSort>
      </div>

      <!-- Browse button -->
      <XButton
        v-if="table && column"
        icon="i-tabler-tags"
        :ui-size="uiSize"
        theme="default"
        rounding="md"
        class="shrink-0"
        @click.stop="openTagBrowser"
      />
    </div>

    <!-- Suggestions dropdown -->
    <div
      v-if="showSuggestions"
      class="absolute z-50 mt-1 w-full max-w-md bg-theme-0 dark:bg-theme-800
             border border-theme-200 dark:border-theme-700 rounded-lg shadow-lg"
    >
      <ul class="py-1">
        <li
          v-for="(suggestion, index) in suggestions"
          :key="suggestion.value"
          class="px-4 py-2 cursor-pointer text-sm flex justify-between items-center"
          :class="[
            index === selectedSuggestion
              ? 'bg-theme-100 dark:bg-theme-700'
              : 'hover:bg-theme-50 dark:hover:bg-theme-700',
          ]"
          @mousedown="addTag(suggestion.value)"
          @mouseover="selectedSuggestion = index"
        >
          <span class="flex items-center gap-2">
            <span class="i-tabler-hash text-theme-500 dark:text-theme-400" />
            {{ suggestion.value }}
          </span>
          <span class="text-xs text-theme-500 dark:text-theme-400">
            {{ suggestion.count }} posts
          </span>
        </li>
      </ul>
    </div>

    <!-- Tag Browser Modal -->
    <ElModal
      v-model:vis="isModalOpen"
      modal-class="max-w-2xl p-6"
      has-close
    >
      <div class="space-y-6">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold">
            Browse Tags
          </h3>
        </div>

        <div class="relative">
          <span
            class="absolute left-3 top-1/2 -translate-y-1/2 text-theme-400 dark:text-theme-500"
          >
            <span class="i-tabler-search" />
          </span>
          <InputText
            v-model="modalSearch"
            placeholder="Search tags..."
            class="w-full pl-10"
          />
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
          <button
            v-for="tag in filteredModalSuggestions"
            :key="tag.value"
            class="p-2 text-left rounded-lg flex items-center justify-between group"
            :class="[
              modelValue?.includes(tag.value)
                ? 'bg-theme-100 text-theme-600 dark:bg-theme-800 dark:text-theme-300 cursor-not-allowed'
                : 'bg-theme-50 hover:bg-theme-100 dark:bg-theme-800 dark:hover:bg-theme-700',
            ]"
            :disabled="modelValue?.includes(tag.value)"
            @click="addTag(tag.value)"
          >
            <span class="flex items-center gap-2">
              <span class="i-tabler-hash text-theme-500 dark:text-theme-400" />
              <span class="truncate">{{ tag.value }}</span>
            </span>
            <span class="text-xs text-theme-500 dark:text-theme-400">
              {{ tag.count }}
            </span>
          </button>
        </div>
      </div>
    </ElModal>
  </div>
</template>
