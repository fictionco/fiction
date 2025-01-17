<script lang="ts" setup>
import type { GradientPoint, GradientSetting, StandardSize } from '@fiction/core'
import { getGradientCss, shortId, vue } from '@fiction/core'
import XButton from '../buttons/XButton.vue'
import EffectDraggableSort from '../effect/EffectDraggableSort.vue'
import InputRange from './InputRange.vue'

defineOptions({ name: 'InputGradient' })

const { modelValue, uiSize = 'md' } = defineProps<{
  modelValue?: GradientSetting
  uiSize: StandardSize
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: GradientSetting | undefined): void
}>()

const sizing = vue.computed(() => {
  const sz = {
    'xxs': { preview: 'h-3' },
    'xs': { preview: 'h-4' },
    'sm': { preview: 'h-6' },
    'md': { preview: 'h-8' },
    'lg': { preview: 'h-10' },
    'xl': { preview: 'h-12' },
    '2xl': { preview: 'h-14' },
  }

  return sz[uiSize]
})

const renderKey = vue.ref(0)

const gradientCss = vue.computed(() => getGradientCss(modelValue))

function getDefaultStop(): GradientPoint {
  return { color: '#ffffff', opacity: 1, position: 0 }
}

type KeyedItem = GradientPoint & { _key?: string }

const keyedStops = vue.computed<KeyedItem[]>(() => {
  const stops = (modelValue?.stops || []) as KeyedItem[]

  return stops.map(stop => ({
    ...stop,
    _key: stop._key || shortId(),
  }))
})

async function updateValue(value?: GradientSetting): Promise<void> {
  if (value) {
    value.css = getGradientCss(value)
  }

  emit('update:modelValue', value)
}

async function updateField(field: string, value: unknown): Promise<void> {
  const newValue = { ...modelValue, [field]: value }
  await updateValue(newValue)
}

async function addColor() {
  const lastStop = keyedStops.value[keyedStops.value.length - 1]
  const prevPosition = lastStop?.position ?? 0
  const newPosition = Math.min(prevPosition + 25, 100)

  const newStop: KeyedItem = {
    ...getDefaultStop(),
    position: newPosition,
    color: '#808080',
    opacity: 0.2,
    _key: shortId(),
  }
  const newValue = {
    ...modelValue,
    stops: [...keyedStops.value, newStop],
  }
  await updateValue(newValue)
}

async function removeColor(index: number) {
  const newValue = {
    ...modelValue,
    stops: keyedStops.value.filter((_, i) => i !== index),
  }

  if (newValue.stops.length === 0) {
    await updateValue(undefined)
  }
  else {
    await updateValue(newValue)
  }
}

async function updateColor(index: number, updates: Partial<GradientPoint>) {
  const value = modelValue || {}
  const list = [...keyedStops.value]
  list[index] = { ...list[index], ...updates }
  value.stops = list
  await updateValue(value)
}

async function handleDragSort(keys: string[]) {
  const sorted = keys.map((key) => {
    const stop = keyedStops.value.find(s => s._key === key)
    return stop || getDefaultStop()
  })

  const newValue = { ...modelValue, stops: sorted }
  await updateValue(newValue)
  renderKey.value++
}

const colorPickerClasses = [
  'f-color-picker',
  'cursor-pointer',
  'ring-theme-300',
  'dark:ring-theme-200',
  'ring-2',
  'rounded-md',
  'active:opacity-75',
  'flex',
]
</script>

<template>
  <div class="max-w-input border border-theme-300/70 dark:border-theme-600 rounded-md p-3 space-y-3">
    <!-- Preview Bar -->
    <div
      class="hover:opacity-80 bar bg-theme-50 text-white text-center text-[10px] font-sans flex items-center justify-center dark:bg-theme-800 grow rounded-lg border-2 border-theme-300 dark:border-theme-600"
      :class="sizing.preview"
      :style="{ 'background-image': gradientCss }"
    >
      <span class="mix-blend-overlay font-bold">Gradient Preview</span>
    </div>

    <div v-if="!keyedStops?.length" class="p-4 text-xs font-sans text-center text-theme-500 dark:text-theme-600">
      No Color Stops Added
    </div>

    <!-- Color Stops -->
    <EffectDraggableSort
      v-else
      :key="renderKey"
      class="space-y-2"
      drag-handle="[data-drag-handle]"
      @update:sorted="($event) => handleDragSort($event)"
    >
      <div
        v-for="(stop, i) in keyedStops"
        :key="stop._key"
        class="color-item group flex items-center gap-3 p-2 bg-theme-100/50 dark:bg-theme-800/50 rounded-lg"
        :data-color="stop.color"
        :data-drag-id="stop._key"
      >
        <!-- Drag Handle & Color -->
        <div class="flex items-center gap-2">
          <div data-drag-handle class="i-tabler-grip-vertical text-theme-400/80 hover:text-theme-500 cursor-move" />
          <div class="relative" :for="`stop-${i}`">
            <span
              class="wrap relative"
              :style="{ background: stop.color || `rgba(255,255,255,.5)` }"
              :class="colorPickerClasses"
            >
              <input
                :id="`stop-${i}`"
                type="color"
                class="size-[1.5em] cursor-pointer opacity-0"
                :value="stop.color || '#edf1f3'"
                @input="updateColor(i, { color: ($event.target as HTMLInputElement)?.value })"
              >
            </span>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex flex-col gap-1.5 grow">
          <!-- Position -->
          <div class="flex items-center gap-2" title="Stop Position">
            <div class="i-tabler-arrows-horizontal text-theme-400 text-sm" />

            <InputRange
              class="grow"
              min="0"
              max="100"
              step="1"
              :hide-value="true"
              :model-value="stop.position"
              @update:model-value="updateColor(i, { position: $event })"
            />

            <span class="text-[10px] font-mono font-medium text-theme-500 dark:text-theme-400 text-right tabular-nums">
              {{ stop.position }}%
            </span>
          </div>

          <!-- Opacity -->
          <div class="flex items-center gap-2" title="Stop Opacity">
            <div class="i-tabler-contrast-filled text-theme-400 text-sm" />

            <InputRange
              class="grow"
              min="0"
              max="1"
              step="0.01"
              :hide-value="true"
              :model-value="stop.opacity"
              @update:model-value="updateColor(i, { opacity: $event })"
            />
            <span class="text-[10px] font-mono font-medium text-theme-500 dark:text-theme-400 text-right tabular-nums">
              {{ Math.round((stop.opacity || 1) * 100) }}%
            </span>
          </div>
        </div>

        <!-- Remove Button -->
        <button
          class="i-tabler-x text-theme-400/80 hover:text-red-500 shrink-0 cursor-pointer"
          @click.stop="removeColor(i)"
        />
      </div>
    </EffectDraggableSort>

    <!-- Bottom Controls -->
    <div class="flex shrink-0 items-center space-x-2 justify-between">
      <XButton
        theme="default"
        design="outline"
        class="shrink-0"
        size="xs"
        icon="i-tabler-plus"
        @click="addColor()"
      >
        Add Color
      </XButton>
      <div class="grow-0 flex gap-2 items-center" title="Gradient Angle">
        <div class="i-tabler-angle text-theme-400 text-sm" />
        <InputRange
          icon="i-tabler-angle"
          min="0"
          max="360"
          step="1"
          :hide-value="true"
          :model-value="modelValue?.angle"
          @update:model-value="updateField('angle', $event)"
        />
        <span class="text-[10px] font-mono font-medium text-theme-500 dark:text-theme-400 text-right tabular-nums">
          {{ modelValue?.angle || '90' }}°
        </span>
      </div>
    </div>
  </div>
</template>
