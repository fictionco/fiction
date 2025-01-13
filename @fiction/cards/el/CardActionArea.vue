<script lang="ts" setup>
import type { ActionArea, ButtonDesign, ColorThemeUser, StandardSize } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import { getNested, simpleHandlebarsParser, vue } from '@fiction/core'

import CardButtons from '../el/CardButtons.vue'
import ProofCommunity from '../el/ProofCommunity.vue'
import CardActionAreaSubscribe from './CardActionAreaSubscribe.vue'

const { card, basePath, action, size = 'md', theme, design, enableConfirmModal = true } = defineProps<{
  card: Card
  basePath: string
  action?: ActionArea
  size?: StandardSize
  theme?: ColorThemeUser
  design?: ButtonDesign
  classes: { buttons?: string, proof?: string, subscribe?: string }
  enableConfirmModal?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:subscribed', payload: string): void
}>()

const uc = vue.computed(() => {
  return action || getNested({ data: card.fullConfig.value, path: basePath }) as ActionArea | undefined
})

const joinText = vue.computed(() => {
  const rawText = uc.value?.proof?.community?.text || '{{count}}+'
  const count = uc.value?.proof?.community?.count || 0
  return simpleHandlebarsParser(rawText, { count: count.toString() })
})

const hasActions = vue.computed(() => {
  return uc.value?.buttons?.length || uc.value?.variant === 'subscribe'
})
</script>

<template>
  <div v-if="hasActions" class="space-y-8" data-part="CardActionArea">
    <div>
      <CardActionAreaSubscribe
        v-if="uc?.variant === 'subscribe'"
        :size="uc?.size || size"
        :card
        :subscribe="uc?.subscribe || {}"
        :theme="uc?.theme || theme"
        :classes="{ subscribe: classes.subscribe }"
        :enable-confirm-modal="enableConfirmModal"
        @update:subscribed="emit('update:subscribed', $event)"
      />
      <CardButtons
        v-else-if="uc?.buttons?.length"
        :class="classes.buttons"
        :card
        :buttons="uc?.buttons || []"
        :theme="uc?.theme || theme"
        :design="uc?.design || design"
        :ui-size="size"
      />
    </div>

    <div v-if="uc?.proof">
      <ProofCommunity
        v-if="uc?.proof.community?.isEnabled"
        :count="uc?.proof.community?.count"
        :text="joinText"
        :thumb-count="uc?.proof.community?.thumbCount"
        :theme
      />
    </div>
  </div>
</template>
