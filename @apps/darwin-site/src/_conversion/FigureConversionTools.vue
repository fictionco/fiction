<template>
  <div class="my-12">
    <div class="max-w-screen-lg m-auto relative">
      <img
        class="shadow-xl ring-1 ring-black ring-opacity-10 rounded-md"
        :src="screenshotConversionCharts"
        alt="Conversion Tracking - Charts"
      />
      <img
        class="
          shadow-xl
          ring-1 ring-black ring-opacity-10
          rounded-md
          absolute
          -bottom-4
          -left-16
          w-5/12
        "
        :src="screenshotConversionEventType"
        alt="Conversion Tracking - Event Type"
      />
      <img
        class="
          shadow-xl
          ring-1 ring-black ring-opacity-10
          rounded-md
          absolute
          -bottom-12
          left-24
          w-5/12
        "
        :src="screenshotConversionEventTrigger"
        alt="Conversion Tracking - Event Trigger"
      />
    </div>
  </div>
</template>

<script lang="ts">
import screenshotConversionCharts from "./img/screen-conversion-charts.webp"
import screenshotConversionEventType from "./img/screen-conversion-event-trigger.webp"
import screenshotConversionEventTrigger from "./img/screen-conversion-event-type.webp"

export default {
  setup() {
    return {
      screenshotConversionCharts,
      screenshotConversionEventType,
      screenshotConversionEventTrigger,
    }
  },
}
</script>
