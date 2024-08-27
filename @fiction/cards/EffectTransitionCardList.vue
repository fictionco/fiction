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
.cardList-leave-active,
.cardList-move {
  transition: all 600ms cubic-bezier(0.25,1,0.33,1);
  transform-origin: center;
}

.cardList-enter-from {
  opacity: 0;
  transform: translateY(-200px) scale(0.8);
}

.cardList-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.cardList-leave-active {
  position: absolute;
  width: 100%;
}

.cardList-leave-to {
  opacity: 0;
  transform: translateY(200px) scale(0.8);
}
</style>
