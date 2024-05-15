<script lang="ts" setup>
import { shortId, vue } from '@fiction/core'
import { useElementVisible } from '.'

defineOptions({ name: 'AnimClipPath' })

const props = defineProps({
  animate: { type: [Boolean, String] as vue.PropType<'swipe' | 'expand' | '' | boolean>, default: false },
})

const randomId = shortId()
const isVisible = vue.ref(false)

vue.onMounted(async () => {
  await useElementVisible({ selector: `#${randomId}`, onVisible: () => isVisible.value = true })
})

const animateStyle = {
  expand: { start: '[clip-path:inset(30%)] opacity-50', end: '[clip-path:inset(0_round_20px)] opacity-100' },
  swipe: { start: '[clip-path:inset(90%_0%_0_0)] opacity-0 scale-0', end: '[clip-path:inset(0)] opacity-100 scale-100' },
}

const wrapClass = vue.computed(() => {
  if (!props.animate)
    return ''

  const out = ['clip-path-anim']
  const styleKey = typeof props.animate === 'string' ? props.animate : 'expand'
  const stl = animateStyle[styleKey]

  if (isVisible.value)
    out.push(stl.end)
  else
    out.push(stl.start)

  return out.join(' ')
})
</script>

<template>
  <div :id="randomId" :class="wrapClass">
    <slot />
  </div>
</template>

<style lang="less">
.clip-path-anim{
  transition: clip-path 2s cubic-bezier(0.25, 1, 0.33, 1), opacity 2s cubic-bezier(0.25, 1, 0.33, 1), transform 2s cubic-bezier(0.25, 1, 0.33, 1);
}
</style>
