<script lang="ts" setup>
import type { ListItem } from '@fiction/core'
import { normalizeList, vue } from '@fiction/core'

const props = defineProps({
  modelValue: { type: [Boolean], default: false },
  list: { type: Array as vue.PropType<ListItem[]>, default: () => [] },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: boolean): void
}>()
const selected = vue.ref<boolean>(props.modelValue)
const parsedList = normalizeList(props.list)
vue.watch(
  () => selected.value,
  (v) => {
    emit('update:modelValue', v)
  },
)

const classes = [
  'form-radio',
  'appearance-none',
  'border',
  'border-theme-300',
  'text-theme-500',
  'w-[.9em]',
  'h-[.9em]',
  'focus:border-theme-500',
  'focus:outline-none',
  'focus:ring-2',
  'focus:ring-theme-100',
  'focus:ring-offset-0',
]
</script>

<template>
  <div class="radio f-input">
    <label
      v-for="(option, i) in parsedList"
      :key="i"
      class="text-input-size my-2 flex cursor-pointer items-center"
      :for="String(option.value)"
    >
      <input
        :id="String(option.value)"
        v-model="selected"
        type="radio"
        :class="classes"
        name="radio-colors"
        :value="option.value"
        v-bind="$attrs"
      >
      <span class="text-theme-600 hover:text-theme-500 ml-[.5em]">{{
        option.name
      }}</span>
    </label>
  </div>
</template>
