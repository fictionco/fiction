<script lang="ts" setup>
import { clean, onResetUi, shortId, toHtml, toMarkdown, vue } from '@fiction/core'
import anime from 'animejs'

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
})

const emit = defineEmits<{
  (event: 'input', payload: string): void
  (event: 'reset', payload: string): void
  (event: 'update:modelValue', payload: string): void
}>()

const randomId = shortId()

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

function loadAnimation() {
  if (props.isEditable || !props.animate)
    return

  const textWrapper = document.querySelector(`#${randomId}`)

  if (textWrapper?.textContent) {
  // Wrap each word and punctuation with 'word' and each character within them with 'fx'
    textWrapper.innerHTML = textWrapper.textContent.replace(/(\b\w+\b|\S)/g, (match) => {
    // Wrap each character in 'match' within 'fx' spans and group them under 'word'
      return `<span class='word'>${match.split('').map(character => `<span class='fx'>${character}</span>`).join('')}</span>`
    })
  }

  const themes = {
    rise: {
      translateY: [30, 0],
      translateZ: 0,
      opacity: [0, 1],
      easing: 'easeInOutCubic',
      duration: 700, // Total duration each word's animation should last
      overallDelay: 150, // Initial delay before the first word starts animating
      totalAnimationTime: 1200, // Total time from the start of the first word's animation to the end of the last word's animation
    },
    fade: {
      translateY: [0, 0], // No vertical movement
      translateZ: 0,
      opacity: [0, 1],
      easing: 'easeInCubic',
      duration: 1000,
      overallDelay: 200,
      totalAnimationTime: 2200,
    },
  }

  const themeId = typeof props.animate == 'string' ? props.animate : 'rise'

  const theme = themes[themeId] || themes.rise

  function calculateDelay(el: HTMLElement, i: number, length: number) {
    if (length <= 5)
      return theme.overallDelay + 10 * i // Fixed delay increment if not enough words
    else
      return theme.overallDelay + (theme.totalAnimationTime - theme.duration) * i / (length - 1) // Dynamic delay for longer texts
  }

  anime.timeline({ loop: false }).add({
    targets: `#${randomId} .fx`,
    translateY: theme.translateY,
    translateZ: theme.translateZ,
    opacity: theme.opacity,
    easing: theme.easing,
    duration: theme.duration,
    delay: calculateDelay,
  })
}

vue.onMounted(() => {
  loadAnimation()
})
</script>

<template>
  <component
    :is="tag"
    v-if="textValue()"
    :id="randomId"
    class="focus:outline-none xtext"
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
