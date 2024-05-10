<script lang="ts" setup>
import { clean, onResetUi, shortId, toHtml, toMarkdown, vue } from '@fiction/core'

import { animateItemEnter, splitLetters, useElementVisible } from '../anim'

const props = defineProps({
  tag: {
    type: String as vue.PropType<'h1' | 'h2' | 'h3' | 'div' | 'span' | 'p' | 'a'>,
    default: 'div',
  },
  placeholder: { type: String, default: '' },
  isEditable: { type: Boolean, default: false },
  modelValue: { type: String, default: '' },
  isMarkdown: { type: Boolean, default: false },
  animate: { type: [String, Boolean] as vue.PropType<'rise' | 'fade' | boolean>, default: undefined },
  prefix: { type: String, default: '' },
  suffix: { type: String, default: '' },
})

const emit = defineEmits<{
  (event: 'input', payload: string): void
  (event: 'reset', payload: string): void
  (event: 'update:modelValue', payload: string): void
}>()

const randomId = shortId()

const loaded = vue.ref(false)
const isEditing = vue.ref<string | undefined>()
const textValue = vue.ref('')
const updateValue = vue.ref('')

function getValue(rawValue: string) {
  const v = props.isMarkdown ? toMarkdown(rawValue) : rawValue

  return v
}

// set the displayed text, only do this when not editing
// as any reactive change bounces the cursor to the start
function setTextValue() {
  textValue.value = updateValue.value = valueFromModelValue()
}

function valueFromModelValue() {
  const v = clean(props.modelValue || '')
  const out = props.isMarkdown ? toHtml(v) : v

  return `${props.prefix}${out}${props.suffix}`
}

function handleBlur() {
  isEditing.value = undefined
  emitValue()
  setTextValue()
}

function onInput(ev: Event) {
  updateValue.value = (ev.target as HTMLElement).innerHTML
  emit('input', getValue(updateValue.value))
  emitValue()
}

function emitValue() {
  const v = getValue(updateValue.value)
  if (typeof v !== 'undefined') {
    emit('reset', v)
    emit('update:modelValue', v)
  }
}

// watch model value when not editing
vue.watchEffect(() => {
  if (isEditing.value)
    return

  setTextValue()
})

const hasAnimation = vue.computed(() => props.animate && !isEditing.value)

function loadAnimation() {
  splitLetters(`#${randomId}`)

  const themeId = typeof props.animate == 'string' ? props.animate : 'rise'

  useElementVisible({
    selector: `#${randomId}`,
    onVisible: () => {
      loaded.value = true
      animateItemEnter({ targets: `#${randomId} .fx`, themeId })
    },
  })
}

vue.onMounted(() => {
  if (hasAnimation.value && !props.isEditable)
    loadAnimation()
  else
    loaded.value = true
})

function onPaste(event: ClipboardEvent) {
  event.preventDefault() // Prevent the default paste action
  const text = event.clipboardData?.getData('text/plain') || '' // Get plain text from clipboard
  textValue.value = clean(text) // Clean and set the updated value
  updateValue.value = textValue.value // Update the value
  emit('input', getValue(updateValue.value)) // Emit input event
  emitValue() // Emit value update
}
</script>

<template>
  <component
    :is="tag"
    v-if="(isEditable && placeholder) || textValue"
    :id="randomId"
    class="focus:outline-none xtext"
    :class="loaded ? '' : 'invisible'"
    :contenteditable="isEditable ? 'true' : 'false'"
    spellcheck="false"
    :placeholder="placeholder"
    @input="onInput($event)"
    @paste="onPaste($event)"
    @click="isEditing = 'click'"
    @focus="isEditing = 'focus'"
    @blur="handleBlur()"
    v-html="textValue"
  />
</template>

<style lang="less">
.xtext{
  --ph-color: var(--theme-500);
}
.dark &:not(.light *) .xtext{
  --ph-color: var(--theme-600);
}
[contentEditable="true"]:empty {
  &::before {
    content: attr(placeholder);
    color: rgba(var(--ph-color) / 0.8);
  }

  &:hover:not(:focus)::before {
    cursor: pointer;
    color: rgba(var(--ph-color) / 0.5);
  }

  &:focus::before {
    color: rgba(var(--ph-color) / 0.3);
  }
}

.xtext{
  .word {
    display: inline; /* ensures words do not break */
    white-space: nowrap; /* prevents words from wrapping */
  }

  .fx {
    display: inline-block; /* keeps each letter block for individual animation */
    line-height: 1em;
  }
}
</style>
