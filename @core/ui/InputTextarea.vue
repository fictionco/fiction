<template>
  <textarea
    ref="textareaElement"
    class="
      f-input
      block
      w-full
      appearance-none
      px-3
      py-2
      rounded-md
      border border-bluegray-400
      placeholder-bluegray-400
      focus:outline-none focus:ring-primary-500 focus:border-primary-500
      disabled:cursor-not-allowed disabled:text-bluegray-500 disabled:bg-gray-50
      standard-textarea
    "
    :class="modelValue ? 'set' : 'empty'"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
  {{ modelValue }}
</template>

<script lang="ts">
import { onMounted, ref, watch } from "vue"
export default {
  props: {
    modelValue: { type: String, default: "" },
  },
  emits: ["update:modelValue"],

  setup(props) {
    const textareaElement = ref<HTMLElement>()

    const setHeight = (): void => {
      if (!textareaElement.value) return
      const ta = textareaElement.value

      const sh = textareaElement.value?.scrollHeight
      ta.style.height = `${sh}px`
    }
    onMounted(() => {
      setHeight()
    })

    watch(
      () => props.modelValue,
      () => {
        setHeight()
      },
    )

    return { textareaElement }
  },
}
</script>

<style lang="less">
textarea.standard-textarea {
  width: 100%;
  min-height: 5em;
  line-height: 1.5;
}
</style>
