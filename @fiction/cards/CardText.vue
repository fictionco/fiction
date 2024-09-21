<script lang="ts" setup>
import type { Card } from '@fiction/site/card'
import type { InputModes } from '@fiction/ui/common/XText.vue'
import { getNested, setNested, vue } from '@fiction/core'
import XText from '@fiction/ui/common/XText.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  tag: { type: String as vue.PropType<'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'span' | 'p' | 'a'>, default: 'div' },
  path: { type: String, required: true },
  placeholder: { type: String, default: 'Placeholder' },
  fallback: { type: String, default: '' },
  animate: { type: [String, Boolean] as vue.PropType<'rise' | 'fade' | boolean>, default: undefined },
  mode: { type: String as vue.PropType<InputModes>, default: 'text' },
  editKey: { type: [Boolean, String], default: true },
})

const emit = defineEmits<{
  (event: 'isEditing', payload: boolean): void
}>()
const attrs = vue.useAttrs()
const textEl = vue.ref<HTMLElement>()

const data = vue.computed(() => props.card.userConfig.value)

function getNewUserConfig(v: string) {
  return setNested({ data: data.value, path: props.path, value: v })
}

function onValue(v: string) {
  props.card.userConfig.value = getNewUserConfig(v)
}

function onInput(v: string) {
  const userConfig = getNewUserConfig(v)
  const cardId = props.card.cardId
  props.card?.syncCard({ caller: 'updateUserConfig', cardConfig: { cardId, userConfig } })
}

const value = vue.computed(() => {
  return getNested({ path: props.path, data: data.value }) as string
})

const isContentEditable = vue.computed(() => props.card.site?.isEditable.value)

function shouldStopProp(event: MouseEvent) {
  if (isContentEditable.value) {
    event.stopPropagation()
    event.preventDefault()
    const cardId = props.card.cardId
    props.card?.site?.setActiveCard({ cardId })
  }
}

const editOrAnimate = vue.computed(() => props.card.site?.siteMode.value === 'editable' ? false : props.animate)
</script>

<template>
  <XText
    ref="textEl"
    :data-key="path"
    v-bind="attrs"
    :animate="editOrAnimate"
    :tag
    :is-editable="isContentEditable"
    :edit-key="editKey"
    :model-value="value"
    :placeholder
    :fallback
    @click="shouldStopProp($event)"
    @update:model-value="onValue($event)"
    @input="onInput($event)"
    @is-editing="emit('isEditing', $event)"
  />
</template>
