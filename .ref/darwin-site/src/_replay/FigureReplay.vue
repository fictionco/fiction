<template>
  <div class="my-12">
    <div class="figure-stage max-w-screen-lg m-auto relative">
      <img
        class="
          variant-editor
          shadow-xl
          ring-1 ring-black ring-opacity-10
          rounded-md
        "
        :src="screenshotReplay"
        alt="Session Replay - Dashboard"
      />

      <img
        class="
          shadow-2xl
          ring-1 ring-black ring-opacity-10
          rounded-md
          absolute
          -bottom-7
          -right-7
          w-80
        "
        :src="screenshotReplayPoi"
        alt="Session Replay - Points of Interest"
      />
    </div>
  </div>
</template>

<script lang="ts">
import screenshotReplay from "./img/screenReplay.webp"
import screenshotReplayPoi from "./img/screenReplayPoi.webp"
export default {
  setup() {
    return { screenshotReplay, screenshotReplayPoi }
  },
}
</script>
<style lang="less" scoped></style>
