<script lang="ts" setup>
import type { vue } from '@fiction/core'
import type { AnalyticsWidget } from './widget'
import DateChart from '@fiction/analytics/chart/DateChart.vue'
import WidgetWrap from './WidgetWrap.vue'

const props = defineProps({
  widget: { type: Object as vue.PropType<AnalyticsWidget>, required: true },
})
</script>

<template>
  <WidgetWrap :widget>
    <DateChart :title="widget.settings.title || 'No Title'" :data="{}" :value-key="widget.settings.valueKey" />
  </WidgetWrap>
</template>
