<script lang="ts" setup>
import type { Card } from '@fiction/site/card'
import type { InputModes } from '@fiction/ui/common/XText.vue'
import { getNested, setNested, vue } from '@fiction/core'
import XText from '@fiction/ui/common/XText.vue'

defineOptions({ name: 'CardText' })

const {
  card,
  tag = 'div',
  path,
  placeholder = 'Placeholder',
  fallback = '',
  animate = undefined,
  editKey = true,
} = defineProps<{
  card: Card
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'span' | 'p' | 'a' | 'RouterLink'
  path: string
  placeholder?: string
  fallback?: string
  animate?: boolean | 'rise' | 'fade'
  mode?: InputModes
  editKey?: boolean
}>()

const emit = defineEmits<{
  (event: 'isEditing', payload: boolean): void
}>()

const attrs = vue.useAttrs()
const textEl = vue.ref<HTMLElement>()

const clientData = vue.computed(() => card.fullConfig.value)
const editorData = vue.computed(() => card.userConfig.value)

function getNewUserConfig(v: string) {
  return setNested({ data: editorData.value, path, value: v })
}

function onValue(v: string) {
  card.userConfig.value = getNewUserConfig(v)
}

function onInput(v: string) {
  const userConfig = getNewUserConfig(v)
  const cardId = card.cardId
  card?.syncCard({ caller: 'CardText-onInput', cardConfig: { cardId, userConfig } })
}

const value = vue.computed(() => {
  return getNested({ path, data: clientData.value }) as string
})

const isContentEditable = vue.computed(() => card.site?.isEditable.value)

function shouldStopProp(event: MouseEvent) {
  if (isContentEditable.value) {
    event.stopPropagation()
    event.preventDefault()
    const cardId = card.cardId
    card?.site?.setActiveCard({ cardId })
    card?.setEditPath({ path, caller: 'CardText-shouldStopProp' })
  }
}

const editOrAnimate = vue.computed(() => card.site?.siteMode.value === 'editable' ? false : animate)
</script>

<template>
  <XText
    ref="textEl"
    :data-option-path="path"
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
