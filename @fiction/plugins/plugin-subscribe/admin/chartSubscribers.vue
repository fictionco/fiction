<script lang="ts" setup>
import type { vue } from '@fiction/core'
import DateChart from '@fiction/analytics/chart/DateChart.vue'
import type { FictionSubscribe } from '..'

type SubscriberWidget = FictionSubscribe['widgets']['subscribers']

const props = defineProps({
  widget: { type: Object as vue.PropType<SubscriberWidget>, required: true },
})
</script>

<template>
  <DateChart :title="widget.settings.title || 'No Title'" :data="widget.query?.data.value" value-key="subscribers" />
</template>
