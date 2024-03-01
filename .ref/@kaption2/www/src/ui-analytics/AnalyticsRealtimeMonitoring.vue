<script lang="ts" setup>
import screenshotRealtimeUsers from './img/analyticsRealtimeUsers.webp'
import screenshotRealtimeConversions from './img/analyticsRealtimeConversions.webp'
import screenshotRealtimeDevices from './img/analyticsRealtimeDevices.webp'
</script>

<template>
  <div class="my-12">
    <div class="relative m-auto max-w-screen-lg">
      <img
        class="absolute -bottom-4 left-8 w-5/12 rounded-md shadow-xl ring-1 ring-black/10"
        :src="screenshotRealtimeUsers"
        alt="Real-time Data - Users"
      >
      <div class="py-8">
        <img
          class="relative z-10 mx-auto my-12 w-5/12 rounded-md shadow-xl ring-1 ring-black/10"
          :src="screenshotRealtimeConversions"
          alt="Real-time Data - Conversions"
        >
      </div>

      <img
        class="absolute -top-4 right-8 w-5/12 rounded-md shadow-xl ring-1 ring-black/10"
        :src="screenshotRealtimeDevices"
        alt="Real-time Data - Devices"
      >
    </div>
  </div>
</template>
