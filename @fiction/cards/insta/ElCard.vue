<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { CardRequests, UserConfig } from '.'
import { vue } from '@fiction/core'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig, { requests: CardRequests }>>, required: true },
})

const _vis = vue.ref(false)

vue.onMounted(async () => {
  const _x = props.card.request('instagram', { test: true })
})
</script>

<template>
  <div>test</div>
</template>
