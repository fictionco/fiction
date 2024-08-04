<script lang="ts" setup>
import type { StandardSize } from '@fiction/core'
import { vue } from '@fiction/core'
import { twMerge } from 'tailwind-merge'

const props = defineProps({
  min: { type: [String, Number], default: '1' },
  max: { type: [String, Number], default: '10' },
  modelValue: { type: [String, Number], default: '' },
  uiSize: { type: String as vue.PropType<StandardSize>, default: 'md' },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: number): void
}>()

const range = vue.computed(() => {
  const out = []
  const min = +props.min
  const max = +props.max
  for (let i = min; i <= max; i++)
    out.push(i)

  return out
})

function getClasses(uiSize: StandardSize) {
  const baseClasses = {
    container: 'relative z-0 inline-flex rounded-md shadow-sm',
    button: [
      'relative',
      'inline-flex',
      'items-center',
      'border',
      'focus:z-10',
      'focus:outline-none',
      'focus:border-primary',
    ],
    buttonActive: 'bg-primary-400 dark:bg-primary-600 border-primary-600 dark:border-primary-500 text-theme-0 z-20',
    buttonInactive: 'bg-theme-100 dark:bg-theme-800 text-theme-700 dark:text-theme-100 border-theme-300 dark:border-theme-600 hover:bg-theme-200 dark:hover:bg-theme-600 hover:border-theme-400 hover:z-20',
  }

  const sizeClasses = {
    'xxs': { button: 'px-1 py-0.5 text-xs' },
    'xs': { button: 'px-1.5 py-1 text-sm' },
    'sm': { button: 'px-2 py-1 text-base' },
    'md': { button: 'px-2.5 py-1.5 text-lg' },
    'lg': { button: 'px-3 py-2 text-xl' },
    'xl': { button: 'px-3.5 py-2.5 text-2xl' },
    '2xl': { button: 'px-4 py-3 text-3xl' },
  }

  return {
    container: baseClasses.container,
    button: twMerge(baseClasses.button, sizeClasses[uiSize].button),
    buttonActive: baseClasses.buttonActive,
    buttonInactive: baseClasses.buttonInactive,
  }
}

const cls = vue.computed(() => getClasses(props.uiSize))

function buttonClass(v: number, i: number): string {
  const classes = [cls.value.button]

  if (i === 0)
    classes.push('rounded-l-md')
  else if (i === range.value.length - 1)
    classes.push('rounded-r-md')

  if (i !== 0)
    classes.push('-ml-px')

  if (props.modelValue === v) {
    classes.push(cls.value.buttonActive)
  }
  else {
    classes.push(cls.value.buttonInactive)
  }

  return twMerge(classes)
}

function select(v: number): void {
  emit('update:modelValue', v)
}
</script>

<template>
  <span :class="cls.container">
    <button
      v-for="(r, i) in range"
      :key="i"
      type="button"
      :class="buttonClass(r, i)"
      @click="select(r)"
    >
      {{ r }}
    </button>
  </span>
</template>
