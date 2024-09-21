<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from '.'
import { vue } from '@fiction/core'
import EffectScrollReveal from '@fiction/ui/effect/EffectScrollReveal.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import CardText from '../CardText.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})

const editingStoryText = vue.ref(false)
</script>

<template>
  <div>
    <div v-for="(item, i) in uc.items" :key="i" class="py-[4vw] px-4">
      <div class="md:flex gap-8 md:gap-16 lg:gap-24 relative" :class="card.classes.value.contentWidth">
        <div class="md:w-[clamp(100px,20%,400px)] pt-4 pb-6">
          <div class="top-6 flex justify-center md:justify-end">
            <XMedia :animate="true" :media="item.media" class="aspect-square w-full " />
          </div>
        </div>
        <div class=" md:w-[70%] grow">
          <EffectScrollReveal class="space-y-6" :disable="card.site?.isEditable.value">
            <CardText tag="div" :card :path="`items.${i}.content`" class="prose dark:prose-invert prose-sm md:prose-md lg:prose-xl text-pretty text-xl sm:text-3xl lg:text-4xl !leading-relaxed" @editing="editingStoryText = $event" />
          </EffectScrollReveal>
        </div>
      </div>
    </div>
  </div>
</template>
