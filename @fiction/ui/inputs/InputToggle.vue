<script lang="ts" setup>
import type { StandardSize } from '@fiction/core'
import { vue } from '@fiction/core'
import { twMerge } from 'tailwind-merge'

defineOptions({ name: 'InputToggle' })

const {
  uiSize = 'md',
  modelValue = false,
  disabled = false,
  onlyOn = false,
  onlyOff = false,
  valueOn = true,
  valueOff = false,
} = defineProps<{
  /** Current state of the toggle */
  modelValue?: boolean | string
  /** Text to display when toggle is off */
  textOff?: string
  /** Text to display when toggle is on */
  textOn?: string
  /** Value to emit when toggle is on */
  valueOn?: boolean | string
  /** Value to emit when toggle is off */
  valueOff?: boolean | string
  /** Whether the toggle is disabled */
  disabled?: boolean
  /** Size of the toggle */
  uiSize?: StandardSize
  /** When true, toggle can only be turned on, not off again */
  onlyOn?: boolean
  /** When true, toggle can only be turned off, not on again */
  onlyOff?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: boolean | string): void
}>()

const attrs = vue.useAttrs()

const isOn = vue.computed<boolean>(() => {
  return modelValue === valueOn
})

function toggle(): void {
  if (disabled)
    return

  // Prevent toggling if one-way restrictions apply
  if ((onlyOn && isOn.value) || (onlyOff && !isOn.value))
    return

  const newValue = isOn.value ? valueOff : valueOn
  emit('update:modelValue', newValue)
}

function handleInputChange(target: EventTarget | null): void {
  const el = target as HTMLInputElement
  const newValue = el.checked ? valueOn : valueOff
  emit('update:modelValue', newValue)
}

// Determine if this toggle is locked in its current state
const isLocked = vue.computed(() => (onlyOn && isOn.value) || (onlyOff && !isOn.value))

function getClasses(uiSize: StandardSize) {
  const baseClasses = {
    label: 'toggle-wrap flex items-center py-1',
    input: 'absolute h-1 w-1 opacity-0',
    button: 'relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-200 ease-in-out focus:outline-none',
    buttonOn: 'bg-primary-600',
    buttonOff: 'bg-theme-300 dark:bg-theme-600',
    span: 'inline-block rounded-full transition duration-200 ease-in-out ease-[cubic-bezier(0.25,1,0.33,1)]',
    spanOn: 'bg-primary-0 ring-primary-600',
    spanOff: 'bg-theme-0 ring-theme-300',
    text: 'text-theme-500 dark:text-theme-400 hover:opacity-70 ml-2 cursor-pointer',
  }

  const sizeClasses = {
    'xxs': { button: 'h-3 w-6', span: 'h-2 w-2', text: 'text-[10px]' },
    'xs': { button: 'h-4 w-8', span: 'h-3 w-3', text: 'text-xs' },
    'sm': { button: 'h-5 w-10', span: 'h-4 w-4', text: 'text-xs' },
    'md': { button: 'h-6 w-12', span: 'h-5 w-5', text: 'text-xs' },
    'lg': { button: 'h-7 w-14', span: 'h-6 w-6', text: 'text-sm' },
    'xl': { button: 'h-8 w-16', span: 'h-7 w-7', text: 'text-sm' },
    '2xl': { button: 'h-9 w-18', span: 'h-8 w-8', text: 'text-sm' },
  }

  return {
    label: baseClasses.label,
    input: baseClasses.input,
    button: twMerge(baseClasses.button, sizeClasses[uiSize].button),
    buttonOn: baseClasses.buttonOn,
    buttonOff: baseClasses.buttonOff,
    span: twMerge(baseClasses.span, sizeClasses[uiSize].span),
    spanOn: baseClasses.spanOn,
    spanOff: baseClasses.spanOff,
    text: twMerge(baseClasses.text, sizeClasses[uiSize].text),
  }
}

const cls = vue.computed(() => getClasses(uiSize))
</script>

<template>
  <label
    :class="[cls.label, disabled || isLocked ? 'opacity-50' : '']"
    :title="disabled ? 'Disabled' : (isLocked ? 'This toggle cannot be changed' : '')"
  >
    <input
      :class="cls.input"
      v-bind="attrs"
      type="checkbox"
      :value="isOn ? valueOn : valueOff"
      :checked="isOn"
      :disabled="disabled || isLocked"
      @input="handleInputChange($event.target)"
    >
    <button
      type="button"
      :aria-pressed="isOn ? 'true' : 'false'"
      :class="[cls.button, isOn ? cls.buttonOn : cls.buttonOff, isLocked ? 'cursor-default' : '']"
      @click.stop="toggle"
    >
      <span class="sr-only">{{ isOn ? "on" : "off" }}</span>

      <span
        aria-hidden="true"
        :class="[
          cls.span,
          isOn
            ? `translate-x-0 ${cls.spanOff}`
            : `translate-x-[calc(100%+4px)] ${cls.spanOn}`,
        ]"
      />
    </button>
    <span
      v-if="textOn || textOff || isLocked"
      id="toggleLabel"
      class="font-mono select-none"
      :class="cls.text"
    >
      <span v-if="isOn">{{ textOn }}</span>
      <span v-else>{{ textOff }}</span>
    </span>
  </label>
</template>
