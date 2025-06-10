<script lang="ts" setup generic="T = string">
import type { StepItem } from '@fiction/core'
import { vue } from '@fiction/core'
import XSuperTitle from './common/XSuperTitle.vue'

const { steps = [], currentIndex, transit = 'next' } = defineProps<{
  steps?: StepItem<T>[]
  currentIndex: number
  transit?: 'next' | 'prev'
}>()

const t = vue.ref('next')
vue.watch(
  () => currentIndex,
  (v, old) => {
    if (v < old)
      t.value = 'prev'
    else
      t.value = 'next'
  },
)

const step = vue.computed(() => {
  const v = steps[currentIndex] || steps[0]
  return v
})
</script>

<template>
  <transition :name="transit" mode="out-in">
    <div
      v-if="step"
      :key="(steps[currentIndex]?.key as string)"
      class="relative z-10 mx-auto w-full p-4 md:p-10 rounded-xl shadow-xl"
      :class="step.class"
    >
      <div class="relative z-10 mb-4 flex gap-4 text-center justify-center">
        <div class="space-y-5">
          <XSuperTitle
            v-if="step.superTitle"
            class="justify-center"
            size="sm"
            :super-title="step.superTitle"
          />
          <div class="space-y-1">
            <h1 class="x-font-title text-xl font-semibold antialiased">
              {{ step.title }}
            </h1>
            <div class="text-theme-500 dark:text-theme-400 text-base antialiased font-sans">
              {{ step.subTitle }}
            </div>
          </div>
        </div>
        <div v-if="$slots.action">
          <slot name="action" :step="step" />
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
  transform: translateY(10vh);
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
  transform: translateY(-10vh);
}
</style>
