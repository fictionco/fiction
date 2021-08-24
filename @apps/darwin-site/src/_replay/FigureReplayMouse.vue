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
        alt="Session Replay - Mouse"
      />

      <img
        class="
          shadow-2xl
          ring-1 ring-black ring-opacity-10
          rounded-md
          absolute
          -bottom-7
          left-12
          w-36
        "
        :src="screenshotReplayClick"
        alt="Session Replay - Click"
      />
    </div>
  </div>
</template>

<script lang="ts">
import screenshotReplay from "./img/screenReplayMouse.webp"
import screenshotReplayClick from "./img/thumbReplayClick.webp"
export default {
  setup() {
    return { screenshotReplay, screenshotReplayClick }
  },
}
</script>
<style lang="less" scoped></style>
