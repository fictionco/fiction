<template>
  <div class="my-16">
    <div class="max-w-screen-lg m-auto relative">
      <img
        class="w-full shadow-xl ring-1 ring-black ring-opacity-10 rounded-md"
        :src="screenHeatmapPhone"
        alt="Live Heatmaps - Mobile Device"
      />
      <img
        class="
          shadow-xl
          ring-1 ring-black ring-opacity-10
          rounded-md
          absolute
          -right-16
          -bottom-4
          w-1/2
        "
        :src="screenshotHeatmapUrl"
        alt="Live Heatmaps - URL"
      />
    </div>
  </div>
</template>

<script lang="ts">
import screenHeatmapPhone from "./img/screenHeatmapPhone.webp"
import screenshotHeatmapUrl from "./img/screen-heatmap-url.webp"
export default {
  setup() {
    return {
      screenHeatmapPhone,
      screenshotHeatmapUrl,
    }
  },
}
</script>
<style lang="less"></style>
