<script lang="ts" setup>
import type { Post } from '@fiction/posts'
import type { InputModes } from '@fiction/ui/common/XText.vue'
import { getNested, setNested, vue } from '@fiction/core'
import XText from '@fiction/ui/common/XText.vue'

const { post, tag = 'div', path, placeholder = 'Placeholder', fallback = '', animate, editKey = true } = defineProps<{
  post: Post
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'span' | 'p' | 'a'
  path: string
  placeholder?: string
  fallback?: string
  animate?: 'rise' | 'fade' | boolean
  mode?: InputModes
  editKey?: boolean | string
}>()

const attrs = vue.useAttrs()
const textEl = vue.ref<HTMLElement>()

const card = vue.computed(() => post.card)

if (!card) {
  throw new Error('Card not found on post')
}

const data = vue.computed(() => post.toConfig())

function getNewPostConfig(v: string) {
  return setNested({ data: data.value, path, value: v })
}

function getNewUserConfig(v: string) {
  const cardPath = `${post.settings.localSourcePath}.${path}`
  const cardUserConfig = card.value?.userConfig.value || {}
  return setNested({ data: cardUserConfig, path: cardPath, value: v })
}

function onValue(v: string) {
  const newConfig = getNewPostConfig(v)

  post.update(newConfig)
}

function onInput(v: string) {
  if (post.settings.sourceMode === 'local') {
    const userConfig = getNewUserConfig(v)
    card.value?.syncCard({ caller: 'updatePost', cardConfig: { cardId: card.value?.cardId, userConfig } })
  }
}

const value = vue.computed(() => {
  return getNested({ path, data: data.value }) as string
})

const isContentEditable = vue.computed(() => card.value?.site?.isEditable.value)

function shouldStopProp(event: MouseEvent) {
  if (isContentEditable.value) {
    event.stopPropagation()
    event.preventDefault()

    if (!card.value) {
      return
    }

    const cardId = card.value?.cardId
    card.value?.site?.setActiveCard({ cardId })
  }
}

const editOrAnimate = vue.computed(() => card.value?.site?.siteMode.value === 'editable' ? false : animate)
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
  />
</template>
