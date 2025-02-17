<script lang="ts" setup>
defineOptions({ name: 'TransitionWidth' })

type ElementStyles = Pick<CSSStyleDeclaration, 'width' | 'overflow'>

function beforeEnter(el: HTMLElement) {
  // Get target width from element
  const width = el.getAttribute('data-width') || getComputedStyle(el).width
  // Set initial state
  el.style.width = width
  el.style.overflow = 'hidden'
  el.style.maxWidth = '0'
}

function enter(el: HTMLElement) {
  requestAnimationFrame(() => {
    el.style.maxWidth = el.style.width
  })
}

function leave(el: HTMLElement) {
  // Store target width for reuse
  el.setAttribute('data-width', getComputedStyle(el).width)
  el.style.maxWidth = getComputedStyle(el).width
  el.style.overflow = 'hidden'

  void el.offsetWidth // Force reflow

  requestAnimationFrame(() => {
    el.style.maxWidth = '0'
  })
}

function afterTransition(el: HTMLElement) {
  // Clean up only transition properties
  el.style.maxWidth = ''
  el.style.overflow = ''
}
</script>

<template>
  <transition
    name="width"
    @before-enter="(el: Element) => beforeEnter(el as HTMLElement)"
    @enter="(el: Element) => enter(el as HTMLElement)"
    @after-enter="(el: Element) => afterTransition(el as HTMLElement)"
    @leave="(el: Element) => leave(el as HTMLElement)"
    @after-leave="(el: Element) => afterTransition(el as HTMLElement)"
  >
    <slot />
  </transition>
</template>

<style lang="less" scoped>
.width-enter-active,
.width-leave-active {
  transition: max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: max-width;
}

.width-enter-from,
.width-leave-to {
  max-width: 0 !important;
}
</style>
