<script lang="ts" setup>
import type { vue } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import ElEngine from '../../CardEngine.vue'
import CardWrap from '../../CardWrap.vue'

defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})
</script>

<template>
  <CardWrap v-if="card.site" content-width="full" :card>
    <ElEngine tag="main" :card />
  </CardWrap>
</template>
