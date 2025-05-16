<script lang="ts" setup>
import { shortId, vue } from '@fiction/core'
import { animateItemEnter, splitLetters, useElementVisible } from '../anim'

export type InputModes = 'text' | 'markdown' | 'html' | 'number' | 'email' | 'url' | 'password' | 'phone' | 'date'

defineOptions({ name: 'XText' })

const {
  tag = 'div',
  placeholder = '',
  isEditable = false,
  modelValue = '',
  animate = undefined,
  prefix = '',
  suffix = '',
  fallback = '',
  mode = 'text',
  disableFormatting = false,
} = defineProps<{
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'span' | 'p' | 'a' | 'RouterLink'
  placeholder?: string
  isEditable?: boolean
  modelValue?: string
  animate?: 'rise' | 'fade' | boolean
  prefix?: string
  suffix?: string
  fallback?: string
  mode?: InputModes
  disableFormatting?: boolean
}>()

const emit = defineEmits<{
  (event: 'input', payload: string): void
  (event: 'reset', payload: string): void
  (event: 'update:modelValue', payload: string): void
  (event: 'isEditing', payload: boolean): void
}>()

const attrs = vue.useAttrs()
const randomId = shortId()
const elementRef = vue.ref<HTMLElement>()
const loaded = vue.ref(false)
const isEditing = vue.ref<string | undefined>()
const textValue = vue.ref('')
const updateValue = vue.ref('')

function getValue(rawValue: string) {
  return rawValue
}

const isContentEditable = vue.computed(() => {
  return isEditable || isEditing.value
})

// set the displayed text, only do this when not editing
// as any reactive change bounces the cursor to the start
function setTextValue() {
  textValue.value = updateValue.value = valueFromModelValue()
}

function valueFromModelValue() {
  const v = modelValue || ''

  return `${prefix}${v}${suffix}`
}

function handleBlur() {
  isEditing.value = undefined
  emitValue()
  setTextValue()
}

function inputValidations(inputValue: string) {
  if (!inputValue || inputValue.trim() === '<br>')
    return ''

  if (disableFormatting) {
    // Strip all HTML tags and normalize whitespace to single spaces
    inputValue = inputValue.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ')
  }

  switch (mode) {
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

const hasAnimation = vue.computed(() => animate && !isEditing.value)

function loadAnimation() {
  const animId = `[data-anim-id="${randomId}"]`
  splitLetters({ selector: animId })

  const themeId = typeof animate == 'string' ? animate : 'fade'

  useElementVisible({
    caller: 'xText',
    selector: animId,
    onVisible: () => {
      loaded.value = true
      animateItemEnter({ targets: `${animId} .fx`, themeId })
    },
  })
}

vue.onMounted(() => {
  if (hasAnimation.value && !isEditable)
    loadAnimation()
  else
    loaded.value = true

  vue.watch(() => isEditing.value, () => {
    emit('isEditing', !!isEditing.value)
  })
})

// Clean up pasted content
function onPaste(event: ClipboardEvent) {
  event.preventDefault()

  const selection = window.getSelection()
  const range = selection?.getRangeAt(0)
  if (!selection || !range)
    return

  range.deleteContents()
  range.insertNode(document.createTextNode(event.clipboardData?.getData('text/plain') || ''))
  selection.removeAllRanges()

  const updatedContent = (event.target as HTMLElement).innerHTML
  updateValue.value = inputValidations(updatedContent)
  emit('input', getValue(updateValue.value))
  emitValue()
}

function setIsEditing(type: 'click' | 'focus') {
  if (isContentEditable.value) {
    isEditing.value = type
  }
}

/**
 * Use render to control SSR which struggles with custom tag, etc.
 */
function render() {
  if (!((isContentEditable.value && placeholder) || textValue.value || fallback)) {
    return null
  }

  // Base props that are always needed
  const baseProps = {
    'ref': elementRef,
    'data-anim-id': randomId,
    'class': [
      'focus:outline-none xtext',
      loaded.value ? '' : 'invisible',
      isContentEditable.value ? 'cursor-text hover:opacity-80' : '',
    ],
    'innerHTML': textValue.value || fallback,
  }

  // Editing-related props
  const editingProps = isContentEditable.value
    ? {
        contenteditable: 'true',
        spellcheck: 'false',
        placeholder,
        onInput: (event: Event) => onInput(event),
        onPaste: (event: ClipboardEvent) => onPaste(event),
        onClick: () => setIsEditing('click'),
        onFocus: () => setIsEditing('focus'),
        onBlur: handleBlur,
        onKeydown: (event: KeyboardEvent) => {
          if (event.key === 'Enter' && disableFormatting) {
            event.preventDefault()
          }
        },
      }
    : {}

  const mergedProps = {
    ...attrs, // Spread all inherited attributes first
    ...baseProps, // Spread our base props
    ...editingProps, // Spread editing-related props
    // Merge classes properly if there are external classes
    class: [
      baseProps.class,
      attrs.class,
    ].flat().filter(Boolean),
  }

  return vue.h(tag, mergedProps)
}
</script>

<template>
  <render />
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
