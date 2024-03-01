<script lang="ts" setup>
import analyticsBehaviorCharts from './img/analyticsBehaviorCharts.webp'
import analyticsBehaviorThumb from './img/analyticsBehaviorThumb.webp'
</script>

<template>
  <div class="my-12">
    <div class="figure-stage relative m-auto max-w-screen-lg">
      <img
        class="variant-editor rounded-md shadow-xl ring-1 ring-black/10"
        :src="analyticsBehaviorCharts"
        alt="Behavior Analytics - Charts"
      >

      <img
        class="absolute -bottom-7 -right-7 w-48 rounded-md shadow-2xl ring-1 ring-black/10 sm:w-80"
        :src="analyticsBehaviorThumb"
        alt="Behavior Analytics - Charts Small"
      >
    </div>
  </div>
</template>
