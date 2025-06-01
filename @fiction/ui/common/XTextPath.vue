<script lang="ts" setup>
import type { Card } from '@fiction/site/card'
import type { InputModes } from '../common/XText.vue'
import { getNested, setNested, vue } from '@fiction/core'
import XText from './XText.vue'

defineOptions({ name: 'XTextPath' })

const {
  modelValue = {},
  path,
  card,
  tag = 'div',
  placeholder = 'Placeholder',
  fallback = '',
  animate = undefined,
  mode = 'text',
  editKey = true,
} = defineProps<{
  modelValue?: Record<string, any>
  path: string
  card?: Card
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'span' | 'p' | 'a' | 'RouterLink'
  placeholder?: string
  fallback?: string
  animate?: boolean | 'rise' | 'fade'
  mode?: InputModes
  editKey?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: Record<string, any>): void
  (event: 'input', payload: Record<string, any>): void
  (event: 'isEditing', payload: boolean): void
}>()

const attrs = vue.useAttrs()

const value = vue.computed(() => {
  return getNested({ path, data: modelValue }) as string
})

const isContentEditable = vue.computed(() => card?.site?.isEditable.value || false)

function updateValue(v: string) {
  const updatedValue = setNested({ data: modelValue, path, value: v })
  emit('update:modelValue', updatedValue)
}

function onInput(v: string) {
  const updatedValue = setNested({ data: modelValue, path, value: v })
  emit('input', updatedValue)
}

function shouldStopProp(event: MouseEvent) {
  if (isContentEditable.value && card) {
    event.stopPropagation()
    event.preventDefault()
    const cardId = card.cardId
    card.site?.setActiveCard({ cardId })
    card.setEditPath({ path, caller: 'XTextPath-click' })
  }
}

const editOrAnimate = vue.computed(() =>
  card?.site?.siteMode.value === 'editable' ? false : animate,
)
</script>

<template>
  <XText
    :data-option-path="path"
    v-bind="attrs"
    :animate="editOrAnimate"
    :tag
    :is-editable="isContentEditable"
    :edit-key="editKey"
    :model-value="value"
    :placeholder
    :fallback
    :mode
    @click="shouldStopProp($event)"
    @update:model-value="updateValue($event)"
    @input="onInput($event)"
    @is-editing="emit('isEditing', $event)"
  />
</template>
