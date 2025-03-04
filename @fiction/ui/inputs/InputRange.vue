<script lang="ts" setup>
import { vue } from '@fiction/core'

defineOptions({ name: 'InputRange' })

const props = defineProps({
  modelValue: { type: [String, Number], default: undefined },
  min: { type: [String, Number], default: 0 },
  max: { type: [String, Number], default: undefined },
  step: { type: [String, Number], default: 1 },
  icon: { type: String, default: '' },
  hideValue: { type: Boolean, default: false },
  startValue: { type: Number, default: undefined },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload?: number): void
}>()

function toNumber(value: string | number | undefined): number {
  if (value === undefined || value === '')
    return Number.NaN
  const num = typeof value === 'string' ? Number.parseFloat(value) : value
  return Number.isNaN(num) ? 0 : num
}

const isDragging = vue.ref(false)

vue.onMounted(() => {
  if (props.startValue !== undefined && props.modelValue === undefined)
    emit('update:modelValue', props.startValue)
})

async function handleEmit(target: EventTarget | null): Promise<void> {
  const el = target as HTMLInputElement
  let v = toNumber(el.value)

  if (!isDragging.value && props.modelValue === undefined && props.startValue !== undefined) {
    isDragging.value = true
    v = props.startValue
  }

  emit('update:modelValue', Number(v.toFixed(5)))

  await vue.nextTick()

  const min = toNumber(props.min)
  const max = toNumber(props.max)

  if (!Number.isNaN(min) && v < min)
    emit('update:modelValue', Number(min.toFixed(5)))

  if (!Number.isNaN(max) && v > max)
    emit('update:modelValue', Number(max.toFixed(5)))
}

vue.watch(() => props.modelValue, (newVal) => {
  if (newVal === undefined)
    isDragging.value = false
})

const hasValue = vue.computed(() => props.modelValue !== undefined && props.modelValue !== '')
const inputValue = vue.computed(() => {
  if (props.modelValue !== undefined && props.modelValue !== '')
    return props.modelValue
  if (props.startValue !== undefined)
    return props.startValue
  return toNumber(props.min)
})

const displayValue = vue.computed(() => {
  if (!hasValue.value)
    return undefined
  const num = toNumber(props.modelValue)
  return num.toFixed(2)
})
</script>

<template>
  <div class="flex items-center gap-3">
    <span
      v-if="!hideValue"
      class="inline-flex min-w-[3em] items-center gap-1.5 rounded-full bg-theme-100 px-3 py-1 font-mono text-xs font-medium text-theme-600 dark:bg-theme-800 dark:text-theme-400"
    >
      <span v-if="icon" class="truncate opacity-80" :class="icon" />
      <span v-if="hasValue">{{ displayValue }}</span>
      <span v-else class="i-tabler-line-dashed text-sm" />
    </span>

    <div class="grow w-full">
      <input
        type="range"
        :value="inputValue"
        :min="min"
        :max="max"
        :step="step"
        class="block w-full cursor-pointer appearance-none rounded-lg bg-theme-200 dark:bg-theme-700 h-2"
        @input="handleEmit($event.target)"
      >
    </div>
  </div>
</template>

<style lang="less" scoped>
input[type="range"] {
  &::-webkit-slider-thumb {
    @apply size-4 appearance-none rounded-full bg-theme-600 ring-offset-1 transition hover:bg-theme-700 active:scale-95;
  }

  &::-moz-range-thumb {
    @apply size-4 appearance-none rounded-full bg-theme-600 ring-offset-1 transition hover:bg-theme-700 active:scale-95;
  }
}

// Dark mode styles need to be wrapped in a parent selector
.dark{
  input[type="range"] {
    &::-webkit-slider-thumb {
      @apply bg-primary-200 ring-primary-900/60 hover:bg-primary-100;
    }

    &::-moz-range-thumb {
      @apply bg-primary-200 ring-primary-900/60 hover:bg-primary-100;
    }
  }
}
</style>
