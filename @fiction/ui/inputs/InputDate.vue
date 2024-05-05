<script lang="ts" setup>
import { dayjs, isDarkOrLightMode, vue } from '@fiction/core'
import { textInputClasses } from './theme'

const props = defineProps({
  modelValue: { type: [String], default: '' },
  inputClass: { type: String, default: '' },
  includeTime: { type: Boolean, default: false },
})
const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void
}>()

function handleEmit(target: EventTarget | null): void {
  const el = target as HTMLInputElement

  const isoValue = dayjs(el.value).toISOString()
  emit('update:modelValue', isoValue)
}

const inputValue = vue.computed(() => {
  return dayjs(props.modelValue).format(props.includeTime ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD')
})

const dateEl = vue.ref<HTMLInputElement>()
const mode = vue.ref<'dark' | 'light'>()
vue.onMounted(() => {
  mode.value = isDarkOrLightMode(dateEl.value)
})
</script>

<template>
  <input
    ref="dateEl"
    :data-value="modelValue"
    :class="textInputClasses({ inputClass })"
    :type="includeTime ? 'datetime-local' : 'date'"
    :value="inputValue"
    :style="{ colorScheme: mode }"
    @input="handleEmit($event.target)"
  >
</template>
