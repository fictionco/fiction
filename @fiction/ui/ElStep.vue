<script lang="ts" setup>
import type { StepItem } from '@fiction/core'
import { vue } from '@fiction/core'

const props = defineProps({
  sup: {
    type: String,
    default: '',
  },
  steps: {
    type: Array as vue.PropType<StepItem[]>,
    required: true,
  },
  currentIndex: {
    type: Number,
    required: true,
  },
  transit: {
    type: String,
    default: 'next',
  },
})
const t = vue.ref('next')
vue.watch(
  () => props.currentIndex,
  (v, old) => {
    if (v < old)
      t.value = 'prev'
    else
      t.value = 'next'
  },
)

const step = vue.computed(() => {
  const v = props.steps[props.currentIndex] || props.steps[0]
  return v
})
</script>

<template>
  <transition :name="t" mode="out-in">
    <div
      v-if="step"
      :key="steps[currentIndex]?.key"
      class="relative z-10 mx-auto w-full bg-theme-0 dark:bg-theme-950 text-theme-900 dark:text-theme-0 p-12 rounded-xl shadow-xl"
      :class="step.class"
    >
      <div class="relative z-10 mb-4">
        <div
          v-if="sup"
          class="sup text-theme-400 mb-4 text-sm font-bold uppercase tracking-wide"
        >
          {{ sup }}
        </div>
        <h1 class="x-font-title text-2xl font-bold">
          {{ step.name }}
        </h1>
        <div class="text-theme-500  mt-1 text-base">
          {{ step.desc }}
        </div>
      </div>
      <div class="relative z-10">
        <slot :step="step" />
      </div>
    </div>
  </transition>
</template>

<style lang="less">
.next-enter-from,
.prev-leave-to {
  opacity: 0;
  transform: translateY(50vh);
}
.next-enter-to,
.next-leave-from,
.prev-enter-to,
.prev-leave-from {
  transform: translateY(0);
}
.next-enter-active,
.next-leave-active,
.prev-enter-active,
.prev-leave-active {
  transition: 0.3s ease;
  transition-property: opacity, transform;
}

.next-leave-to,
.prev-enter-from {
  opacity: 0;
  transform: translateY(-50vh);
}
</style>
