<script lang="ts" setup>
import screenshotReplay from './img/replayMouse.webp'
import screenshotReplayClick from './img/replayClick.webp'
</script>

<template>
  <div class="my-12">
    <div class="figure-stage relative m-auto max-w-screen-lg">
      <img
        class="variant-editor rounded-md shadow-xl ring-1 ring-black/10"
        :src="screenshotReplay"
        alt="Session Replay - Mouse"
      >

      <img
        class="absolute -bottom-7 left-12 w-36 rounded-md shadow-2xl ring-1 ring-black/10"
        :src="screenshotReplayClick"
        alt="Session Replay - Click"
      >
    </div>
  </div>
</template>
