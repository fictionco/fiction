<script lang="ts" setup>
import type { UiElementSize } from '../utils'
import { dayjs, isDarkOrLightMode, vue } from '@fiction/core'
import { textInputClasses } from './theme'

const props = defineProps({
  modelValue: { type: [String], default: '' },
  inputClass: { type: String, default: '' },
  includeTime: { type: Boolean, default: false },
  dateMode: { type: String as vue.PropType<'future' | 'past' | 'any'>, default: 'any' },
  uiSize: { type: String as vue.PropType<UiElementSize>, default: 'md' },
})
const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void
}>()

function handleEmit(target: EventTarget | null): void {
  const el = target as HTMLInputElement

  const isoValue = dayjs(el.value).toISOString()
  emit('update:modelValue', isoValue)
}

const dateFormat = vue.computed(() => {
  return props.includeTime ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD'
})
const inputValue = vue.computed(() => {
  if (!props.modelValue)
    return ''

  const date = dayjs(props.modelValue)
  if (!date.isValid()) {
    return ''
  }

  return date.format(dateFormat.value)
})

const dateEl = vue.ref<HTMLInputElement>()
const mode = vue.ref<'dark' | 'light'>()
vue.onMounted(() => {
  mode.value = isDarkOrLightMode(dateEl.value)
})

const minDate = vue.computed(() => {
  return props.dateMode === 'future' ? dayjs().format(dateFormat.value) : undefined
})

const maxDate = vue.computed(() => {
  return props.dateMode === 'past' ? dayjs().format(dateFormat.value) : undefined
})
</script>

<template>
  <input
    ref="dateEl"
    name="date-input"
    :data-value="modelValue"
    :data-min-date="minDate"
    :data-max-date="maxDate"
    :class="textInputClasses({ inputClass, uiSize })"
    :type="includeTime ? 'datetime-local' : 'date'"
    :value="inputValue"
    :style="{ colorScheme: mode }"
    :min="minDate"
    :max="maxDate"
    @input="handleEmit($event.target)"
  >
</template>
