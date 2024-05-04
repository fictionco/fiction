<script lang="ts" setup>
import { shortId, vue } from '@fiction/core'
import { useElementVisible } from '.'

defineOptions({ name: 'AnimClipPath' })

const props = defineProps({
  enabled: { type: Boolean, default: false },
})

const randomId = shortId()
const isVisible = vue.ref(false)

vue.onMounted(async () => {
  await useElementVisible({ selector: `#${randomId}`, onVisible: () => isVisible.value = true })
})

const wrapClass = vue.computed(() => {
  if (!props.enabled)
    return ''

  let out = 'clip-path-anim'

  if (isVisible.value)
    out += ' [clip-path:inset(0_round_20px)] opacity-100'
  else
    out += ' [clip-path:inset(30%)] opacity-50'

  return out
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
