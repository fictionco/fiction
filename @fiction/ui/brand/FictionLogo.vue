<script lang="ts" setup>
import { vue } from '@fiction/core'

import { animateItemEnter } from '../anim'

defineProps({
  colorMode: { type: String, default: 'primary' },
})

const randomId = vue.useId()
function doHoverAnimation() {
  animateItemEnter({ targets: `#${randomId} .fx`, themeId: 'pop', totalTime: 600 })
}
</script>

<template>
  <div :id="randomId" class="spinner h-full " @mouseenter="doHoverAnimation()">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class=" h-full max-h-full max-w-full origin-center loader fx"
    ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12h18" /><path d="M12 21v-18" /><path d="M7.5 7.5l9 9" /><path d="M7.5 16.5l9 -9" /></svg>
  </div>
</template>

<style lang="less" scoped>
.spinner:hover {
  .loader {
    animation: kaboom 2s ease-in-out alternate infinite;
    transform-origin: 50% 50%;
    will-change: fill;
  }

}

@keyframes kaboom {
  0% {
    opacity: 1;
  }
  50% {
    opacity: .8;
  }
  100% {
    opacity: 1;
  }
}
</style>
