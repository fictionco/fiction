<script lang="ts" setup>
import screenPerformance from './img/analyticsPerformanceScreen.webp'
import screenVital from './img/analyticsPerformanceLCP.webp'
</script>

<template>
  <div class="my-12">
    <div class="figure-stage relative m-auto max-w-screen-lg">
      <img
        class="rounded-md shadow-xl ring-1 ring-black/10"
        :src="screenPerformance"
        alt="Performance Dashboard"
      >

      <img
        class="absolute -bottom-7 -right-7 w-[27rem] rounded-md shadow-2xl ring-1 ring-black/10"
        :src="screenVital"
        alt="Performance - Largest Contentful Paint"
      >
    </div>
  </div>
</template>
