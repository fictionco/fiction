<script setup lang="ts">
import type { Range } from '@tiptap/core'
import type { PropType } from 'vue'
import type { SuggestionItem } from './suggestionItems'
import { ref, watch } from 'vue'

const props = defineProps({
  items: { type: Array as PropType<SuggestionItem[]>, required: true },
  command: { type: Function, required: true },
  range: { type: Object as PropType<Range>, required: true },
})

const selectedIndex = ref(0)

const commandListContainer = ref<HTMLDivElement>()

const navigationKeys = ['ArrowUp', 'ArrowDown', 'Enter']
function onKeyDown(e: KeyboardEvent) {
  if (navigationKeys.includes(e.key)) {
    e.preventDefault()
    if (e.key === 'ArrowUp') {
      selectedIndex.value
        = (selectedIndex.value + props.items.length - 1) % props.items.length
      scrollToSelected()
      return true
    }
    if (e.key === 'ArrowDown') {
      selectedIndex.value = (selectedIndex.value + 1) % props.items.length

      scrollToSelected()
      return true
    }
    if (e.key === 'Enter') {
      selectItem(selectedIndex.value)
      return true
    }
    return false
  }
}

watch(
  () => props.items,
  () => {
    selectedIndex.value = 0
  },
)

defineExpose({
  onKeyDown,
})

function selectItem(index: number) {
  const item = props.items[index]

  if (item) {
    props.command(item)
  }
}

function updateScrollView(container: HTMLElement, item: HTMLElement) {
  const containerHeight = container.offsetHeight
  const itemHeight = item ? item.offsetHeight : 0

  const top = item.offsetTop
  const bottom = top + itemHeight

  if (top < container.scrollTop)
    container.scrollTop -= container.scrollTop - top + 5
  else if (bottom > containerHeight + container.scrollTop)
    container.scrollTop += bottom - containerHeight - container.scrollTop + 5
}

function scrollToSelected() {
  const container = commandListContainer.value
  const item = container?.children[selectedIndex.value] as HTMLElement

  if (container && item)
    updateScrollView(container, item)
}
</script>

<template>
  <div
    v-if="items.length > 0"
    ref="commandListContainer"
    class="grid grid-cols-1 gap-2 p-4 z-50 h-auto max-h-[40dvh] w-64 overflow-y-auto rounded-md border border-theme-200 dark:border-theme-600 bg-theme-0 dark:bg-theme-900 px-1 py-2 shadow-md transition-all no-scrollbar"
  >
    <button
      v-for="(item, index) in items"
      :key="index"
      class="flex items-center px-2 py-1 space-x-2 text-sm text-left rounded-md text-theme-900 dark:text-theme-100 hover:bg-theme-100/50 dark:hover:bg-theme-700"
      :class="index === selectedIndex ? 'bg-theme-100/50 dark:bg-theme-700 text-theme-900 dark:text-theme-0' : ''"
      @click="selectItem(index)"
    >
      <div class="shrink-0 flex items-center dark:text-theme-0 text-theme-500">
        <div class="shrink-0 flex items-center justify-center w-7 h-7">
          <component :is="item.icon" size="18" />
        </div>
      </div>
      <div>
        <p class="font-medium">
          {{ item.title }}
        </p>
      </div>
    </button>
  </div>
</template>
