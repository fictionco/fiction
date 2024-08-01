<script lang="ts" setup>
import { vue } from '@fiction/core'

defineProps({
  isDev: { type: Boolean, default: false },
})
const ready = vue.ref(false)

vue.onMounted(() => {
  ready.value = true
})
vue.onBeforeUnmount(() => {
  ready.value = false
})
</script>

<template>
  <div
    class="loading-veil text-theme-500 fixed inset-0 z-50 flex h-full w-full items-center justify-center"
  >
    <div class="text-center">
      <div class="text-theme-600 mb-3 w-40 text-center opacity-70">
        <Transition name="fade">
          <div
            v-if="ready"
            class="progress-bar bg-theme-100 relative mx-auto h-2 w-full max-w-md overflow-hidden rounded-lg"
          >
            <div
              class="progress-bar-filled bg-theme-400 absolute left-0 top-0 h-full rounded-lg"
            />
          </div>
        </Transition>
      </div>

      <Transition name="fade-up" mode="in-out">
        <div v-if="false" class="text-theme-300 text-[10px]">
          Powered by
          <a href="https://www.fiction.com">Fiction.com</a>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style lang="less">
.progress-bar {
  .progress-bar-filled {
    animation: 1s prog ease-in-out infinite;
  }
}

@keyframes prog {
  0% {
    left: 0;
    transform: translateX(-100%);
    width: 70%;
  }
  100% {
    left: 100%;
    transform: translateX(0%);
    width: 50%;
  }
}

.fade-up-enter-active {
  transition: all 1s cubic-bezier(0.28, 0.53, 0.55, 0.95);
}

.fade-up-leave-active {
  transition: all 1s cubic-bezier(0.48, 0.1, 0.7, 0.49);
}

.fade-up-enter-from,
.fade-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
