<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import EffectScrollReveal from '@fiction/ui/effect/EffectScrollReveal.vue'
import CardText from '../CardText.vue'
import type { UserConfig } from '.'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})
</script>

<template>
  <div>
    <div v-for="(item, i) in uc.items" :key="i" class="py-[10vw] ">
      <div :class="card.getContentWidth('sm')">
        <EffectScrollReveal class="space-y-6 ">
          <CardText tag="div" :card :path="`items.${i}.content`" class="text-6xl leading-relaxed" />
        </EffectScrollReveal>
      </div>
    </div>
  </div>
</template>
