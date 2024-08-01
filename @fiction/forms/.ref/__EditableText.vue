<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<script lang="ts" setup>
import { clean, onResetUi, resetUi, vue } from '@fiction/core'
import type { Card } from '@fiction/site'

const props = defineProps({
  card: {
    type: Object as vue.PropType<Card>,
    required: true,
  },
  field: {
    type: String as vue.PropType<keyof Card['placeholders']>,
    required: true,
  },
  tag: {
    type: String as vue.PropType<'h1' | 'h2' | 'h3' | 'div' | 'span' | 'p'>,
    default: 'div',
  },
  placeholder: {
    type: String as vue.PropType<string>,
    default: '',
  },
})
const editing = vue.ref(false)
const updateValue = vue.ref('')
function setEditing() {
  resetUi()
  editing.value = true
}

onResetUi(() => {
  // for wysiwyg editing of values
  editing.value = false

  if (updateValue.value) {
    props.card.form.updateChildField({
      cardId: props.card.cardId,
      field: props.field,
      value: updateValue.value,
    })

    updateValue.value = ''
  }
})

function onInput(ev: Event) {
  const target = ev.target as HTMLElement
  const v = target.innerHTML
  updateValue.value = v
}

function textValue() {
  const value = props.card.userConfig.value[props.field] as string
  return clean(value ?? '')
}
function placeholderValue() {
  const value = props.card.placeholders[props.field] || ''
  return value
}
</script>

<template>
  <component
    :is="tag"
    v-if="(card.form.isDev && !card.fillCard) || textValue()"
    class="focus:outline-none"
    :contenteditable="card.form?.isDev ? 'true' : 'false'"
    spellcheck="false"
    :placeholder="card.form?.isDev ? placeholderValue() : ''"
    @input="onInput($event)"
    @click.stop="setEditing()"
    v-html="textValue()"
  />
</template>

<style lang="less">
[contentEditable="true"]:empty {
  &::before {
    content: attr(placeholder);
    opacity: 0.6;
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
