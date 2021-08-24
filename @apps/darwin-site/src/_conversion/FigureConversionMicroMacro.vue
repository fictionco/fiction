<template>
  <div class="my-12">
    <div class="max-w-screen-lg m-auto relative">
      <img
        class="shadow-xl ring-1 ring-black ring-opacity-10 rounded-md"
        :src="screenshotConversionGoalsEvents"
        alt="Conversion Tracking - Goals and Events"
      />
      <img
        class="
          shadow-xl
          ring-1 ring-black ring-opacity-10
          rounded-md
          absolute
          top-40
          -right-16
          w-7/12
        "
        :src="screenshotConversionMicro"
        alt="Conversion Tracking - Micro Conversion"
      />
      <img
        class="
          shadow-xl
          ring-1 ring-black ring-opacity-10
          rounded-md
          absolute
          top-8
          -right-7
          w-7/12
        "
        :src="screenshotConversionMacro"
        alt="Conversion Tracking - Macro Conversion"
      />
    </div>
  </div>
</template>

<script lang="ts">
import screenshotConversionGoalsEvents from "./img/screen-conversion-goals-events.webp"
import screenshotConversionMacro from "./img/screen-conversion-macro.webp"
import screenshotConversionMicro from "./img/screen-conversion-micro.webp"

export default {
  setup() {
    return {
      screenshotConversionGoalsEvents,
      screenshotConversionMacro,
      screenshotConversionMicro,
    }
  },
}
</script>
