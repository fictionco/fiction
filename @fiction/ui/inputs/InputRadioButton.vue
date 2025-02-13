<script lang="ts" setup>
import type { NavListItem, StandardSize } from '@fiction/core'
import { normList, vue } from '@fiction/core'
import XButton from '../buttons/XButton.vue'

const { modelValue, list = [], uiSize = 'sm' } = defineProps<{
  modelValue?: string | number
  list?: NavListItem[]
  uiSize?: StandardSize
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number | undefined]
}>()

const parsedList = vue.computed(() => normList(list))

const sizeClasses = vue.computed(() => {
  const sizes = {
    'xxs': { wrap: 'gap-0.5' },
    'xs': { wrap: 'gap-1' },
    'sm': { wrap: 'gap-1.5' },
    'md': { wrap: 'gap-2' },
    'lg': { wrap: 'gap-2' },
    'xl': { wrap: 'gap-2.5' },
    '2xl': { wrap: 'gap-3' },
  }

  return sizes[uiSize] || sizes.sm
})
</script>

<template>
  <div
    class="inline-flex rounded-lg shadow-sm isolate flex-wrap"
    role="radiogroup"
    :class="sizeClasses.wrap"
  >
    <XButton
      v-for="(item) in parsedList"
      :key="item.value"
      :data-test-id="`radio-button-${item.value}`"
      :theme=" modelValue === item.value ? 'primary' : 'default'"
      role="radio"
      :aria-checked="modelValue === item.value"
      rounding="md"
      :size="uiSize"
      :icon="item.icon"
      :icon-after="item.iconAfter"
      @click.prevent="emit('update:modelValue', item.value)"
    >
      {{ item.label }}
    </XButton>
  </div>
</template>
