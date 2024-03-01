<script lang="ts" setup>
import { onResetUi, vue } from '@factor/api'
import { textInputClasses } from './theme'

const props = defineProps({
  modelValue: { type: String, default: '' },
  rows: { type: Number, default: 1 },
  inputClass: { type: String, default: '' },
  maxHeight: { type: Number, default: 1000 }, // New prop for max height
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void
}>()

const textareaElement = vue.ref<HTMLElement>()

function setHeight(): void {
  const ta = textareaElement.value
  if (!ta)
    return

  // const sh = ta.scrollHeight

  ta.style.height = 'auto'
  const newHeight = Math.min(ta.scrollHeight, props.maxHeight)
  ta.style.height = `${newHeight}px`
}
vue.onMounted(() => setHeight())
onResetUi(() => setHeight())
vue.watch(
  () => props.modelValue,
  () => setHeight(),
)

vue.onMounted(() => {
  const ta = textareaElement.value
  if (!ta)
    return

  setHeight()

  // ta.addEventListener("input", () => setHeight())
})

function send(el: EventTarget | null): void {
  setHeight()
  const elem = el as HTMLInputElement
  const txt = elem.value
  emit('update:modelValue', txt)
}
</script>

<template>
  <textarea

    ref="textareaElement"
    data-what="12"
    spellcheck="false"
    :class="[textInputClasses({ inputClass }), modelValue ? 'set' : 'empty']"
    :value="modelValue"
    :rows="rows"
    @input="send($event.target)"
  />
</template>

<style lang="less">
textarea.standard-textarea {
  width: 100%;
  min-height: 5em;
  line-height: 1.5;
}
</style>
