<script lang="ts" setup>
import type { ListItem, StandardSize } from '@fiction/core'
import { normalizeList, vue } from '@fiction/core'
import { textInputClasses } from './theme'

const props = defineProps({
  defaultValue: { type: [Number, String, Boolean], default: '' },
  modelValue: { type: [Number, String, Boolean], default: '' },
  list: { type: Array as vue.PropType<(ListItem | 'divider' | string)[]>, default: () => [] },
  suffix: { type: String, default: '' },
  inputClass: { type: String, default: '' },
  uiSize: { type: String as vue.PropType<StandardSize>, default: 'md' },
})

const emit = defineEmits(['update:modelValue'])
const attrs = vue.useAttrs()

if (!props.modelValue && props.defaultValue)
  emit('update:modelValue', props.defaultValue)

const parsedList = vue.computed<ListItem[]>(() => {
  return props.list
    ? normalizeList(props.list, {
      suffix: props.suffix,
    })
    : []
})
</script>

<template>
  <div>
    <select
      :value="modelValue"
      :class="textInputClasses({ inputClass, uiSize })"
      :data-size="uiSize"
      @input="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option disabled value>
        {{ attrs.placeholder || "Select" }}
      </option>
      <template v-for="s in parsedList" :key="s.value">
        <option v-if="s.value === 'divider'" disabled>
          ──────────
        </option>
        <option
          v-else
          :value="s.value"
          :disabled="!!s.disabled"
        >
          {{ s.label || s.name }}
        </option>
      </template>
    </select>
  </div>
</template>
