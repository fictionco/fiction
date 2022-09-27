<template>
  <div class="space-y-4">
    <ElInput
      class=""
      input="InputGradient"
      label="Overlay Color"
      :model-value="modelValue?.gradient"
      @update:model-value="updateField('gradient', $event)"
    ></ElInput>
    <ElInput
      class=""
      input="InputRange"
      label="Overlay Opacity"
      :list="blendModes"
      :model-value="modelValue?.opacity"
      @update:model-value="updateField('opacity', $event)"
    ></ElInput>
    <ElInput
      class=""
      input="InputSelect"
      label="Overlay Blend Mode"
      :list="blendModes"
      :model-value="modelValue?.blendMode"
      @update:model-value="updateField('blendMode', $event)"
    ></ElInput>
  </div>
</template>
<script lang="ts" setup>
// @unocss-include
import { vue } from "@factor/api"
import ElInput from "./ElInput.vue"
import { OverlaySetting } from "./utils"

const props = defineProps({
  modelValue: {
    type: Object as vue.PropType<OverlaySetting>,
    default: undefined,
  },
})

const blendModes = [
  "normal",
  "overlay",
  "multiply",
  "screen",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "hard-light",
  "soft-light",
  "difference",
  "exclusion",
  "hue",
  "saturation",
  "color",
  "luminosity",
]

const emit = defineEmits<{
  (event: "update:modelValue", payload: OverlaySetting): void
}>()

const updateValue = async (value: OverlaySetting): Promise<void> => {
  emit("update:modelValue", value)
}

const updateField = async (field: string, value: unknown): Promise<void> => {
  const newValue = { ...props.modelValue, [field]: value }
  await updateValue(newValue)
}
</script>
