<script lang="ts" setup>
import { vue } from '@factor/api'

const props = defineProps({
  interval: { type: Number, default: 500 },

  text: { type: String, default: '' },
})
const progress = vue.ref(5)
const runs = vue.ref(0)
const color = vue.computed(() =>
  runs.value % 2 === 0 ? 'bg-theme-900' : 'bg-primary-600',
)
let count = 0

function initialize(): void {
  const progressInterval = setInterval(() => {
    count++
    progress.value += 5 + count

    if (progress.value >= 100) {
      clearInterval(progressInterval)
      setTimeout(() => {
        progress.value = 0
        count = 0
        runs.value++
      }, 200)

      setTimeout(() => {
        initialize()
      }, 500)
    }
  }, props.interval)
}

initialize()
</script>

<template>
  <div class="pointer-events-none w-[30rem] max-w-lg">
    <div class="loader">
      <div
        v-if="text"
        class="progress-text text-theme-300 m-3 whitespace-nowrap text-center text-sm font-semibold uppercase transition-all"
        :class="progress > 97 || progress < 3 ? 'opacity-0' : ''"
      >
        {{ text }}
      </div>
      <div
        class="progress-bar-wrap relative h-3 w-full max-w-2xl overflow-hidden rounded-full"
        :style="{ height: progress > 97 || progress < 3 ? '0' : '' }"
      >
        <div class="absolute h-full w-full rounded-full bg-primary-200/10" />
        <div
          class="progress-bar relative h-full w-0 rounded-full"
          :class="color"
          :style="{ width: `${progress}%` }"
        >
          <div class="barber" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
@keyframes barberpole {
  100% {
    background-position: 100% 100%;
  }
}
.progress-bar-wrap {
  transition: height 0.3s;
}
.progress-bar {
  transition: width 1s;

  .barber {
    position: absolute;
    height: 100%;
    width: 100%;
    background-size: 1000% 1000%;
    background-image: repeating-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.12),
      rgba(255, 255, 255, 0.12) 1rem,
      transparent 1rem,
      transparent 2rem
    );
    animation: barberpole 30s linear infinite;
  }
}
</style>
