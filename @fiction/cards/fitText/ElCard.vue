<script lang="ts" setup>
import { vue } from '@fiction/core'
import { fontFamilyByKey } from '@fiction/site/utils/fonts'
import EffectFitText from '@fiction/ui/effect/EffectFitText.vue'
import type { Card } from '@fiction/site'
import CardText from '../CardText.vue'
import type { UserConfig } from './index.js'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value)

const opts = vue.computed(() => ({
  minSize: uc.value.minFontSize || 16,
  maxSize: uc.value.maxFontSize || 512,
  lines: uc.value.lines,
}))

vue.watch(() => uc.value.font, () => {
  const f = uc.value.font

  const site = props.card.site

  if (site && f) {
    const fontObject = { [f]: { fontKey: f, stack: 'sans' as const } }
    site.userFonts.value = { ...site.userFonts.value, ...fontObject }
  }
})
</script>

<template>
  <EffectFitText class="p-12 text-center" v-bind="opts" :content="uc.text || ''">
    <CardText :card tag="span" path="text" animate="rise" :style="{ fontFamily: fontFamilyByKey(uc.font) }" />
  </EffectFitText>
</template>
