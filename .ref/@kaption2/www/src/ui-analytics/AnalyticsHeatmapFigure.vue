<script lang="ts" setup>
import screenshotHeatmapAnalytics from './img/analyticsHeatmapsScreen.webp'
import thumbHeatmapScrollData from './img/analyticsHeatmapsScrolls.webp'
</script>

<template>
  <div class="my-16">
    <div class="relative m-auto max-w-screen-lg">
      <img
        class="rounded-md shadow-xl ring-1 ring-black/10"
        :src="screenshotHeatmapAnalytics"
        alt="Live Heatmaps - Analytics"
      >
      <img
        class="absolute -right-9 -bottom-5 w-[27rem] rounded-md shadow-xl ring-1 ring-black/10"
        :src="thumbHeatmapScrollData"
        alt="Live Heatmaps - Scroll Data"
      >
    </div>
  </div>
</template>
