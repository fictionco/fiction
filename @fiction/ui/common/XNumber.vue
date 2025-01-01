<script lang="ts" setup>
import type { NumberFormats } from '@fiction/core'
import { formatNumber, shortId, vue } from '@fiction/core'
import { animateNumber } from '../anim'

defineOptions({ name: 'XNumber' })

const { tag = 'div', modelValue = 0, animate = false, format = 'abbreviated', prefix, suffix } = defineProps<{
  tag?: 'h1' | 'h2' | 'h3' | 'div' | 'span' | 'p' | 'a'
  modelValue: number | string
  animate?: boolean
  format?: NumberFormats
  prefix?: string
  suffix?: string
}>()

const randomId = shortId()

const loaded = vue.ref(false)
const xNumber = vue.ref<HTMLElement | undefined>()

function loadAnimation() {
  loaded.value = true

  if (!xNumber.value)
    return

  animateNumber(xNumber.value, modelValue, format, { prefix, suffix })
}

vue.onMounted(() => {
  if (animate)
    loadAnimation()
  else
    loaded.value = true

  vue.watch(() => modelValue, () => {
    if (animate)
      loadAnimation()
    else
      loaded.value = true
  })
})

const displayValue = vue.computed(() => {
  return !animate ? formatNumber(modelValue, format, { prefix, suffix }) : `${prefix || ''}${modelValue}${suffix || ''}`
})
</script>

<template>
  <component
    :is="tag"
    :id="randomId"
    ref="xNumber"
    :class="loaded ? '' : 'invisible'"
    class="focus:outline-none "
    v-html="displayValue"
  />
</template>
