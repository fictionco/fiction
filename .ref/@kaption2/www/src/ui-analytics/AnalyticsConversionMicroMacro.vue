<script lang="ts" setup>
import screenshotConversionGoalsEvents from './img/analyticsEventList.webp'
import screenshotConversionMacro from './img/analyticsConversionMicro.webp'
import screenshotConversionMicro from './img/analyticsEventType.webp'
</script>

<template>
  <div class="my-12">
    <div class="relative m-auto max-w-screen-lg">
      <img
        class="rounded-md shadow-xl ring-1 ring-black/10"
        :src="screenshotConversionGoalsEvents"
        alt="Conversion Tracking - Goals and Events"
      >
      <img
        class="absolute top-40 -right-16 w-7/12 rounded-md shadow-xl ring-1 ring-black/10"
        :src="screenshotConversionMicro"
        alt="Conversion Tracking - Micro Conversion"
      >
      <img
        class="absolute top-8 -right-7 w-7/12 rounded-md shadow-xl ring-1 ring-black/10"
        :src="screenshotConversionMacro"
        alt="Conversion Tracking - Macro Conversion"
      >
    </div>
  </div>
</template>
