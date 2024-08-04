<script lang="ts" setup>
import { type StandardSize, onResetUi, vue } from '@fiction/core'
import { textInputClasses } from './theme'

const props = defineProps({
  modelValue: { type: String, default: '' },
  rows: { type: Number, default: undefined },
  inputClass: { type: String, default: '' },
  uiSize: { type: String as vue.PropType<StandardSize>, default: 'md' },
  maxHeight: { type: Number, default: 500 }, // New prop for max height
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void
}>()

const textareaWrapper = vue.ref<HTMLElement>()

const textareaElement = vue.ref<HTMLElement>()

function setHeight(): void {
  const ta = textareaElement.value
  const tw = textareaWrapper.value
  if (!ta || !tw)
    return

  tw.style.height = ta.style.height
  ta.style.height = 'auto'
  const newHeight = Math.min(ta.scrollHeight, props.maxHeight)
  ta.style.height = `${newHeight}px`
  tw.style.height = 'auto'
}
onResetUi(() => setHeight())

vue.onMounted(() => {
  const ta = textareaElement.value
  if (!ta)
    return

  setHeight()

  // ta.addEventListener("input", () => setHeight())

  vue.watch(
    () => props.modelValue,
    () => setHeight(),
  )
})

function send(el: EventTarget | null): void {
  setHeight()
  const elem = el as HTMLInputElement
  const txt = elem.value
  emit('update:modelValue', txt)
}
</script>

<script lang="ts">
export default { inheritAttrs: false }
</script>

<template>
  <div ref="textareaWrapper">
    <textarea
      v-bind="$attrs"
      ref="textareaElement"
      spellcheck="false"
      :class="[textInputClasses({ inputClass, uiSize }), modelValue ? 'set' : 'empty']"
      :value="modelValue"
      :rows="rows || 3"
      @input="send($event.target)"
    />
  </div>
</template>

<style lang="less">
textarea.standard-textarea {
  width: 100%;
  min-height: 5em;
  line-height: 1.5;
}
</style>
