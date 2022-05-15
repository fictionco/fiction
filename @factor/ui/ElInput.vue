<template>
  <div
    :key="label"
    class="f-el-input"
    :class="[valid ? 'valid' : 'not-valid', attrs.class]"
  >
    <div
      v-if="label || description"
      class="mb-1.5 flex justify-between text-sm"
    >
      <div class="text">
        <label
          v-if="label"
          class="font-semibold"
          :for="attrs.for"
          v-text="label"
        />
        <div v-if="description" class="text-slate-500" v-text="description" />
      </div>

      <div v-if="isRequired" class="valid-marker">
        <div v-if="typeof valid === 'undefined'" />
        <div v-else-if="!valid" class="not-valid">
          <span
            class="group inline-flex items-center rounded px-2 py-0.5 text-xs font-medium text-red-700 hover:bg-red-100"
          >
            <span class="opacity-0 group-hover:opacity-80">Required</span>
            <svg
              class="ml-1.5 h-2 w-2 text-red-400"
              fill="currentColor"
              viewBox="0 0 8 8"
            >
              <circle cx="4" cy="4" r="3" />
            </svg>
          </span>
        </div>
        <div v-else class="valid">
          <span
            class="group inline-flex items-center rounded px-2 py-0.5 text-xs font-medium text-green-500 hover:bg-green-100"
          >
            <span class="opacity-0 group-hover:opacity-80">Valid</span>
            <svg
              class="ml-1.5 h-2 w-2 text-green-400"
              fill="currentColor"
              viewBox="0 0 8 8"
            >
              <circle cx="4" cy="4" r="3" />
            </svg>
          </span>
        </div>
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
  input: { type: String as vue.PropType<keyof typeof inputs>, default: "" },
})
const emit = defineEmits(["update:modelValue"])

const attrs = vue.useAttrs() as {
  for?: string
  class?: string
  required?: string
}

const { class: _class, ...passAttrs } = attrs

const isRequired = vue.computed(() =>
  typeof attrs.required != "undefined" ? true : false,
)
// const isDisabled = computed(() =>
//   typeof attrs.disabled != "undefined" ? true : false,
// )
const inputEl = vue.ref<vue.ComponentPublicInstance>()
const valid = vue.ref<boolean | undefined>()
const inputComponent = vue.computed(() => {
  return props.input ? inputs[props.input] : ""
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
