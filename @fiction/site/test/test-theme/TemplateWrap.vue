<script lang="ts" setup>
import ElEngine from '@fiction/cards/CardEngine.vue'
import type { vue } from '@fiction/core'
import type { Card } from '../../card'

defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})
</script>

<template>
  <div v-if="card.site">
    <ElEngine tag="header" :card="card.site.sections.value.header" />
    <ElEngine tag="main" :card="card" />
    <ElEngine tag="footer" :card="card.site.sections.value.footer" />
  </div>
</template>
