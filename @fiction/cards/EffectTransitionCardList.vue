<script lang="ts" setup>
defineProps({
  disabled: { type: Boolean, default: false },
})
</script>

<template>
  <transition-group :name="!disabled ? 'cardList' : ''">
    <slot />
  </transition-group>
</template>

<style lang="less">
.cardList-enter-active,
.cardList-move {
  transition: all 600ms cubic-bezier(0.25,1,0.33,1);
  transform-origin: center;
}

.cardList-enter-from {
  opacity: 0;
  transform: translateY(-100px) scale(0.9);
}

.cardList-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.cardList-leave-active {
  width: 100%;
  transition: none;
}

.cardList-leave-to {
  opacity: 0;
  transform: none;
}
</style>
