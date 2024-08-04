<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { StandardSize } from '@fiction/core'
import { twMerge } from 'tailwind-merge'

const props = defineProps({
  modelValue: { type: [Boolean, String], default: false },
  textOff: { type: String, default: '' },
  textOn: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  uiSize: { type: String as vue.PropType<StandardSize>, default: 'md' },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: boolean): void
}>()

const attrs = vue.useAttrs()

function em(v: boolean): void {
  if (props.disabled)
    return
  emit('update:modelValue', v)
}

function handleEmit(target: EventTarget | null): void {
  const el = target as HTMLInputElement
  em(el.checked)
}

const val = vue.computed<boolean>(() => {
  const mv = props.modelValue
  if (typeof mv === 'string') {
    if (mv === 'on' || mv === 'true')
      return true
    else return false
  }
  else { return mv }
})

function getClasses(uiSize: StandardSize) {
  const baseClasses = {
    label: 'toggle-wrap flex items-center py-1',
    input: 'absolute h-1 w-1 opacity-0',
    button: 'relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
    buttonOn: 'bg-primary-600',
    buttonOff: 'bg-theme-300 dark:bg-theme-700',
    span: 'inline-block rounded-full transition duration-200 ease-in-out ease-[cubic-bezier(0.25,1,0.33,1)]',
    spanOn: 'bg-primary-0 ring-primary-600',
    spanOff: 'bg-theme-0 ring-theme-300',
    text: 'text-theme-500 hover:text-primary ml-4 cursor-pointer font-sans text-medium tracking-tight',
  }

  const sizeClasses = {
    'xxs': { button: 'h-3 w-6', span: 'h-2 w-2', text: 'text-[0.6rem]' },
    'xs': { button: 'h-4 w-8', span: 'h-3 w-3', text: 'text-xs' },
    'sm': { button: 'h-5 w-10', span: 'h-4 w-4', text: 'text-sm' },
    'md': { button: 'h-6 w-12', span: 'h-5 w-5', text: 'text-base' },
    'lg': { button: 'h-7 w-14', span: 'h-6 w-6', text: 'text-lg' },
    'xl': { button: 'h-8 w-16', span: 'h-7 w-7', text: 'text-xl' },
    '2xl': { button: 'h-9 w-18', span: 'h-8 w-8', text: 'text-2xl' },
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

const cls = vue.computed(() => getClasses(props.uiSize))
</script>

<template>
  <label
    :class="[cls.label, disabled ? 'opacity-50' : '']"
    :title="disabled ? 'Disabled' : ''"
  >
    <input
      :class="cls.input"
      v-bind="attrs"
      type="checkbox"
      :value="val"
      :checked="val"
      @input="handleEmit($event.target)"
    >
    <button
      type="button"
      aria-pressed="false"
      :class="[cls.button, val === true ? cls.buttonOn : cls.buttonOff]"
      @click.stop="em(!val)"
    >
      <span class="sr-only">{{ val ? "on" : "off" }}</span>

      <span
        aria-hidden="true"
        :class="[
          cls.span,
          val === true
            ? `translate-x-[calc(100%+4px)] ${cls.spanOn}`
            : `translate-x-0 ${cls.spanOff}`,
        ]"
      />
    </button>
    <span
      v-if="textOn || textOff"
      id="toggleLabel"
      :class="cls.text"
    >
      <span v-if="val">{{ textOn }}</span>
      <span v-else>{{ textOff }}</span>
    </span>
  </label>
</template>
