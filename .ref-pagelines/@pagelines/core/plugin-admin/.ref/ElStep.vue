<script lang="ts" setup>
import type { MenuItem } from '@factor/api'
import { vue } from '@factor/api'
import ContentBox from '../../ui/ContentBox.vue'

const props = defineProps({
  sup: {
    type: String,
    default: '',
  },
  steps: {
    type: Array as vue.PropType<(MenuItem & { choices?: MenuItem[] })[]>,
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
    <ContentBox
      :key="steps[currentIndex].key"
      class="relative z-10 mx-auto w-full max-w-xl"
      wrap-class="p-6 md:p-14"
    >
      <div class="relative z-10">
        <div
          v-if="sup"
          class="sup text-theme-400 mb-4 text-sm font-bold uppercase tracking-wide"
        >
          {{ sup }}
        </div>
        <h1 class="text-2xl font-extrabold tracking-tight md:text-3xl">
          {{ step.name }}
        </h1>
        <div class="text-theme-500 mx-auto mt-2 max-w-3xl text-lg md:text-xl">
          <div class="font-semibold">
            {{ step.desc }}
          </div>
        </div>
      </div>
      <div class="relative z-10 mx-auto mt-8 max-w-prose">
        <slot :step="step" />
      </div>
    </ContentBox>
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
