<script lang="ts" setup>
import screenshotConversionCharts from './img/analyticsConversionCharts.webp'
import screenshotConversionEventType from './img/analyticsEventTrigger.webp'
import screenshotConversionEventTrigger from './img/analyticsEventType.webp'
</script>

<template>
  <div class="my-12">
    <div class="relative m-auto max-w-screen-lg">
      <img
        class="rounded-md shadow-xl ring-1 ring-black/10"
        :src="screenshotConversionCharts"
        alt="Conversion Tracking - Charts"
      >
      <img
        class="absolute -bottom-4 -left-16 w-5/12 rounded-md shadow-xl ring-1 ring-black/10"
        :src="screenshotConversionEventType"
        alt="Conversion Tracking - Event Type"
      >
      <img
        class="absolute -bottom-12 left-24 w-5/12 rounded-md shadow-xl ring-1 ring-black/10"
        :src="screenshotConversionEventTrigger"
        alt="Conversion Tracking - Event Trigger"
      >
    </div>
  </div>
</template>
