<script lang="ts" setup>
import { getNested, setNested, useService, vue } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import type { InputModes } from '@fiction/ui/common/XText.vue'
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

const { fictionEnv } = useService()

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

// const isEditable = vue.computed(() => {
//   const isEditable = props.card.site?.isEditable.value
//   const requiredKey = props.editKey === true ? 'meta' : props.editKey

//   if (isEditable && requiredKey && fictionEnv?.heldKeys.value[requiredKey]) {
//     return true
//   }
//   else if (!requiredKey) {
//     return isEditable
//   }
// })

const isContentEditable = vue.ref(false)

function shouldStopProp(event: MouseEvent) {
  if (isContentEditable.value) {
    event.stopPropagation()
    event.preventDefault()
    const cardId = props.card.cardId
    props.card?.site?.setActiveCard({ cardId })
  }
}
</script>

<template>
  <XText
    ref="textEl"
    :data-key="path"
    v-bind="attrs"
    :animate
    :tag
    :is-editable="props.card.site?.isEditable.value"
    :edit-key="editKey"
    :model-value="value"
    :placeholder
    :fallback
    @on-editable="isContentEditable = $event"
    @click="shouldStopProp($event)"
    @update:model-value="onValue($event)"
    @input="onInput($event)"
  />
</template>
