<script lang="ts" setup>
import { vue } from '@fiction/core'

const props = defineProps({
  mode: { type: String, default: 'dark' },
  altColor: { type: String, default: 'bg-theme-900' },
})

const std = 'h-6 bg-opacity-20 transition-all'

const colors = vue.computed(() => {
  if (props.mode === 'light') {
    return [
      'bg-theme-200',
      'bg-theme-100',
      'bg-theme-50',
      'bg-primary-300',
      'bg-primary-200',
    ]
  }
  else {
    return [
      'bg-primary-500',
      'bg-primary-500',
      'bg-primary-400',
      'bg-primary-800',
      props.altColor,
    ]
  }
})

const starts = [
  'col-[1/_span_4] md:col-[1/_span_1]',
  'col-[2/_span_4] md:col-[2/_span_1]',
  'col-[3/_span_4] md:col-[3/_span_1]',
  'col-[4/_span_4] md:col-[4/_span_1]',
  'col-[5/_span_4] md:col-[5/_span_1]',
  'col-[6/_span_4] md:col-[6/_span_1]',
  'col-[7/_span_4] md:col-[7/_span_1]',
  'col-[8/_span_4] md:col-[8/_span_1]',
  'col-[9/_span_4] md:col-[9/_span_1]',
  'col-[10/_span_4] md:col-[10/_span_1]',
  'col-[11/_span_4] md:col-[11/_span_1]',
  'col-[12/_span_4] md:col-[12/_span_1]',
  'col-[13/_span_4] md:col-[13/_span_1]',
  'col-[14/_span_4] md:col-[14/_span_1]',
  'col-[15/_span_4] md:col-[15/_span_1]',
  'col-[16/_span_4] md:col-[16/_span_1]',
  'col-[17/_span_4] md:col-[17/_span_1]',
  'col-[18/_span_4] md:col-[18/_span_1]',
  'col-[19/_span_4] md:col-[19/_span_1]',
  'col-[20/_span_4] md:col-[20/_span_1]',
  'col-[21/_span_4] md:col-[21/_span_1]',
  'col-[22/_span_4] md:col-[22/_span_1]',
  'col-[23/_span_4] md:col-[23/_span_1]',
  'col-[24/_span_4] md:col-[24/_span_1]',
  'col-[25/_span_4] md:col-[25/_span_1]',
  'col-[26/_span_4] md:col-[26/_span_1]',
  'col-[27/_span_4] md:col-[27/_span_1]',
  'col-[28/_span_4] md:col-[28/_span_1]',
  'col-[29/_span_4] md:col-[29/_span_1]',
  'col-[30/_span_4] md:col-[30/_span_1]',
  'col-[31/_span_4] md:col-[31/_span_1]',
  'col-[32/_span_4] md:col-[32/_span_1]',
  'col-[33/_span_4] md:col-[33/_span_1]',
  'col-[34/_span_4] md:col-[34/_span_1]',
  'col-[35/_span_4] md:col-[35/_span_1]',
  'col-[36/_span_4] md:col-[36/_span_1]',
  'col-[37/_span_4] md:col-[37/_span_1]',
  'col-[38/_span_4] md:col-[38/_span_1]',
  'col-[39/_span_4] md:col-[39/_span_1]',
  'col-[40/_span_4] md:col-[40/_span_1]',
  'col-[41/_span_4] md:col-[41/_span_1]',
  'col-[42/_span_4] md:col-[42/_span_1]',
  'col-[43/_span_4] md:col-[43/_span_1]',
  'col-[44/_span_4] md:col-[44/_span_1]',
  'col-[45/_span_4] md:col-[45/_span_1]',
  'col-[46/_span_4] md:col-[46/_span_1]',
]

const salt = vue.ref(0)
setInterval(() => (salt.value = Math.floor(Math.random() * 3) + 1), 10_000)

function getClass(): (string | number)[] {
  const randomElement = starts[Math.floor(Math.random() * starts.length)]
  const randomColor
    = colors.value[Math.floor(Math.random() * colors.value.length)]
  return [std, randomElement, randomColor, salt.value]
}
</script>

<template>
  <div
    class="grid-cols-24 skew-y-4 pointer-events-none absolute inset-0 z-0 -mx-4 grid skew-x-[24deg] overflow-hidden duration-1000"
    :style="{
      'grid-template-columns': 'repeat(48, minmax(0, 1fr))',
      'width': `150%`,
    }"
  >
    <div
      v-for="item in 90"
      :key="item"
      :class="[getClass(), item % 4 !== 0 ? 'hidden md:block' : '']"
    />
  </div>
</template>
