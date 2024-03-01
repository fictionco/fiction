<script lang="ts" setup>
import screenshotDashboard from './img/analyticsRealtimeDashboard.webp'
import screenshotAddWidgets from './img/analyticsRealtimeWidgets.webp'
</script>

<template>
  <div class="my-12">
    <div class="relative m-auto max-w-screen-lg px-6">
      <img
        class="w-full rounded-md shadow-xl ring-1 ring-black/10"
        :src="screenshotDashboard"
        alt="Real-time Data - Dashboard"
      >
      <img
        class="absolute -bottom-14 left-7 w-1/3 rounded-md shadow-xl ring-1 ring-black/10 md:-left-7"
        :src="screenshotAddWidgets"
        alt="Real-time Data - Add Widgets"
      >
    </div>
  </div>
</template>
