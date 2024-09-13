<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from '.'
import { vue } from '@fiction/core'
import EffectParallaxBackground from '@fiction/ui/effect/EffectParallaxBackground.vue'
import CardContent from './CardContent.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})

const activeItemIndex = vue.ref(0)

vue.onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeItemIndex.value = Number(entry.target.getAttribute('data-index'))
      }
    })
  }, { threshold: 0.5 })

  const items = document.querySelectorAll('.trek-item')
  items.forEach((item, index) => {
    item.setAttribute('data-index', index.toString())
    observer.observe(item)
  })

  vue.onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <div class="flex gap-12 p-4 md:p-0">
    <div class="w-[45dvw] pl-[8%] hidden md:block">
      <div class="sticky top-[calc(50%-3rem)] flex w-full">
        <CardContent :card class="content " :item-index="activeItemIndex" />
      </div>
    </div>
    <div class="w-full md:w-[55dvw] space-y-6">
      <div v-for="(item, i) in uc.items" :key="i" class="h-[60dvh] md:h-[90dvh] relative trek-item">
        <EffectParallaxBackground v-if="item.media" class="h-full w-full parallax-wrap" :media="item.media" />
        <div class="absolute bottom-0 w-full bg-black/50 md:hidden">
          <CardContent :card :item-index="i" class="px-4 py-6" mode="overlay" />
        </div>
      </div>
    </div>
  </div>
</template>
