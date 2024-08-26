<script lang="ts" setup>
defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <TransitionGroup :name="!disabled ? 'nlist' : ''">
    <slot />
  </TransitionGroup>
</template>

<style lang="less">
.nlist-enter-active,
.nlist-leave-active,
.nlist-move {
  transition: all 600ms cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.nlist-enter-from {
  opacity: 0;
  transform: translateX(-30px) scale(0.9) ;
}

.nlist-enter-to {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.nlist-leave-active {
  position: absolute;
  width: 100%;
}

.nlist-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
