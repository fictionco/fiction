<template>
  <div
    :key="label"
    class="f-el-input"
    :class="[
      valid ? 'valid' : 'not-valid',
      attrs.class && attrs.class.includes('my-') ? '' : 'my-8',
    ]"
  >
    <div v-if="label || description" class="flex justify-between mb-3">
      <div class="text">
        <label
          v-if="label"
          class="font-semibold"
          :for="attrs.for"
          v-text="label"
        />
        <div
          v-if="description"
          class="text-bluegray-500 text-sm"
          v-text="description"
        />
      </div>

      <div v-if="isRequired" class="valid-marker">
        <div v-if="typeof valid === 'undefined'" />
        <div v-else-if="!valid" class="not-valid">
          <span
            class="group inline-flex items-center px-2 py-0.5 rounded text-xs font-medium hover:bg-red-100 text-red-700"
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
            class="group inline-flex items-center px-2 py-0.5 rounded text-xs font-medium hover:bg-green-100 text-green-500"
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
        v-bind="attrs"
        @update:model-value="updateValue($event)"
      >
        <slot />
      </component>
      <slot v-else />
      <slot name="after" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { inputs } from "."
import {
  ComponentPublicInstance,
  computed,
  onMounted,
  PropType,
  ref,
  useAttrs,
} from "vue"

const props = defineProps({
  modelValue: {
    type: [String, Object, Array, Number, Date, Boolean],
    default: undefined,
  },
  label: { type: String, default: "" },
  description: { type: String, default: "" },
  input: { type: String as PropType<keyof typeof inputs>, default: "" },
})
const emit = defineEmits(["update:modelValue"])

const attrs = useAttrs()

const isRequired = computed(() =>
  typeof attrs.required != "undefined" ? true : false,
)
// const isDisabled = computed(() =>
//   typeof attrs.disabled != "undefined" ? true : false,
// )
const inputEl = ref<ComponentPublicInstance>()
const valid = ref<boolean | undefined>()
const inputComponent = computed(() => {
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
    } else {
      const realEl = el.querySelector("input") ?? el.querySelector("select")

      // for regular inputs
      if (realEl && realEl.checkValidity) {
        valid.value = realEl.checkValidity()
      } else valid.value = true
    }
  }
}

const updateValue = (value: any) => {
  setValidity()
  emit("update:modelValue", value)
}

onMounted(() => {
  // Let the child els load
  setTimeout(() => {
    setValidity()
  }, 300)
})
</script>
