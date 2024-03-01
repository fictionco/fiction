<script lang="ts" setup>
import type { vue } from '@factor/api'
import type { Card } from '../card'
import ElEngine from '../cards/ElEngine.vue'

const props = defineProps({
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
