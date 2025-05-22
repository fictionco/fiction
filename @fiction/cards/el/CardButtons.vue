<script lang="ts" setup>
import type { ColorThemeUser } from '@fiction/core'
import type { ActionButton } from '@fiction/core/schemas/index.js'
import type { Card } from '@fiction/site'
import type { UiElementSize } from '@fiction/ui/utils'
import { shortId, vue } from '@fiction/core'
import { animateItemEnter, useElementVisible } from '@fiction/ui/anim'
import CardButton from '../CardButton.vue'

defineOptions({ name: 'CardButtons' })

const { card, buttons = [], uiSize = 'md', animate = 'none', theme = 'default', design } = defineProps<{
  card: Card
  buttons?: ActionButton[]
  uiSize?: UiElementSize
  animate?: 'fade' | 'slide' | 'pop' | 'rise' | 'none'
  isOverlay?: boolean
  theme?: ColorThemeUser
  design?: ActionButton['design']
  hover?: ActionButton['hover']
  format?: ActionButton['format']
}>()

const randomId = shortId()

vue.onMounted(() => {
  if (animate !== 'none') {
    useElementVisible({
      caller: 'cardButtons',
      selector: `#${randomId}`,
      onVisible: async () => {
        await animateItemEnter({ targets: `#${randomId} .x-action-item`, themeId: animate, config: { overallDelay: 400 } })
      },
    })
  }
})
</script>

<template>
  <div v-if="buttons?.length" :id="randomId" :data-base-theme="theme">
    <CardButton
      v-for="(action, i) in buttons"
      :key="i"
      :card
      class="x-action-item"
      :hover="action.hover || hover"
      :theme="action.theme || theme"
      :design="action.design || design"
      :format="action.format || format"
      :href="action.href"
      :size="action.size || uiSize"
      :icon="action.icon"
      :loading="action.loading"
      :icon-after="action.iconAfter"
      :disabled="action.disabled"
      @click.stop="action.onClick && action.onClick({ event: $event, item: action })"
    >
      {{ action.label }}
    </CardButton>
  </div>
</template>
