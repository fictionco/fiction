<script lang="ts" setup>
import type { NavListItem, StandardSize } from '@fiction/core'
import { normList, vue } from '@fiction/core'
import XButton from '../buttons/XButton.vue'

defineOptions({ name: 'InputRadioButton' })

const { modelValue, list = [], uiSize = 'xs', defaultValue } = defineProps<{
  modelValue?: string | number
  list?: NavListItem[]
  uiSize?: StandardSize
  defaultValue?: string | number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number | undefined]
}>()

const attrs = vue.useAttrs()

const parsedList = vue.computed(() => normList(list))

// set default value if modelValue is not set
if (!modelValue && defaultValue)
  emit('update:modelValue', defaultValue)

// Simple size downscaling map
const buttonSize = vue.computed(() => {
  const sizes: Record<string, StandardSize> = { 'sm': 'xxs', 'md': 'xs', 'lg': 'sm', 'xl': 'md', '2xl': 'lg' }
  return sizes[uiSize] || uiSize
})

const sizeClasses = vue.computed(() => {
  const sizes = {
    'xxs': { wrap: 'gap-0.5 py-0.5' },
    'xs': { wrap: 'gap-1 py-0.5' },
    'sm': { wrap: 'gap-1.5 py-0.5' },
    'md': { wrap: 'gap-2 py-1' },
    'lg': { wrap: 'gap-3 py-2' },
    'xl': { wrap: 'gap-4 py-3' },
    '2xl': { wrap: 'gap-5 py-4' },
  }

  return sizes[uiSize] || sizes.sm
})

function update(value?: string | number): void {
  if (attrs.disabled)
    return

  emit('update:modelValue', value)
}
</script>

<template>
  <div
    class="inline-flex rounded-lg shadow-sm isolate flex-wrap "
    role="radiogroup"
    :class="sizeClasses.wrap"
    :data-ui-size="uiSize"
  >
    <XButton
      v-for="(item) in parsedList"
      :key="item.value"
      :data-test-id="`radio-button-${item.value}`"
      :theme="modelValue === item.value ? 'primary' : 'default'"
      role="radio"
      design="solid"
      :aria-checked="modelValue === item.value"
      rounding="md"
      :size="buttonSize"
      :icon="item.icon"
      :icon-after="item.iconAfter"
      :disabled="!!$attrs.disabled"
      @click.prevent="update(item.value)"
    >
      {{ item.label }}
    </XButton>
  </div>
</template>
