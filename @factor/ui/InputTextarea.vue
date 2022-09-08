<template>
  <textarea
    ref="textareaElement"
    class="no-scrollbar"
    spellcheck="false"
    :class="[textInputClasses(), modelValue ? 'set' : 'empty']"
    :value="modelValue"
    rows="1"
    @input="send($event.target)"
  />
</template>

<script lang="ts" setup>
import { vue, onResetUi } from "@factor/api"
import { textInputClasses } from "./theme"
defineProps({
  modelValue: { type: String, default: "" },
})

const emit = defineEmits<{
  (event: "update:modelValue", payload: string): void
}>()

const textareaElement = vue.ref<HTMLElement>()

const setHeight = (): void => {
  if (!textareaElement.value) return
  const ta = textareaElement.value
  ta.style.height = "auto"
  const sh = textareaElement.value?.scrollHeight
  ta.style.height = `${sh}px`
}
vue.onMounted(() => setHeight())
onResetUi(() => setHeight())

// vue.watch(
//   () => props.modelValue,
//   () => setHeight(),
// )

const send = (el: EventTarget | null): void => {
  setHeight()
  const elem = el as HTMLInputElement
  const txt = elem.value
  emit("update:modelValue", txt)
}
</script>

<style lang="less">
textarea.standard-textarea {
  width: 100%;
  min-height: 5em;
  line-height: 1.5;
}
</style>
