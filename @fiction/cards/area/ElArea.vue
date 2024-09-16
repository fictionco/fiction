<script lang="ts" setup>
import type { Card } from '@fiction/site/index.js'
import type { UserConfig } from './index.js'
import { vue } from '@fiction/core'
import ElEngine from '../CardEngine.vue'

defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})
const loaded = vue.ref(false)
</script>

<template>
  <div class="engine-container relative" :class="[loaded ? 'loaded' : '']">
    <ElEngine tag="div" :card data-test-id="area-engine" />
  </div>
</template>
