<script lang="ts" setup>
import type { vue } from '@fiction/core'
import type { WidgetConfig } from '.'
import DateChart from '@fiction/analytics/chart/DateChart.vue'
import WidgetWrap from './WidgetWrap.vue'

defineProps<{
  widget: WidgetConfig
}>()
</script>

<template>
  <WidgetWrap :widget>
    <DateChart :title="widget.title || 'No Title'" :data="{}" :value-key="widget.valueKey" />
  </WidgetWrap>
</template>
