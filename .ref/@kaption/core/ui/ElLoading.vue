<script lang="ts" setup>
defineProps({
  width: { type: String, default: '' },
  colorMode: { type: String, default: 'primary' },
})
</script>

<template>
  <div class="loading-bar">
    <div class="bar h-3 bg-black/10">
      <div class="" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.kaption-arrow {
  animation: kaboom 1s ease-in-out alternate infinite;
  transform-origin: 50% right;
  animation-delay: 0.4s;
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  &:nth-child(3) {
    animation-delay: 0s;
  }
}
// https://css-tricks.com/animating-svg-css/
@keyframes kaboom {
  0% {
    fill: currentColor;
    opacity: 1;
  }
  50% {
    fill: currentColor;
    opacity: 0.2;
  }

  100% {
    fill: currentColor;
    opacity: 0.2;
  }
}
</style>
