<script lang="ts" setup>
import type { vue } from '@fiction/core'

import type { Card } from '@fiction/site'
import type { UserConfig } from './index.js'
import El404 from '@fiction/ui/page/El404.vue'

defineProps({
  card: {
    type: Object as vue.PropType<Card<UserConfig>>,
    required: true,
  },
})
</script>

<template>
  <El404 v-bind="card.userConfig" />
</template>
