<script lang="ts" setup>
import type { StandardSize } from '@fiction/core'
import { vue } from '@fiction/core'
import { twMerge } from 'tailwind-merge'
import { getCheckboxClasses } from './theme'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  text: { type: String, default: '' },
  inputClass: { type: String, default: '' },
  uiSize: { type: String as vue.PropType<StandardSize>, default: 'md' },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: boolean): void
}>()

const attrs = vue.useAttrs()

function handleEmit(target: EventTarget | null): void {
  const el = target as HTMLInputElement
  emit('update:modelValue', el.checked)
}

function inputClasses() {
  return vue.computed(() => {
    const sel = props.modelValue ? 'bg-primary-500 dark:bg-primary-700' : ''
    return twMerge(cls.value.input, props.inputClass, sel)
  })
}

const cls = vue.computed(() => getCheckboxClasses(props.uiSize))
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <label :class="cls.label">
    <input
      v-bind="attrs"
      type="checkbox"
      :class="inputClasses().value"
      :checked="modelValue"
      @input="handleEmit($event.target)"
    >

    <span v-if="text" :class="cls.text">
      {{ text }}
    </span>
  </label>
</template>
