<script lang="ts" setup>
import screenHeatmapPhone from './img/analyticsHeatmapsPhone.webp'
import screenshotHeatmapUrl from './img/analyticsHeatmapsUrl.webp'
</script>

<template>
  <div class="my-16">
    <div class="relative m-auto max-w-screen-lg">
      <img
        class="w-full rounded-md shadow-xl ring-1 ring-black/10"
        :src="screenHeatmapPhone"
        alt="Live Heatmaps - Mobile Device"
      >
      <img
        class="absolute -right-16 -bottom-4 w-1/2 rounded-md shadow-xl ring-1 ring-black/10"
        :src="screenshotHeatmapUrl"
        alt="Live Heatmaps - URL"
      >
    </div>
  </div>
</template>
