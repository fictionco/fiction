<script lang="ts" setup>
import type { vue } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import ElEngine from './CardEngine.vue'

defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})
</script>

<template>
  <div v-if="card.site">
    <ElEngine tag="main" :card />
  </div>
</template>
