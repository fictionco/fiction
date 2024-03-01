<script lang="ts" setup>
import screenshotReplay from './img/replayScreen.webp'
import screenshotReplayPoi from './img/replayPoi.webp'
</script>

<template>
  <div class="my-12">
    <div class="figure-stage relative m-auto max-w-screen-lg">
      <img
        class="variant-editor rounded-md shadow-xl ring-1 ring-black/10"
        :src="screenshotReplay"
        alt="Session Replay - Dashboard"
      >

      <img
        class="absolute -bottom-7 -right-7 w-80 rounded-md shadow-2xl ring-1 ring-black/10"
        :src="screenshotReplayPoi"
        alt="Session Replay - Points of Interest"
      >
    </div>
  </div>
</template>
