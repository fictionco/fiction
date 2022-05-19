<template>
  <div
    :key="label"
    class="f-el-input space-y-1.5"
    :class="[valid ? 'valid' : 'not-valid', attrs.class]"
  >
    <div
      v-if="label || description"
      class="flex justify-between text-input-label-size"
    >
      <div class="text">
        <label
          v-if="label"
          class="font-medium"
          :for="attrs.for"
          v-text="label"
        />
        <div v-if="description" class="text-slate-500" v-text="description" />
      </div>
    </div>
    <div class="input-area">
      <component
        :is="inputComponent"
        v-if="inputComponent"
        ref="inputEl"
        :model-value="modelValue"
        v-bind="passAttrs"
        @update:model-value="updateValue($event)"
      >
        <slot />
      </component>
      <slot v-else />
      <slot name="after" />
    </div>
  </div>
</template>
<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script lang="ts" setup>
import { vue } from "@factor/api"
import { inputs } from "./inputs"

const props = defineProps({
  modelValue: {
    type: [String, Object, Array, Number, Date, Boolean],
    default: undefined,
  },
  label: { type: String, default: "" },
  description: { type: String, default: "" },
  input: {
    type: [String, Object] as vue.PropType<keyof typeof inputs | vue.Component>,
    default: undefined,
  },
})
const emit = defineEmits(["update:modelValue"])

const attrs = vue.useAttrs() as {
  for?: string
  class?: string
  required?: string
}

const { class: _class, ...passAttrs } = attrs

const inputEl = vue.ref<vue.ComponentPublicInstance>()
const valid = vue.ref<boolean | undefined>()
const inputComponent = vue.computed(() => {
  if (props.input && typeof props.input == "string") {
    return inputs[props.input]
  } else {
    return props.input || ""
  }
})

/**
 * Set the validity of the input using the native constraint API
 */
const setValidity = async (): Promise<void> => {
  const el = inputEl.value?.$el as HTMLElement | HTMLInputElement

  if (el) {
    if (
      (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) &&
      el.checkValidity
    ) {
      valid.value = el.checkValidity()
    } else if (el.querySelector) {
      const realEl = el.querySelector("input") ?? el.querySelector("select")

      // for regular inputs
      if (realEl && realEl.checkValidity) {
        valid.value = realEl.checkValidity()
      } else valid.value = true
    }
  }
}

const updateValue = async (value: any): Promise<void> => {
  await setValidity()
  emit("update:modelValue", value)
}

vue.onMounted(() => {
  // Let the child els load
  setTimeout(async () => {
    await setValidity()
  }, 300)
})
</script>
