<template>
  <textarea
    ref="textareaElement"
    :class="[textInputClasses('basic'), modelValue ? 'set' : 'empty']"
    :value="modelValue"
    @input="send($event.target)"
  />
</template>

<script lang="ts" setup>
import { vue } from "@factor/api"
import { textInputClasses } from "./theme"
const props = defineProps({
  modelValue: { type: String, default: "" },
})

const emit = defineEmits<{
  (event: "update:modelValue", payload: string): void
}>()

const textareaElement = vue.ref<HTMLElement>()

const setHeight = (): void => {
  if (!textareaElement.value) return
  const ta = textareaElement.value

  const sh = textareaElement.value?.scrollHeight
  ta.style.height = `${sh}px`
}
vue.onMounted(() => setHeight())

vue.watch(
  () => props.modelValue,
  () => setHeight(),
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
