<script lang="ts" setup>
import type { MediaDisplayObject } from '@factor/ui/utils'
import ElRichImage from '@factor/ui/ElRichImage.vue'
import { vue } from '@factor/api'
import type { Card } from '../../card'
import type { Form } from '../../form'
import type { CardAlignmentMode, CardLayoutMode } from './theme'

const props = defineProps({
  card: {
    type: Object as vue.PropType<Card>,
    required: true,
  },
  form: {
    type: Object as vue.PropType<Form>,
    required: true,
  },
  defaultAlignment: {
    type: String as vue.PropType<'left' | 'center' | 'right'>,
    default: 'left',
  },
})
const childCard = vue.computed(() => props.form.activeChildCard.value)

vue.watch(
  () => childCard.value?.cardId,
  (v) => {
    if (v) {
      const el = document.querySelector('.scroll-area')
      if (el) {
        const elem = el as HTMLElement
        elem.dataset.scroll = 'test'
        elem.scrollTop = 0
      }
    }
  },
)

const layout = vue.computed<CardLayoutMode>(() => {
  const conf = props.card.fullConfig.value
  const out = conf.layout && conf.media ? conf.layout : 'background'

  return out as CardLayoutMode
})

const alignment = vue.computed<CardAlignmentMode | undefined>(() => {
  const conf = props.card.userConfig.value.alignment as
    | CardAlignmentMode
    | undefined

  return conf || props.defaultAlignment
})

const media = vue.computed<MediaDisplayObject | undefined>(() => {
  const m = props.card.fullConfig.value.media as
    | MediaDisplayObject[]
    | undefined

  return m?.[0]
})

const contentClasses = vue.computed(() => {
  const out: string[] = [
    // "flex",
    // "flex-col",
    // "justify-center",
    // "h-full",
    // "w-full",
    // "min-h-0",
  ]

  if (layout.value === 'background')
    out.push('col-span-2 row-span-2')

  if (layout.value === 'hero' || layout.value === 'background')
    out.push('col-span-2')

  if (layout.value === 'right' || layout.value === 'heroRight')
    out.push('col-start-1')
  else
    out.push(' ')

  return out
})

const mediaClasses = vue.computed(() => {
  const out: string[] = ['media']
  if (layout.value === 'right' || layout.value === 'heroRight')
    out.push('lg:col-start-2')
  else
    out.push(' ')

  if (layout.value === 'background')
    out.push('absolute inset-0 z-0')
  else
    out.push('relative')

  return out
})

const classes = vue.computed(() => {
  const out: string[] = [
    'card-wrap',
    'theme-font',
    'relative',
    'h-[100vh]',
    'w-[100vw]',
    'overflow-scroll',
    'grid',
    'grid-cols-1',
    'grid-rows-[30%_1fr]',
    'lg:grid-cols-2',
    'lg:grid-rows-[minmax(0,_1fr)]',
  ]

  return out
})
</script>

<template>
  <div class="grid-flow-dense" :class="classes">
    <div v-if="layout !== 'hero'" :class="mediaClasses">
      <ElRichImage
        class="absolute"
        :class="
          ['heroLeft', 'heroRight'].includes(layout) ? 'inset-[10%]' : 'inset-0'
        "
        :media="media"
        fit="cover"
      />
    </div>
    <div
      class="content relative z-10 flex h-full min-h-0 w-full flex-col justify-center overflow-hidden"
      :class="contentClasses"
    >
      <transition :name="form?.slideTransition.value" mode="out-in">
        <div
          :id="childCard?.cardId"
          :key="childCard?.cardId"
          class="no-scrollbar overflow-y-auto"
        >
          <div class="mx-auto w-full max-w-4xl px-[4em] py-12 lg:py-[15vh]">
            <slot
              :alignment="alignment"
              :layout="layout"
              :media="media"
            />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style lang="less"></style>
