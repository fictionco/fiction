<template>
  <div class="max-w-input">
    <div
      class="bar bg-theme-100 ring-theme-200 h-[2.5em] w-full rounded-t-[.5em] ring-1 ring-inset"
      :style="{ 'background-image': gradientCss }"
    ></div>

    <div class="border-theme-200 rounded-b-[.5em] border-x border-b">
      <div
        ref="colorEl"
        class="color-wrap flex flex-wrap items-center p-[.5em]"
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
          <div class="flex flex-col">
            <div
              class="text-theme-400 hover:text-theme-500 cursor-move items-center p-0.5"
            >
              <div class="i-carbon-draggable text-xs"></div>
            </div>
          </div>
        </div>
        <div
          class="text-theme-500 hover:text-theme-600 flex cursor-pointer items-center p-[.3em] text-xs"
          @click="addColor()"
        >
          <div class="i-carbon-add"></div>
          Add Color
        </div>
      </div>
      <div class="flex shrink-0 items-center space-x-2 p-[.5em]">
        <InputRange
          prefix="Angle"
          min="0"
          max="360"
          step="1"
          :model-value="modelValue?.angle"
          @update:model-value="updateField('angle', $event)"
        ></InputRange>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
// @unocss-include
import { vue, DraggableList } from "@factor/api"
import InputColor from "./InputColor.vue"
import InputRange from "./InputRange.vue"
import { getGradientCss } from "./utils"
const colorEl = vue.ref<HTMLElement>()

/**
 * Renderkey is needed for drag and drop
 * to re-render the list when it changes
 */
const renderKey = vue.ref(0)
type GradientItem = { color?: string; percent?: number; colorId?: string }
type GradientSetting = {
  angle?: number
  stops?: GradientItem[]
  css?: string
}

const props = defineProps({
  modelValue: {
    type: Object as vue.PropType<GradientSetting>,
    default: undefined,
  },
})

const emit = defineEmits<{
  (event: "update:modelValue", payload: GradientSetting): void
}>()

const gradientCss = vue.computed(() => {
  return getGradientCss(props.modelValue)
})

const updateValue = async (value: GradientSetting): Promise<void> => {
  value.css = getGradientCss(value)
  emit("update:modelValue", value)
}

const updateField = async (field: string, value: unknown): Promise<void> => {
  const newValue = { ...props.modelValue, [field]: value }
  await updateValue(newValue)
}

const colorList = vue.computed<GradientItem[]>(() => {
  return props.modelValue?.stops || [{}, {}]
})

const addColor = async () => {
  const newValue = { ...props.modelValue, stops: [...colorList.value, {}] }
  await updateValue(newValue)
}

const removeColor = async (index: number) => {
  const newValue = {
    ...props.modelValue,
    stops: colorList.value.filter((_, i) => i != index),
  }
  await updateValue(newValue)
}

const updateColor = async (index: number, color: string) => {
  if (!color) {
    await removeColor(index)
  } else {
    const value = props.modelValue || {}
    const list = colorList.value
    list[index].color = color
    value.stops = list
    await updateValue(value)
  }
}
vue.onMounted(async () => {
  const wrap = colorEl.value
  const ddUpdate = async () => {
    const v = props.modelValue || {}
    const newStops: GradientItem[] = []

    wrap?.querySelectorAll(".color-item[data-color]").forEach((el) => {
      const element = el as HTMLElement
      const color = element.dataset.color

      if (color) {
        const item = colorList.value.find((i) => i.color == color)

        if (item) {
          newStops.push(item)
        }
      }
    })

    if (newStops.length > 0) {
      v.stops = newStops
      renderKey.value++

      await updateValue(v)
    }
  }
  new DraggableList({
    wrapClass: "color-wrap",
    draggableClass: "color-item",
    ghostClasses: ["ring-4", "ring-theme-100", "ring-offset-2"],
    onUpdate: () => ddUpdate(),
  })
})
</script>
