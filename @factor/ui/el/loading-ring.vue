<template>
  <div class="loading-ring-wrap">
    <div :style="{width}" class="loader">
      <svg class="ring-circular" viewBox="25 25 50 50">
        <circle
          class="ring-path"
          cx="50"
          cy="50"
          r="20"
          fill="none"
          stroke-width="5"
          stroke-miterlimit="30"
        />
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  props: {
    width: { type: String, default: "3em" }
  }
})
</script>

<style lang="less">
.loading-ring-wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.loader {
  position: relative;
  margin: 0 auto;
  &:before {
    content: "";
    display: block;
    padding-top: 100%;
  }
}

.ring-circular {
  animation: rotate 1s linear infinite;
  height: 100%;
  transform-origin: center center;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}

.ring-path {
  will-change: stroke-dasharray;
  will-change: stroke-dashoffset;
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  stroke: var(--color-placeholder);
  stroke-linecap: round;
  animation: dash 1s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}
@keyframes dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35px;
  }
  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124px;
  }
}
</style>
