<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { InputModes } from '@fiction/ui/common/XText.vue'
import { getNested, setNested, vue } from '@fiction/core'
import XText from '@fiction/ui/common/XText.vue'

const {
  modelValue,
  card,
  tag = 'div',
  path,
  placeholder = 'Placeholder',
  fallback = '',
  animate,
  editKey = true,
} = defineProps<{
  modelValue: Record<string, any>
  card: Card
  path: string
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'span' | 'p' | 'a'
  placeholder?: string
  fallback?: string
  animate?: 'rise' | 'fade' | boolean
  mode?: InputModes
  editKey?: boolean | string
}>()

const emit = defineEmits<{
  (event: 'update:model-value', payload: Record<string, any>): void
}>()
const attrs = vue.useAttrs()
const textEl = vue.ref<HTMLElement>()

function getNewModelValue(v: string) {
  return setNested({ data: modelValue, path, value: v })
}

function onValue(v: string) {
  const newConfig = getNewModelValue(v)

  emit('update:model-value', newConfig)
}

function onInput(v: string) {
  // nothing
}

const value = vue.computed(() => {
  return getNested({ path, data: modelValue }) as string
})

const isContentEditable = vue.computed(() => card?.site?.isEditable.value)

function shouldStopProp(event: MouseEvent) {
  if (isContentEditable.value) {
    event.stopPropagation()
    event.preventDefault()

    if (!card) {
      return
    }

    const cardId = card?.cardId
    card?.site?.setActiveCard({ cardId })
  }
}

const editOrAnimate = vue.computed(() => card?.site?.siteMode.value === 'editable' ? false : animate)
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
  />
</template>
