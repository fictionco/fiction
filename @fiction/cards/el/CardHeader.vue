<script lang="ts" setup>
import type { ActionButton } from '@fiction/core'
import type { Card } from '@fiction/site'
import { ActionAreaSchema, pathCheck, SuperTitleSchema, vue } from '@fiction/core'
import z from 'zod'
import CardText from '../CardText.vue'
import CardActionArea from './CardActionArea.vue'
import XSuperTitle from './SuperTitle.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
  actions: { type: Array as vue.PropType<ActionButton[]>, default: () => [] },
  withActions: { type: Boolean, default: true },
})

const schema = z.object({
  title: z.string().optional(),
  subTitle: z.string().optional(),
  superTitle: SuperTitleSchema.optional(),
  action: ActionAreaSchema.optional(),
  layout: z.enum(['center', 'justify', 'right', 'left']).optional(),
})

type UserConfig = z.infer<typeof schema>

const uc = vue.computed(() => props.card.userConfig.value || {})

const textWrapClass = vue.computed(() => {
  const out = []
  const layout = uc.value.layout || ''

  if (layout === 'justify')
    out.push('lg:flex justify-between text-left items-end gap-8')

  else if (layout === 'left')
    out.push('text-left')

  else if (layout === 'right')
    out.push('text-left')

  else
    out.push('mx-auto text-left md:text-center')

  return out.join(' ')
})

const layout = vue.computed(() => {
  return uc.value.layout || 'center'
})
</script>

<template>
  <div class="space-y-6 ">
    <div
      :class="textWrapClass"
      class="space-y-5 md:space-y-6 @container/header"
      data-option-path="layout"
      :data-layout="layout"
    >
      <div class="max-w-screen-md space-y-4" :class="layout === 'justify' ? 'lg:min-w-[50%]' : 'mx-auto'">
        <XSuperTitle
          :card
          :base-path="pathCheck('superTitle', schema)"
          :class="[layout === 'center' ? 'md:justify-center' : '']"
        />
        <CardText
          tag="h1"
          :card
          class="x-font-title font-semibold md:text-balance text-3xl @[300px]/header:text-4xl @[600px]/header:text-5xl !leading-[1.2]"
          :path="pathCheck('title', schema)"
          placeholder="Title"
          animate="fade"
        />
      </div>
      <div class="max-w-screen-md space-y-4" :class="layout === 'justify' ? 'lg:max-w-[40%]' : 'mx-auto'">
        <CardText
          tag="h3"
          :card
          class="text-lg  @[300px]/header:text-xl @[600px]/header:text-2xl md:text-balance text-theme-800 dark:text-theme-300 !leading-relaxed"
          :class="layout === 'justify' ? 'lg:text-right' : ''"
          :path="pathCheck('subTitle', schema)"
          placeholder="Sub Title"
          animate="fade"
        />
        <CardActionArea
          v-if="withActions && layout === 'justify'"
          :base-path="pathCheck('action', schema)"
          :card
          :classes="{ buttons: ['flex gap-4 lg:gap-6 justify-start md:justify-end'].join(' ') }"
          size="md"
        />
      </div>
    </div>
    <CardActionArea
      v-if="withActions && layout !== 'justify'"
      :base-path="pathCheck('action', schema)"
      :card
      :classes="{
        buttons: [['justify', 'left', 'right'].includes(layout) ? 'justify-start' : 'justify-start md:justify-center', 'flex gap-4'].join(' '),
      }"
      size="lg"
    />
  </div>
</template>
