<script lang="ts" setup>
import { shortId, toHtml, toMarkdown, vue } from '@fiction/core'
import { animateItemEnter, splitLetters, useElementVisible } from '../anim'

export type InputModes = 'text' | 'markdown' | 'html' | 'number' | 'email' | 'url' | 'password' | 'phone' | 'date'

const props = defineProps({
  tag: { type: String as vue.PropType<'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'span' | 'p' | 'a'>, default: 'div' },
  placeholder: { type: String, default: '' },
  isEditable: { type: Boolean, default: false },
  modelValue: { type: String, default: '' },
  isMarkdown: { type: Boolean, default: false },
  animate: { type: [String, Boolean] as vue.PropType<'rise' | 'fade' | boolean>, default: undefined },
  prefix: { type: String, default: '' },
  suffix: { type: String, default: '' },
  fallback: { type: String, default: '' },
  mode: { type: String as vue.PropType<InputModes>, default: 'text' },
})

const emit = defineEmits<{
  (event: 'input', payload: string): void
  (event: 'reset', payload: string): void
  (event: 'update:modelValue', payload: string): void
  (event: 'isEditing', payload: boolean): void
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

const isContentEditable = vue.computed(() => {
  return props.isEditable || isEditing.value
})

// set the displayed text, only do this when not editing
// as any reactive change bounces the cursor to the start
function setTextValue() {
  textValue.value = updateValue.value = valueFromModelValue()
}

function valueFromModelValue() {
  const v = props.modelValue || ''
  const out = props.isMarkdown ? toHtml(v) : v

  return `${props.prefix}${out}${props.suffix}`
}

function handleBlur() {
  isEditing.value = undefined
  emitValue()
  setTextValue()
}

function inputValidations(inputValue: string) {
  switch (props.mode) {
    case 'number':
      inputValue = inputValue.replace(/[^0-9.]/g, '')
      break
    case 'phone':
      inputValue = inputValue.replace(/\D/g, '')
      break
    // Handle basic input filtering for other modes if necessary
  }

  return inputValue
}

function onInput(ev: Event) {
  const inputValue = (ev.target as HTMLElement).innerHTML

  updateValue.value = inputValidations(inputValue)

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
  splitLetters({ selector: `#${randomId}` })

  const themeId = typeof props.animate == 'string' ? props.animate : 'rise'

  useElementVisible({
    caller: 'xText',
    selector: `[data-anim-id="${randomId}"]`,
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

  vue.watch(() => isEditing.value, () => {
    emit('isEditing', !!isEditing.value)
  })
})

function onPaste(event: ClipboardEvent) {
  event.preventDefault() // Prevent the default paste action
  const text = event.clipboardData?.getData('text/plain') || '' // Get plain text from clipboard
  textValue.value = text // Clean and set the updated value
  updateValue.value = textValue.value // Update the value
  emit('input', getValue(updateValue.value)) // Emit input event
  emitValue() // Emit value update
}

function setIsEditing(type: 'click' | 'focus') {
  if (isContentEditable.value) {
    isEditing.value = type
  }
}
</script>

<template>
  <component
    :is="tag"
    v-if="(isContentEditable && placeholder) || textValue || fallback"
    :data-anim-id="randomId"
    class="focus:outline-none xtext"
    :class="loaded ? '' : 'invisible'"
    :contenteditable="isContentEditable ? 'true' : 'false'"
    spellcheck="false"
    :placeholder="placeholder"
    @input="onInput($event)"
    @paste="onPaste($event)"
    @click="setIsEditing('click')"
    @focus="setIsEditing('focus')"
    @blur="handleBlur()"
    v-html="textValue || fallback"
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
    color: rgba(var(--ph-color) / 0.5);
  }

  &:hover:not(:focus)::before {
    cursor: pointer;
    color: rgba(var(--ph-color) / 0.3);
  }

  &:focus::before {
    color: rgba(var(--ph-color) / 0.2);
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
