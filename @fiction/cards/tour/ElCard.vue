<script lang="ts" setup>
import { vue } from '@fiction/core'
import { Card } from '@fiction/site'
import ElHero from '../hero/ElHero.vue'
import type { UserConfig as HeroUserConfig } from '../hero'
import type { UserConfig } from '.'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})

function createHeroCard(item: HeroUserConfig, index: number) {
  return new Card({
    templateId: 'hero',
    userConfig: item,
    site: props.card.site,
    onSync: (subCard) => {
      props.card.updateUserConfig({ path: `items.${index}`, value: subCard.userConfig.value })
    },
  })
}
</script>

<template>
  <div class="space-y-48">
    <ElHero v-for="(item, i) in uc.items" :key="i" :card="createHeroCard(item, i)" />
  </div>
</template>
