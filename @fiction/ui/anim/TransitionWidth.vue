<script lang="ts" setup>
defineOptions({ name: 'TransitionWidth' })

// Cache initial values to avoid reflows
type CachedState = {
  width: string
  hasBeenMeasured: boolean
}

const cache = new WeakMap<HTMLElement, CachedState>()

function cacheWidth(el: HTMLElement): CachedState {
  if (!cache.has(el)) {
    // Get computed width once and cache it
    const width = el.getAttribute('data-width') || getComputedStyle(el).width
    cache.set(el, { width, hasBeenMeasured: true })
  }
  return cache.get(el)!
}

function beforeEnter(el: HTMLElement) {
  const { width } = cacheWidth(el)
  // Set initial state efficiently
  Object.assign(el.style, {
    width,
    overflow: 'hidden',
    maxWidth: '0',
  })
}

function enter(el: HTMLElement) {
  // Use double RAF for better browser paint optimization
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const { width } = cacheWidth(el)
      el.style.maxWidth = width
    })
  })
}

function leave(el: HTMLElement) {
  const state = cacheWidth(el)

  // Update cached width before transition
  state.width = getComputedStyle(el).width
  el.setAttribute('data-width', state.width)

  Object.assign(el.style, {
    maxWidth: state.width,
    overflow: 'hidden',
  })

  // Single reflow
  void el.offsetWidth

  requestAnimationFrame(() => {
    el.style.maxWidth = '0'
  })
}

function afterTransition(el: HTMLElement) {
  // Clean up
  const propertiesToReset = ['maxWidth', 'overflow']
  propertiesToReset.forEach(prop => el.style[prop as any] = '')

  // Clear cache when done
  cache.delete(el)
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
  transition: max-width 0.4s cubic-bezier(0.25,1,0.33,1);
  will-change: max-width;
  contain: layout;
}

.width-enter-from,
.width-leave-to {
  max-width: 0 !important;
}
</style>
