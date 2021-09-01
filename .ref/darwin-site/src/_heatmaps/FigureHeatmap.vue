<template>
  <div class="my-16">
    <div class="max-w-screen-lg m-auto relative">
      <img
        class="shadow-xl ring-1 ring-black ring-opacity-10 rounded-md"
        :src="screenshotHeatmapAnalytics"
        alt="Live Heatmaps - Analytics"
      />
      <img
        class="
          shadow-xl
          ring-1 ring-black ring-opacity-10
          rounded-md
          absolute
          -right-9
          -bottom-5
          w-108
        "
        :src="thumbHeatmapScrollData"
        alt="Live Heatmaps - Scroll Data"
      />
    </div>
  </div>
</template>

<script lang="ts">
import screenshotHeatmapAnalytics from "./img/screenHeatmapAnalytics.webp"
import thumbHeatmapScrollData from "./img/thumbHeatmapScrollData.webp"
export default {
  setup() {
    return {
      screenshotHeatmapAnalytics,
      thumbHeatmapScrollData,
    }
  },
}
</script>
<style lang="less"></style>
