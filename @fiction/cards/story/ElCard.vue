<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import EffectScrollReveal from '@fiction/ui/effect/EffectScrollReveal.vue'
import ElImage from '@fiction/ui/media/ElImage.vue'
import CardText from '../CardText.vue'
import type { UserConfig } from '.'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})
</script>

<template>
  <div>
    <div v-for="(item, i) in uc.items" :key="i" class="py-[10vw] px-4">
      <div class="md:flex gap-8 md:gap-16 relative">
        <div class="md:w-[30%] pt-4 pb-6">
          <div class="top-6 flex justify-center md:justify-end">
            <ElImage :animate="true" :media="item.media" class="aspect-square size-[clamp(100px,60%,400px)]" />
          </div>
        </div>
        <div class="max-w-[850px] md:w-[70%]">
          <EffectScrollReveal class="space-y-6 ">
            <CardText tag="div" :card :path="`items.${i}.content`" class="text-pretty text-xl sm:text-3xl md:text-5xl md:leading-relaxed" />
          </EffectScrollReveal>
        </div>
      </div>
    </div>
  </div>
</template>
