<template>
  <div class="my-12">
    <div class="max-w-screen-lg m-auto px-6 relative">
      <img
        class="w-full shadow-xl ring-1 ring-black ring-opacity-10 rounded-md"
        :src="screenshotDashboard"
        alt="Real-time Data - Dashboard"
      />
      <img
        class="
          shadow-xl
          ring-1 ring-black ring-opacity-10
          rounded-md
          absolute
          -bottom-14
          left-7
          w-1/3
          md:-left-7
        "
        :src="screenshotAddWidgets"
        alt="Real-time Data - Add Widgets"
      />
    </div>
  </div>
</template>

<script lang="ts">
import screenshotDashboard from "./img/screen-realtime-dashboard.webp"
import screenshotAddWidgets from "./img/screen-realtime-add-widgets.webp"

export default {
  setup() {
    return { screenshotDashboard, screenshotAddWidgets }
  },
}
</script>
