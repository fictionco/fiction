<script lang="ts" setup>
import type { MediaObject, StandardSize } from '@fiction/core'
import { vue } from '@fiction/core'
import InputElBox from './InputElBox.vue'

defineOptions({ name: 'InputRating' })

const { modelValue, countStart = 0, countEnd = 5, labels, uiSize = 'md', icon } = defineProps<{
  modelValue?: number
  countStart?: number | string
  countEnd?: number | string
  labels?: { low?: string, middle?: string, high?: string }
  uiSize?: StandardSize
  icon?: MediaObject
}>()
const emit = defineEmits<{
  (event: 'update:modelValue', payload: number | undefined): void
  (event: 'continue', payload: number | undefined): void
}>()
const attrs = vue.useAttrs()

const validEl = vue.ref<HTMLInputElement>()
const isValid = vue.ref(-1)

function selectItem(val?: number) {
  emit('update:modelValue', val)

  setTimeout(() => {
    if (val !== undefined)
      emit('continue', val)
  }, 500)
}

const parsedList = vue.computed<number[]>(() => {
  const list: number[] = []
  for (let i = +countStart; i <= +countEnd; i++)
    list.push(i)

  return list
})

function selectByLetter(ev: KeyboardEvent) {
  const keyVal = Number.parseInt(ev.key)

  const index = parsedList.value.indexOf(keyVal)
  const val = parsedList.value[index]
  if (val)
    selectItem(val)
}

const cleanups: (() => void)[] = []
vue.onMounted(() => {
  const uw = vue.watch(
    () => modelValue,
    (val) => {
      const min = attrs.required === undefined ? 0 : 1

      if (min && !val) {
        validEl.value?.setCustomValidity(`Please select one`)
        isValid.value = 0
      }
      else {
        validEl.value?.setCustomValidity('')
        isValid.value = 1
      }
    },
    { immediate: true },
  )

  cleanups.push(uw)
})

vue.onBeforeUnmount(() => {
  cleanups.forEach(fn => fn())
})
</script>

<template>
  <div
    class="outline-none"
    tabindex="0"
    @keyup="selectByLetter($event)"
  >
    <div class="flex space-x-2">
      <InputElBox
        v-for="item in parsedList"
        :key="item"
        :selected="item === modelValue ? true : false"
        :not-selected="
          typeof modelValue !== 'undefined' && item !== modelValue ? true : false
        "
        :prefix="item"
        :label="item"
        :icon
        :ui-size="uiSize"
        @click="selectItem(item)"
      />
    </div>
    <div v-if="labels" class="text-theme-600 mt-2 grid grid-cols-3 text-xs font-sans">
      <div>{{ labels.low }}</div>
      <div class="text-center">
        {{ labels.middle }}
      </div>
      <div class="text-right">
        {{ labels.high }}
      </div>
    </div>
    <!-- For validation -->
    <input
      ref="validEl"
      class="pointer-events-none float-left h-0 w-0 p-0 opacity-0"
      type="text"
      :value="modelValue"
      :isValid="isValid"
    >
  </div>
</template>
