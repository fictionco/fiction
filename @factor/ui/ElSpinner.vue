<template>
  <div class="spinner max-w-sm">
    <svg
      class="ring-circular h-full w-full origin-center"
      viewBox="25 25 50 50"
    >
      <circle
        :class="colorMode"
        class="ring-path"
        cx="50"
        cy="50"
        r="20"
        fill="none"
        stroke="currentColor"
        stroke-width="5"
        stroke-miterlimit="30"
      />
    </svg>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  width: { type: String, default: "" },
  colorMode: { type: String, default: "primary" },
})
</script>

<style lang="less">
.ring-circular {
  animation: rotate 1s linear infinite;
}

.ring-path {
  will-change: stroke-dasharray;
  will-change: stroke-dashoffset;

  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;

  stroke-linecap: round;
  animation: dash 2s ease-in-out infinite;
  // &.placeholder {
  //   stroke: var(--color-placeholder, var(--color-bg-contrast));
  // }
  // &.primary {
  //   stroke: var(--color-primary);
  // }
  // &.secondary {
  //   stroke: var(--color-secondary);
  // }
  // &.text {
  //   stroke: var(--color-text);
  // }
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
