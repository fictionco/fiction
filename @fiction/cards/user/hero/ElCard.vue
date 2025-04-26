<script lang="ts" setup>
import type { UserConfig } from '.'
import type { HeroConfig } from './config'
import { vue } from '@fiction/core'
import { Card } from '@fiction/site'
import CardWrap from '../../CardWrap.vue'
import ElHero from './ElHero.vue'

const { card } = defineProps<{
  card: Card<UserConfig>
}>()

const uc = vue.computed(() => card.userConfig.value || {})

function createHeroCard(item: HeroConfig, index: number) {
  return new Card({
    cardId: card.cardId,
    templateId: 'cardHeroV1',
    userConfig: item,
    site: card.site,
    onSync: ({ cardConfig }) => {
      const value = cardConfig.userConfig
      card.updateUserConfig({ path: `items.${index}`, value })
    },
  })
}
</script>

<template>
  <CardWrap :card>
    <div class="space-y-48">
      <ElHero v-for="(item, i) in uc.items" :key="i" :card="createHeroCard(item, i)" />
    </div>
  </CardWrap>
</template>
