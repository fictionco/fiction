<script lang="ts" setup>
import type { ActionArea, ButtonDesign, ColorThemeUser, StandardSize } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import { getNested, vue } from '@fiction/core/utils'

import CardButtons from '../el/CardButtons.vue'

const { card, basePath, action, size = 'md', theme, design } = defineProps<{
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

const hasActions = vue.computed(() => {
  return uc.value?.buttons?.length
})
</script>

<template>
  <div
    v-if="hasActions"
    class="space-y-8"
    data-part="CardActionArea"
    @click="card.setEditPath({ path: basePath, caller: 'CardActionArea' })"
  >
    <div>
      <CardButtons
        v-if="uc?.buttons?.length"
        :class="classes.buttons"
        :card
        :buttons="uc?.buttons || []"
        :theme="uc?.theme || theme"
        :design="uc?.design || design"
        :ui-size="size"
      />
    </div>
  </div>
</template>
