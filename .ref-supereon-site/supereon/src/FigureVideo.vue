<script lang="ts" setup>
import { vue } from '@factor/api'

defineProps({
  orient: { type: String as vue.PropType<'left' | 'right'>, required: true },
})

vue.onMounted(() => {
  const video = document.querySelector('#anim-vid') as
    | HTMLVideoElement
    | undefined
  if (!video)
    return
  video.playbackRate = 0.3
})
</script>

<template>
  <div class="stage">
    <div class="video-background bg-theme-50 absolute">
      <video
        id="anim-vid"
        autoplay
        muted
        loop
        class=""
      >
        <source src="#" type="video/mp4">
      </video>
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
