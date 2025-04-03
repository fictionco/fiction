<script lang="ts" setup>
import type { InputOption } from '.'
import { vue, waitFor } from '@fiction/core'
import XButton from '../buttons/XButton.vue'
import FormEngine from './FormEngine.vue'

defineOptions({ name: 'OptionModal' })

const props = defineProps<{
  // Visibility control
  vis?: boolean

  // Options configuration
  options: InputOption[]
  modelValue: Record<string, any>

  // Display options
  title?: string
  testId?: string
  showAllOptions?: boolean // Whether to show all options at once or just active group

  // Button configuration
  cancelText?: string
  applyText?: string

  // Modal settings
  modalClass?: string
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: Record<string, any>): void
  (event: 'update:vis', payload: boolean): void
  (event: 'apply'): void
  (event: 'cancel'): void
}>()

// Model setup
const currentValue = vue.ref<Record<string, any>>({})

// Active option tracking
const activeOptionId = vue.ref<string>('')
const isScrolling = vue.ref(false)

// Observe options for intersection
const optionsContainer = vue.ref<HTMLElement>()
const intersectionObserver = vue.ref<IntersectionObserver>()
const visibleOptions = vue.ref(new Set<string>())

// Update internal state when modelValue changes
vue.watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      currentValue.value = { ...newValue }
    }
  },
  { immediate: true },
)

// Set active option based on first available option or first filtered option
vue.watch(
  () => props.options,
  (newOptions) => {
    if (newOptions?.length && !activeOptionId.value) {
      activeOptionId.value = newOptions[0].key.value
    }
  },
  { immediate: true },
)

// Intersection observer functions
function handleIntersection(entries: IntersectionObserverEntry[]) {
  // Skip updates if we're programmatically scrolling
  if (isScrolling.value)
    return

  entries.forEach((entry) => {
    const optionKey = entry.target.getAttribute('data-option-key')
    if (!optionKey)
      return

    if (entry.isIntersecting) {
      visibleOptions.value.add(optionKey)
    }
    else {
      visibleOptions.value.delete(optionKey)
    }
  })

  // Update active option based on most visible option
  if (visibleOptions.value.size > 0) {
    const firstVisible = Array.from(visibleOptions.value)[0]
    if (firstVisible !== activeOptionId.value) {
      activeOptionId.value = firstVisible
    }
  }
}

async function setObservers() {
  await waitFor(400)

  intersectionObserver.value?.disconnect()

  intersectionObserver.value = new IntersectionObserver(handleIntersection, {
    root: optionsContainer.value,
    threshold: 0.5,
  })

  const els = document.querySelectorAll('[data-option-depth="1"][data-option-key]')
  els.forEach((el) => {
    intersectionObserver.value?.observe(el)
  })
}

// UI interaction functions
function scrollToOption(optionKey: string) {
  activeOptionId.value = optionKey

  // If we're showing all options, scroll to the target
  if (props.showAllOptions) {
    const sel = `[data-option-key="${optionKey}"]`
    const el = document.querySelector(sel)

    if (!el || !optionsContainer.value) {
      console.error(`Element/container not found for scroll (${sel})`)
      return
    }

    isScrolling.value = true

    // Calculate scroll position
    const containerRect = optionsContainer.value.getBoundingClientRect()
    const elementRect = el.getBoundingClientRect()
    const scrollOffset = elementRect.top - containerRect.top + optionsContainer.value.scrollTop

    // Smooth scroll to target
    optionsContainer.value.scrollTo({
      top: scrollOffset,
      behavior: 'smooth',
    })

    setTimeout(() => { isScrolling.value = false }, 500)
  }
}

// Action handlers
function applyChanges() {
  emit('update:modelValue', currentValue.value)
  emit('apply')
  emit('update:vis', false)
}

function cancel() {
  emit('cancel')
  emit('update:vis', false)
}

function updateValue(update: Record<string, any>) {
  currentValue.value = { ...update }
}

// Filtered options based on active option (when not showing all)
const filteredOptions = vue.computed(() => {
  if (props.showAllOptions) {
    return props.options
  }

  // Find the active option
  const activeOption = props.options.find(opt => opt.key.value === activeOptionId.value)
  return activeOption ? [activeOption] : []
})

// Lifecycle hooks
vue.onMounted(() => {
  vue.watch(() => props.vis, (vis) => {
    if (vis && props.showAllOptions) {
      setObservers()
    }
  }, { immediate: true })
})

vue.onUnmounted(() => {
  intersectionObserver.value?.disconnect()
})
</script>

<template>
  <div :data-test-id="testId" class="bg-white text-theme-900 dark:bg-theme-900 dark:text-theme-100 rounded-lg overflow-hidden">
    <!-- Header -->
    <div class="p-4 border-b border-theme-200 dark:border-theme-700">
      <div class="flex items-center justify-between">
        <h2 class="font-medium">
          {{ title || 'Options' }}
        </h2>
        <!-- Header slot for additional controls -->
        <slot name="header" />
      </div>
    </div>

    <!-- Preview slot - Optional -->
    <slot name="preview" />

    <!-- Main Content Area -->
    <div class="flex min-h-[350px]">
      <!-- Left Sidebar - Source Selection -->
      <div class="w-48 border-r border-theme-200 dark:border-theme-700 flex-shrink-0 bg-theme-50 dark:bg-theme-800">
        <nav class="p-3">
          <button
            v-for="opt in options"
            :key="opt.key.value"
            :data-test-id="`option-tool-${opt.key.value}`"
            class="w-full px-2 py-2 rounded-lg text-left mb-1 flex items-center gap-2 transition-colors text-sm font-medium whitespace-nowrap truncate"
            :class="[
              activeOptionId === opt.key.value
                ? 'bg-theme-600 dark:bg-theme-700/50 text-white ring-1 ring-theme-500/30'
                : 'hover:bg-theme-100 dark:hover:bg-theme-700 text-theme-700 dark:text-theme-200',
            ]"
            @click="scrollToOption(opt.key.value)"
          >
            <i v-if="opt.settings.icon?.class" class="text-lg shrink-0" :class="[opt.settings.icon.class]" />
            <span class="min-w-0 truncate">{{ opt.label.value }}</span>
          </button>
        </nav>
      </div>

      <!-- Content Area -->
      <div class="flex-1 flex flex-col">
        <!-- Tool Content Area -->
        <div ref="optionsContainer" class="flex-1 p-4 bg-theme-50/50 dark:bg-theme-800/50 max-h-[500px] overflow-auto">
          <div>
            <FormEngine
              state-key="optionsEngine"
              :depth="1"
              :model-value="currentValue"
              ui-size="md"
              :options="filteredOptions"
              @update:model-value="updateValue($event)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="p-4 border-t border-theme-200 dark:border-theme-700 flex justify-between bg-theme-50 dark:bg-theme-800">
      <slot name="footer-left">
        <XButton
          theme="default"
          size="md"
          icon="i-tabler-x"
          :data-test-id="`${testId}-cancel`"
          @click="cancel"
        >
          {{ cancelText || 'Cancel' }}
        </XButton>
      </slot>

      <slot name="footer-right">
        <XButton
          theme="primary"
          size="md"
          icon="i-tabler-check"
          :data-test-id="`${testId}-apply`"
          @click="applyChanges"
        >
          {{ applyText || 'Apply Changes' }}
        </XButton>
      </slot>
    </div>
  </div>
</template>
