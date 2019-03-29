<template>
  <div class="loading-ring-wrap">
    <div :style="{width}" class="loader">
      <svg class="circular" viewBox="25 25 50 50">
        <circle
          class="path"
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

<script>
export default {
  props: {
    width: { type: String, default: "3em" }
  }
}
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

.circular {
  animation: rotate 2s linear infinite;
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

.path {
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;

  stroke-linecap: round;
}

.path {
  animation: dash 1s ease-in-out infinite, multicolor 3s ease-in-out infinite;
}

.lightcolor .path {
  animation: dash 1s ease-in-out infinite, lightcolor 3s ease-in-out infinite;
}

.darkcolor .path {
  animation: dash 1s ease-in-out infinite, darkcolor 3s ease-in-out infinite;
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
@keyframes multicolor {
  0%,
  100% {
    stroke: @color-secondary;
  }
  40% {
    stroke: @color-secondary;
  }
  50% {
    stroke: @color-primary;
  }
  80%,
  90% {
    stroke: @color-primary;
  }
}
@keyframes lightcolor {
  0%,
  100% {
    stroke: hsla(0, 0%, 100%, 0.9);
  }
  40% {
    stroke: hsla(0, 0%, 100%, 0.9);
  }
  66% {
    stroke: hsla(0, 0%, 100%, 0.9);
  }
  80%,
  90% {
    stroke: hsla(0, 0%, 100%, 0.9);
  }
}

@keyframes darkcolor {
  0%,
  100% {
    stroke: rgba(0, 0, 0, 0.6);
  }
  40% {
    stroke: rgba(0, 0, 0, 0.6);
  }
  66% {
    stroke: rgba(0, 0, 0, 0.6);
  }
  80%,
  90% {
    stroke: rgba(0, 0, 0, 0.6);
  }
}
</style>
