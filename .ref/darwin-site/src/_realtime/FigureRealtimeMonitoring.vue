<template>
  <div class="my-12">
    <div class="max-w-screen-lg m-auto relative">
      <img
        class="
          shadow-xl
          ring-1 ring-black ring-opacity-10
          rounded-md
          absolute
          -bottom-4
          left-8
          w-5/12
        "
        :src="screenshotRealtimeUsers"
        alt="Real-time Data - Users"
      />
      <div class="py-8">
        <img
          class="
            relative
            z-10
            mx-auto
            my-12
            shadow-xl
            ring-1 ring-black ring-opacity-10
            rounded-md
            w-5/12
          "
          :src="screenshotRealtimeConversions"
          alt="Real-time Data - Conversions"
        />
      </div>

      <img
        class="
          shadow-xl
          ring-1 ring-black ring-opacity-10
          rounded-md
          absolute
          -top-4
          right-8
          w-5/12
        "
        :src="screenshotRealtimeDevices"
        alt="Real-time Data - Devices"
      />
    </div>
  </div>
</template>

<script lang="ts">
import screenshotRealtimeUsers from "./img/screen-realtime-users.webp"
import screenshotRealtimeConversions from "./img/screen-realtime-conversions.webp"
import screenshotRealtimeDevices from "./img/screen-realtime-devices.webp"

export default {
  setup() {
    return {
      screenshotRealtimeUsers,
      screenshotRealtimeConversions,
      screenshotRealtimeDevices,
    }
  },
}
</script>
