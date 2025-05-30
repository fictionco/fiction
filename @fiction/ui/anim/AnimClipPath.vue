<script lang="ts" setup>
import { shortId, vue } from '@fiction/core'
import { useElementVisible } from './index.js'

defineOptions({ name: 'AnimClipPath' })

const { animate, rounded = true, caller } = defineProps<{
  animate: 'swipe' | 'expand' | '' | boolean
  rounded?: boolean
  caller: string
}>()

const randomId = shortId()
const isVisible = vue.ref(false)

vue.onMounted(async () => {
  await useElementVisible({ caller: `animClipPath-${caller}`, selector: `#${randomId}`, onVisible: () => isVisible.value = true })
})

const endClip = vue.computed(() => rounded ? '[clip-path:inset(0_round_20px)]' : '[clip-path:inset(0)]')

const animateStyle = vue.computed(() => ({
  expand: { start: '[clip-path:inset(30%)] opacity-50', end: `${endClip.value} opacity-100` },
  swipe: { start: '[clip-path:inset(90%_0%_0_0)] opacity-0 scale-0', end: '[clip-path:inset(0)] opacity-100 scale-100' },
}))

const wrapClass = vue.computed(() => {
  if (!animate)
    return ''

  const out = ['clip-path-anim', 'transition-all']
  const styleKey = typeof animate === 'string' ? animate : 'expand'
  const stl = animateStyle.value[styleKey]

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
