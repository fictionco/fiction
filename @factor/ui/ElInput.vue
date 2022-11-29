<template>
  <div
    :key="label"
    class="f-el-input space-y-0.5"
    :class="[valid ? 'valid' : 'not-valid', attrs.class]"
  >
    <div
      v-if="label || description"
      class="text-input-label-size flex justify-between"
    >
      <div class="text flex items-center space-x-2 text-[.85em]">
        <label
          v-if="label"
          class="font-medium"
          :for="attrs.for"
          v-text="label"
        />
        <div v-if="description" class="group relative">
          <div
            class="i-carbon-information text-slate-500 hover:text-slate-400"
          ></div>
          <div
            class="bg-theme-0 absolute -left-4 z-30 mt-2 hidden w-56 origin-top-right rounded-md p-3 text-xs shadow-lg ring-1 ring-black/10 focus:outline-none group-hover:block"
          >
            {{ description }}
          </div>
        </div>
      </div>
    </div>
    <div class="input-area py-[.25em]">
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
  defaultValue: {
    type: [String, Object, Array, Number, Date, Boolean],
    default: undefined,
  },
})
const emit = defineEmits(["update:modelValue"])

if (props.defaultValue && props.modelValue === undefined) {
  emit("update:modelValue", props.defaultValue)
}

const attrs = vue.useAttrs() as {
  for?: string
  class?: string
  required?: string
}

const passAttrs = vue.computed(() => {
  const { class: _class, ...passAttrs } = attrs
  return passAttrs
})

const inputEl = vue.ref<vue.ComponentPublicInstance>()
const valid = vue.ref<boolean | undefined>()
const inputComponent = vue.computed(() => {
  if (props.input && typeof props.input == "string") {
    const r = inputs[props.input]
    return r as vue.Component
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
