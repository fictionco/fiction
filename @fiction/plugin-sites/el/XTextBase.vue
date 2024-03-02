<script lang="ts" setup>
import { clean, onResetUi, toHtml, toMarkdown, vue } from '@fiction/core'

const props = defineProps({
  tag: {
    type: String as vue.PropType<'h1' | 'h2' | 'h3' | 'div' | 'span' | 'p' | 'a'>,
    default: 'div',
  },
  placeholder: { type: String, default: '123' },
  isEditable: { type: Boolean, default: false },
  modelValue: { type: String, default: '' },
  isMarkdown: { type: Boolean, default: false },
})

const emit = defineEmits<{
  (event: 'input', payload: string): void
  (event: 'reset', payload: string): void
  (event: 'update:modelValue', payload: string): void
}>()
const isEditing = vue.ref(false)
const updateValue = vue.ref()

function getValue(rawValue: string) {
  const v = props.isMarkdown ? toMarkdown(rawValue) : rawValue

  return v
}

// only update model on blur to prevent cursor jumping
onResetUi(() => {
  isEditing.value = false
  const v = getValue(updateValue.value)

  if (v) {
    emit('reset', v)
    emit('update:modelValue', v)
    updateValue.value = ''
  }
})

function onInput(ev: Event) {
  updateValue.value = (ev.target as HTMLElement).innerHTML
  emit('input', getValue(updateValue.value))
}

function textValue() {
  const v = clean(props.modelValue || '')
  return props.isMarkdown ? toHtml(v) : v
}
</script>

<template>
  <component
    :is="tag"
    v-if="textValue()"
    class="focus:outline-none"
    :contenteditable="isEditable ? 'true' : 'false'"
    spellcheck="false"
    @input="onInput($event)"
    @click="isEditing = true"
    v-html="textValue()"
  />
</template>

<style lang="less">
[contentEditable="true"]:empty {
  &::before {
    content: attr(placeholder);
    opacity: 0.4;
  }

  &:hover:not(:focus)::before {
    cursor: pointer;
    opacity: 0.65;
  }

  &:focus::before {
    opacity: 0.2;
  }
}
</style>
