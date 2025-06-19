<script lang="ts" setup>
import type { ListItem, StandardSize } from '@fiction/core'
import { normalizeList, vue } from '@fiction/core'
import { textInputClasses } from './theme'

defineOptions({ name: 'InputSelect' })

const props = defineProps({
  defaultValue: { type: [Number, String, Boolean], default: '' },
  modelValue: { type: [Number, String, Boolean], default: '' },
  list: { type: Array as vue.PropType<(ListItem | 'divider' | string)[]>, default: () => [] },
  suffix: { type: String, default: '' },
  inputClass: { type: String, default: '' },
  uiSize: { type: String as vue.PropType<StandardSize>, default: 'md' },
  placeholder: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])
const attrs = vue.useAttrs()

if (!props.modelValue && props.defaultValue)
  emit('update:modelValue', props.defaultValue)

const parsedList = vue.computed<ListItem[]>(() => {
  return props.list
    ? normalizeList(props.list, { suffix: props.suffix })
    : []
})
</script>

<template>
  <div class="relative">
    <select
      :value="modelValue"
      :class="textInputClasses({ inputClass, uiSize })"
      :data-size="uiSize"
      class="pr-8 cursor-pointer"
      @input="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option value>
        {{ placeholder || "Select" }}
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
    <!-- Chevron -->
    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      <svg class="h-4 w-4 text-theme-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</template>
