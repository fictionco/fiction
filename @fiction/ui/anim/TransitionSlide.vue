<script lang="ts" setup>
defineOptions({ name: 'TransitionSlide' })

// Animation hooks with type safety for HTMLElement
function beforeEnter(el: HTMLElement) {
  el.style.maxHeight = '0'
}

function enter(el: HTMLElement) {
  el.style.maxHeight = '0'
  requestAnimationFrame(() => {
    el.style.maxHeight = `${el.scrollHeight}px`
  })
}

function leave(el: HTMLElement) {
  el.style.maxHeight = `${el.scrollHeight}px`
  void el.offsetHeight
  requestAnimationFrame(() => {
    el.style.maxHeight = '0'
  })
}
function resetMaxHeight(el: HTMLElement) {
  // Remove max-height after animations to prevent layout issues
  el.style.maxHeight = ''
}
</script>

<template>
  <transition
    name="height-animation"
    @before-enter="(el: Element) => beforeEnter(el as HTMLElement)"
    @enter="(el: Element) => enter(el as HTMLElement)"
    @after-enter="(el: Element) => resetMaxHeight(el as HTMLElement)"
    @leave="(el: Element) => leave(el as HTMLElement)"
    @after-leave="(el: Element) => resetMaxHeight(el as HTMLElement)"
  >
    <slot />
  </transition>
</template>

<style lang="less" scoped>
.height-animation-enter-active,
.height-animation-leave-active {
  transition: max-height .20s cubic-bezier(.65,.01,.38,.99), opacity .15s cubic-bezier(.65,.01,.38,.99);
  overflow: hidden;
  user-select: none;
  will-change: transform, height, opacity;
  backface-visibility: hidden;
  perspective: 1000;
  user-select: none;
  perspective: 1000;
}
.height-animation-enter, .height-animation-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
