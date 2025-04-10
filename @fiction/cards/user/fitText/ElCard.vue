<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from './config'
import { vue } from '@fiction/core'
import { fontFamilyByKey } from '@fiction/site/utils/fonts'
import EffectFitText from '@fiction/ui/effect/EffectFitText.vue'
import CardText from '../CardText.vue'

const props = defineProps<{
  card: Card<UserConfig>
}>()

const uc = vue.computed(() => props.card.userConfig.value)

// Core text fitting options
const fitOpts = vue.computed(() => ({
  minSize: uc.value.minFontSize || 16,
  maxSize: uc.value.maxFontSize || 512,
  lines: uc.value.lines || 1,
}))

// Typography styles
const textStyles = vue.computed(() => ({
  fontFamily: fontFamilyByKey(uc.value.font?.family),
  textAlign: uc.value.align || 'inherit',
  fontWeight: uc.value.weight || 'inherit',
}))

// Register font when changed
vue.watch(() => uc.value.font, (newFont) => {
  if (!newFont?.family || !props.card.site)
    return

  props.card.site.userFonts.value = {
    ...props.card.site.userFonts.value,
    [newFont.family]: {
      family: newFont.family,
      stack: 'sans' as const,
    },
  }
}, { immediate: true })
</script>

<template>
  <div :class="card.classes.value.contentWidth" :data-value="JSON.stringify(fitOpts)">
    <EffectFitText v-bind="fitOpts" :content="uc.text || ''">
      <CardText
        :card="card"
        tag="span"
        path="text"
        animate="rise"
        :style="textStyles"
        class="block leading-tight"
      />
    </EffectFitText>
  </div>
</template>
