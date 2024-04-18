<script lang="ts" setup>
import { getNested, setNested, vue } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import XTextBase from '@fiction/ui/XTextBase.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  tag: { type: String as vue.PropType<'h1' | 'h2' | 'h3' | 'div' | 'span' | 'p' | 'a'>, default: 'div' },
  path: { type: String, required: true },
  placeholder: { type: String, default: '123' },
})

const attrs = vue.useAttrs()

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
</script>

<template>
  <XTextBase
    :data-key="path"
    v-bind="attrs"
    :tag="tag"
    :is-editable="card.site?.isEditable.value"
    :model-value="value"
    :placeholder="placeholder"
    @update:model-value="onValue($event)"
    @input="onInput($event)"
  />
</template>
