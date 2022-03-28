<template>
  <textarea
    ref="textareaElement"
    class="f-input standard-textarea block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-primary-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
    :class="modelValue ? 'set' : 'empty'"
    :value="modelValue"
    @input="send($event.target)"
  />
  {{ modelValue }}
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue"

const props = defineProps({
  modelValue: { type: String, default: "" },
})

const emit = defineEmits<{
  (event: "update:modelValue", payload: string): void
}>()

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

const send = (el: EventTarget | null): void => {
  const elem = el as HTMLInputElement
  emit("update:modelValue", elem.value)
}
</script>

<style lang="less">
textarea.standard-textarea {
  width: 100%;
  min-height: 5em;
  line-height: 1.5;
}
</style>
