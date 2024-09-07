<script lang="ts" setup>
import { shortId, vue } from '@fiction/core'
import type { NumberFormats } from '@fiction/core'
import { animateNumber } from '../anim'

const props = defineProps({
  tag: { type: String as vue.PropType<'h1' | 'h2' | 'h3' | 'div' | 'span' | 'p' | 'a'>, default: 'div' },
  modelValue: { type: Number, default: 0 },
  animate: { type: [Boolean] as vue.PropType< boolean>, default: undefined },
  format: { type: String as vue.PropType<NumberFormats>, default: 'abbreviated' },
})

const randomId = shortId()

const loaded = vue.ref(false)
const xNumber = vue.ref<HTMLElement | undefined>()
function loadAnimation() {
  loaded.value = true

  if (!xNumber.value)
    return

  animateNumber(xNumber.value, props.modelValue, props.format)
}

vue.onMounted(() => {
  if (props.animate)
    loadAnimation()
  else
    loaded.value = true

  vue.watch(() => props.modelValue, () => {
    if (props.animate)
      loadAnimation()
    else
      loaded.value = true
  })
})
</script>

<template>
  <component
    :is="tag"
    :id="randomId"
    ref="xNumber"
    :class="loaded ? '' : 'invisible'"
    class="focus:outline-none "
    v-html="modelValue"
  />
</template>
