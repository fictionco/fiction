<script lang="ts" setup>
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
    @before-enter="(el) => beforeEnter(el as HTMLElement)"
    @enter="(el) => enter(el as HTMLElement)"
    @after-enter="(el) => resetMaxHeight(el as HTMLElement)"
    @leave="(el) => leave(el as HTMLElement)"
    @after-leave="(el) => resetMaxHeight(el as HTMLElement)"
  >
    <slot />
  </transition>
</template>

<style lang="less" scoped>
.height-animation-enter-active,
.height-animation-leave-active {
  transition: max-height .25s cubic-bezier(.65,.01,.38,.99), opacity .25s cubic-bezier(.65,.01,.38,.99);
  overflow: hidden;
  user-select: none;
  will-change: max-height, opacity; /* Prepares the browser for these changes */

}
.height-animation-enter, .height-animation-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
