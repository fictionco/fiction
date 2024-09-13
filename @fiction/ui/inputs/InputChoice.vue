<script lang="ts" setup>
import type { ListItem } from '@fiction/core'
import type { RouteLocationRaw } from 'vue-router'
import { normalizeList, vue } from '@fiction/core'
import InputElTab from './InputElTab.vue'

type RouteListItem = ListItem & { route?: RouteLocationRaw }

const props = defineProps({
  modelValue: { type: [Number, String], default: undefined },
  list: {
    type: Array as vue.PropType<
      (RouteListItem | string)[] | readonly (RouteListItem | string)[]
    >,
    default: () => [],
  },
})

const emit = defineEmits<{
  (
    event: 'update:modelValue',
    payload: number | string | undefined | undefined,
  ): void
  (event: 'continue', payload: number | string | undefined | undefined): void
}>()

const attrs = vue.useAttrs()

const validEl = vue.ref<HTMLInputElement>()
const isValid = vue.ref(-1)

function selectItem(val?: number | string | undefined) {
  emit('update:modelValue', val)

  setTimeout(() => {
    if (val !== undefined)
      emit('continue', val)
  }, 500)
}

const parsedList = vue.computed(() => {
  return normalizeList(props.list)
})

vue.onMounted(() => {
  vue.watch(
    () => props.modelValue,
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
})
</script>

<template>
  <div class="outline-none" tabindex="0">
    <div class="flex space-x-2">
      <InputElTab
        v-for="(item, i) in parsedList"
        :key="i"
        :selected="item.value === modelValue ? true : false"
        :not-selected="
          typeof modelValue !== 'undefined' && item.value !== modelValue
            ? true
            : false
        "
        :label="item.name"
        @click="selectItem(item.value)"
      />
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
