<script lang="ts" setup>
import type { vue } from '@factor/api'

import El404 from '@factor/ui/El404.vue'
import type { Card } from '../../card'

export type UserConfig = InstanceType<typeof El404>['$props']

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
