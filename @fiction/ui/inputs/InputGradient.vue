<script lang="ts" setup>
import { DraggableList, getGradientCss, vue } from '@fiction/core'
import type { GradientItem, GradientSetting } from '@fiction/core'
import InputColor from './InputColor.vue'
import InputRange from './InputRange.vue'

const props = defineProps({
  modelValue: { type: Object as vue.PropType<GradientSetting>, default: undefined },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: GradientSetting): void
}>()

const colorEl = vue.ref<HTMLElement>()
const visible = vue.ref(false)

/**
 * Renderkey is needed for drag and drop
 * to re-render the list when it changes
 */
const renderKey = vue.ref(0)
// type GradientItem = { color?: string, percent?: number, colorId?: string }
// type GradientSetting = {
//   angle?: number
//   stops?: GradientItem[]
//   css?: string
// }

const gradientCss = vue.computed(() => {
  return getGradientCss(props.modelValue)
})

async function updateValue(value: GradientSetting): Promise<void> {
  value.css = getGradientCss(value)
  emit('update:modelValue', value)
}

async function updateField(field: string, value: unknown): Promise<void> {
  const newValue = { ...props.modelValue, [field]: value }
  await updateValue(newValue)
}

const colorList = vue.computed<GradientItem[]>(() => {
  return props.modelValue?.stops || [{}, {}]
})

async function addColor() {
  const newValue = { ...props.modelValue, stops: [...colorList.value, {}] }
  await updateValue(newValue)
}

async function removeColor(index: number) {
  const newValue = {
    ...props.modelValue,
    stops: colorList.value.filter((_, i) => i !== index),
  }
  await updateValue(newValue)
}

async function updateColor(index: number, color: string) {
  if (color) {
    const value = props.modelValue || {}
    const list = colorList.value
    list[index] = { ...list[index], color }
    value.stops = list
    await updateValue(value)
  }
  else {
    await removeColor(index)
  }
}
vue.onMounted(async () => {
  const wrap = colorEl.value
  const ddUpdate = async () => {
    const v = props.modelValue || {}
    const newStops: GradientItem[] = []

    wrap?.querySelectorAll('.color-item[data-color]').forEach((el) => {
      const element = el as HTMLElement
      const color = element.dataset.color

      if (color) {
        const item = colorList.value.find(i => i.color === color)

        if (item)
          newStops.push(item)
      }
    })

    if (newStops.length > 0) {
      v.stops = newStops
      renderKey.value++

      await updateValue(v)
    }
  }
  new DraggableList({
    wrapClass: 'color-wrap',
    draggableClass: 'color-item',
    ghostClasses: ['ring-4', 'ring-theme-100', 'ring-offset-2'],
    onUpdate: () => ddUpdate(),
  }).init()
})
</script>

<template>
  <div class="max-w-input border border-theme-300/70 dark:border-theme-600 rounded-md p-3 space-y-3">
    <div class="flex justify-between items-center gap-6">
      <div class="flex items-center gap-2 cursor-pointer hover:opacity-70" @click="visible = !visible">
        <div class="i-tabler-background text-xl" />
        <div class="font-sans text-xs font-medium">
          Edit Gradient
        </div>
        <div class="i-tabler-chevron-down text-xl" :class="visible ? 'rotate-180' : ''" />
      </div>
      <div
        class="cursor-pointer hover:opacity-80 bar bg-theme-50 text-white/30 text-center text-[10px] font-sans flex items-center justify-center dark:bg-theme-700 h-6 grow rounded-full shadow-sm ring-2 ring-inset ring-theme-800/20"
        :style="{ 'background-image': gradientCss }"
        @click="visible = !visible"
      >
        Preview
      </div>
    </div>
    <div v-if="visible" class="space-y-3">
      <div class="  ">
        <div
          ref="colorEl"
          class="color-wrap flex flex-wrap items-center "
        >
          <div
            v-for="(c, i) in colorList"
            :key="`${i}-${renderKey}`"
            class="color-item my-1 mr-2 flex"
            :data-color="c.color"
            draggable="true"
          >
            <InputColor
              :model-value="c.color"
              @update:model-value="updateColor(i, $event)"
            />
            <div class="flex items-center">
              <div
                class="text-theme-400/80 hover:text-theme-500 cursor-move items-center p-0.5 text-sm i-tabler-grip-vertical"
              />
            </div>
          </div>
          <div
            class="text-theme-500 hover:text-theme-600 flex items-center space-x-1 cursor-pointer  p-[.3em] text-xs font-mono"
            @click="addColor()"
          >
            <div class="text-base i-tabler-plus" />
            <div>Color</div>
          </div>
        </div>
      </div>
      <div class="flex shrink-0 items-center space-x-2 ">
        <InputRange
          icon="i-tabler-angle"
          min="0"
          max="360"
          step="1"
          :model-value="modelValue?.angle"
          @update:model-value="updateField('angle', $event)"
        />
      </div>
    </div>
  </div>
</template>
