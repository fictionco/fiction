<script lang="ts" setup>
import type { InputOption } from '.'
import { vue } from '@fiction/core'
import XButton from '../buttons/XButton.vue'
import FormEngine from './FormEngine.vue'

defineOptions({ name: 'OptionModal' })

const props = defineProps<{
  // Visibility control
  vis?: boolean

  // Options configuration
  options: InputOption[]
  modelValue: Record<string, any>
  inputProps?: Record<string, any>

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
  (event: 'update:tempValue', payload: Record<string, any>): void
  (event: 'apply'): void
  (event: 'cancel'): void
  (event: 'done'): void
}>()

// Model setup
const currentValue = vue.ref<Record<string, any>>({})

// Active option tracking
const activeOptionId = vue.ref<string>('')

const testId = props.testId || 'options'

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

// Action handlers
function applyChanges() {
  emit('update:modelValue', currentValue.value)
  emit('apply')
  emit('done')
}

function cancel() {
  emit('cancel')
  emit('done')
}

function updateValue(update: Record<string, any>) {
  currentValue.value = { ...update }
  emit('update:tempValue', currentValue.value)
}
</script>

<template>
  <div :data-test-id="testId" class="bg-white text-theme-900 dark:bg-theme-900 dark:text-theme-100 rounded-lg overflow-hidden h-full flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b border-theme-200 dark:border-theme-600/60">
      <div class="flex items-center justify-between">
        <h2 class="font-medium">
          {{ title || 'Options' }}
        </h2>
        <!-- Header slot for additional controls -->
        <slot name="header" />
      </div>
    </div>

    <!-- Preview slot - Optional -->
    <div class="grow min-h-0 flex flex-col ">
      <slot name="preview" />

      <div class="flex-1 w-full grow overflow-scroll no-scrollbar ">
        <div>
          <FormEngine
            state-key="optionsEngine"
            :model-value="currentValue"
            ui-size="md"
            :options="options"
            :disable-group-hide="true"
            :input-props="inputProps"
            :classes="{ groupPad: 'mx-auto max-w-[700px] p-6 lg:p-12' }"
            @update:model-value="updateValue($event)"
          />
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="p-4 border-t border-theme-200 dark:border-theme-600/60 flex justify-between bg-theme-50 dark:bg-theme-800">
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
