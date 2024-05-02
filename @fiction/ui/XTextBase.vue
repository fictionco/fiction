<script lang="ts" setup>
import { clean, onResetUi, shortId, toHtml, toMarkdown, vue } from '@fiction/core'

import { animateItemEnter, splitLetters, useElementVisible } from './anim'

const props = defineProps({
  tag: {
    type: String as vue.PropType<'h1' | 'h2' | 'h3' | 'div' | 'span' | 'p' | 'a'>,
    default: 'div',
  },
  placeholder: { type: String, default: '123' },
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
  const out = props.isMarkdown ? toHtml(v) : v

  return `${props.prefix}${out}${props.suffix}`
}

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
</script>

<template>
  <component
    :is="tag"
    v-if="textValue()"
    :id="randomId"
    class="focus:outline-none xtext"
    :class="loaded ? '' : 'invisible'"
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
