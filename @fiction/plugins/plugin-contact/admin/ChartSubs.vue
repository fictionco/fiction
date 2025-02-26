<script lang="ts" setup>
import type { FictionContact } from '..'
import WidgetWrap from '@fiction/admin/dashboard/WidgetWrap.vue'
import DateChart from '@fiction/analytics/chart/DateChart.vue'

type SubscriberWidget = FictionContact['widgets']['subscribers']

const { widget } = defineProps<{
  widget: SubscriberWidget
}>()
</script>

<template>
  <WidgetWrap :widget>
    <DateChart :title="widget.settings.title || 'No Title'" :data="widget.query?.dataRef.value" :value-key="widget.settings.valueKey" />
  </WidgetWrap>
</template>
