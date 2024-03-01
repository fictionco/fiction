<script lang="ts" setup>
import { computed, ref } from 'vue'

const props = defineProps({
  mode: { type: String, default: 'dark' },
})

const std = 'h-6 col-span-2 md:col-span-1 bg-opacity-20 transition-all'

const colors = computed(() => {
  if (props.mode === 'light') {
    return [
      'bg-theme-300',
      'bg-theme-100',
      'bg-theme-300',
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
      'bg-amber-500',
    ]
  }
})

const starts = [
  'xs:col-start-1',
  'xs:col-start-2',
  'xs:col-start-3',
  'xs:col-start-4',
  'xs:col-start-5',
  'xs:col-start-6',
  'xs:col-start-7',
  'xs:col-start-8',
  'xs:col-start-9',
  'xs:col-start-10',
  'xs:col-start-11',
  'xs:col-start-12',
  'xs:col-start-13',
  'xs:col-start-14',
  'xs:col-start-15',
  'xs:col-start-16',
  'xs:col-start-17',
  'xs:col-start-18',
  'xs:col-start-19',
  'xs:col-start-20',
  'xs:col-start-21',
  'xs:col-start-22',
  'xs:col-start-23',
]

const salt = ref(0)
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
    class="grid-cols-24 pointer-events-none absolute bottom-16 z-0 -mx-4 grid skew-x-12 skew-y-3 gap-2 duration-1000"
    :style="{
      'grid-template-columns': 'repeat(24, minmax(0, 1fr))',
      'width': `105%`,
    }"
  >
    <div
      v-for="item in 32"
      :key="item"
      :class="getClass()"
    />
  </div>
</template>
