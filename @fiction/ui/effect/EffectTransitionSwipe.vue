<script setup lang="ts">
defineOptions({ name: 'EffectTransitionSwipe' })
const {
  dir = 'left',
} = defineProps<{
  dir?: 'left' | 'right'
}>()
</script>

<template>
  <transition :name="dir" mode="out-in">
    <slot />
  </transition>
</template>

<style lang="less">
// Left/Right slide transitions for mobile
.left-enter-active,
.left-leave-active,
.right-enter-active,
.right-leave-active {
  transition: transform 0.2s cubic-bezier(0.25,1,0.33,1);
  position: absolute;
  width: 100%;
  top: 0;
}

// Initial states
.left-enter-from {
  transform: translateX(200%);
}
.left-leave-from {
  transform: translateX(0);
}
.left-leave-to {
  transform: translateX(-200%);
}

.right-enter-from {
  transform: translateX(-200%);
}
.right-leave-from {
  transform: translateX(0);
}
.right-leave-to {
  transform: translateX(200%);
}
</style>
