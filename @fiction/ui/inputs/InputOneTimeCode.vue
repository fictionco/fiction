<script lang="ts" setup>
import type { UiElementSize } from '../utils'
import { vue } from '@fiction/core'
import { twMerge } from 'tailwind-merge'
import { inputClasses } from './theme'

const props = defineProps<{
  modelValue?: string
  inputClass?: string
  uiSize?: UiElementSize
  length?: number // Number of characters in code
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'complete', value: string): void
}>()

// Provide defaults
const {
  modelValue = '',
  inputClass = '',
  uiSize = 'md',
  length = 6,
} = props

// Create an array of refs for input elements
const inputElements = vue.ref<(HTMLInputElement | null)[]>([])
const inputValues = vue.ref<string[]>(Array.from({ length }).fill('') as string[])

// Get base input classes
const cls = inputClasses({ uiSize })

// Individual input box classes
const digitClasses = twMerge([
  cls.base,
  cls.textSize,
  cls.bg,
  cls.text,
  cls.border,
  'w-12 h-12', // Fixed square size
  'text-center',
  'font-mono',
  'tracking-widest',
  'transition-all',
  'duration-150',
  'caret-primary-500',
  'focus:caret-primary-500',
])

// Set initial values from modelValue
vue.onMounted(() => {
  if (modelValue) {
    const chars = modelValue.split('')
    chars.forEach((char, i) => {
      if (i < length) {
        inputValues.value[i] = char
      }
    })
  }
  // Focus first empty input on mount if not mobile
  if (!('ontouchstart' in window)) {
    focusFirstEmpty()
    // Select the text in the focused input for easy overwriting
    const firstInput = inputElements.value[0]
    if (firstInput) {
      firstInput.select()
    }
  }
})
// Watch for external modelValue changes
vue.watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    const chars = newVal.split('')
    inputValues.value = Array.from({ length }).fill('').map((_, i) => chars[i] || '')
  }
  else {
    inputValues.value = Array.from({ length }).fill('') as string[]
  }
})

function updateModelValue() {
  const value = inputValues.value.filter(Boolean).join('')
  emit('update:modelValue', value)

  if (value.length === length) {
    emit('complete', value)
  }
}

// Watch internal values and emit changes
vue.watch(() => inputValues.value, () => {
  updateModelValue()
}, { deep: true })

function handlePaste(index: number, event: ClipboardEvent) {
  event.preventDefault()

  const clipboardData = event.clipboardData
  if (!clipboardData)
    return

  const pastedText = clipboardData.getData('text')
  const numbers = pastedText.replace(/\D/g, '').slice(0, length)

  // Create new array instead of mutating
  const newValues = [...inputValues.value]
  numbers.split('').forEach((char, i) => {
    if (index + i < length) {
      newValues[index + i] = char
    }
  })

  // Update all at once
  inputValues.value = newValues

  // Focus next empty or last position
  const nextEmpty = newValues.findIndex((v, i) => i >= index && !v)
  focusInput(nextEmpty >= 0 ? nextEmpty : length - 1)
}

function handleInput(index: number, event: InputEvent) {
  const input = event.target as HTMLInputElement

  // Skip paste events since they're handled separately
  if (event.inputType === 'insertFromPaste') {
    return
  }

  // Get last character and ensure it's a number
  const value = input.value.slice(-1).replace(/\D/g, '')

  // Create new array to trigger reactivity
  const newValues = [...inputValues.value]

  // Always set the value, whether or not the input had a previous value
  newValues[index] = value
  inputValues.value = newValues

  // Auto-advance if we have a value (both for new input and overwrites)
  if (value && index < length - 1) {
    focusInput(index + 1)
  }
}

// Handle backspace
function handleKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace') {
    event.preventDefault()
    inputValues.value[index] = ''
    if (index > 0) {
      focusInput(index - 1)
    }
  }
  else if (event.key === 'ArrowLeft' && index > 0) {
    event.preventDefault()
    focusInput(index - 1)
  }
  else if (event.key === 'ArrowRight' && index < length - 1) {
    event.preventDefault()
    focusInput(index + 1)
  }
}

// Focus helpers
function focusInput(index: number) {
  const input = inputElements.value[index]
  if (input) {
    input.focus()
  }
}

function focusFirstEmpty() {
  const firstEmptyIndex = inputValues.value.findIndex(v => !v)
  if (firstEmptyIndex >= 0) {
    focusInput(firstEmptyIndex)
  }
  else {
    focusInput(length - 1)
  }
}

function setRef(el: HTMLInputElement | null, index: number) {
  inputElements.value[index] = el
}
</script>

<template>
  <div
    class="flex gap-2 items-center justify-center max-w-xs mx-auto"
    :class="inputClass"
  >
    <input
      v-for="(digit, index) in length"
      :key="index"
      :ref="el => setRef(el as HTMLInputElement | null, index)"
      v-model="inputValues[index]"
      type="text"
      inputmode="numeric"
      :data-test-id="`digit-${index + 1}`"
      autocomplete="one-time-code"
      :class="digitClasses"
      :maxlength="1"
      @input="handleInput(index, $event as InputEvent)"
      @keydown="handleKeydown(index, $event)"
      @paste="handlePaste(index, $event as ClipboardEvent)"
    >
  </div>
</template>
