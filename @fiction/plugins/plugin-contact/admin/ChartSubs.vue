<script lang="ts" setup>
import type { WidgetConfig } from '@fiction/admin/widgets'
import WidgetWrap from '@fiction/admin/widgets/WidgetWrap.vue'
import DateChart from '@fiction/analytics/chart/DateChart.vue'

const { widget } = defineProps<{
  widget: WidgetConfig
}>()
</script>

<template>
  <WidgetWrap title="Subscribers">
    <DateChart :title="widget.title || 'No Title'" :data="widget.query?.dataRef?.value" :value-key="widget.valueKey" />
  </WidgetWrap>
</template>
