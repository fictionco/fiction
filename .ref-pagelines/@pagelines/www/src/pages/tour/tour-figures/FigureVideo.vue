<script lang="ts" setup>
import { vue } from '@factor/api'
import vid from './img/girl-spin.mp4'

vue.onMounted(() => {
  const video = document.querySelector('#anim-vid') as
    | HTMLVideoElement
    | undefined
  if (!video)
    return
  video.playbackRate = 0.9
})
</script>

<template>
  <div class="stage relative mb-6 h-48 w-full py-0 lg:mb-0 lg:h-full">
    <div class="video-background bg-theme-50 absolute">
      <video
        id="anim-vid"
        autoplay
        muted
        loop
      >
        <source :src="vid" type="video/mp4">
      </video>
      <div
        class="absolute right-0 h-full w-24 bg-gradient-to-r from-white/0 via-white/80 to-white"
      />
    </div>
  </div>
</template>

<style lang="less">
.video-background {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.video-background video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
