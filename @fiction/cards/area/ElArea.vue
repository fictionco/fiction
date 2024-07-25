<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site/index.js'
import ElEngine from '../CardEngine.vue'
import type { UserConfig } from './index.js'

defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})
const loaded = vue.ref(false)
</script>

<template>
  <div class="engine-container relative" :class="[loaded ? 'loaded' : '']">
    <ElEngine :card />
  </div>
</template>
