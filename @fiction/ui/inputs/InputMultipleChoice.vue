<script lang="ts" setup>
import type { ListItem } from '@fiction/core'
import { normalizeList, vue } from '@fiction/core'
import InputElTab from './InputElTab.vue'

const props = defineProps({
  modelValue: { type: Array as vue.PropType<(string | number)[]>, default: () => [] },
  list: { type: Array as vue.PropType<(ListItem | 'divider' | string | number)[]>, default: () => [] },
  min: { type: Number, default: undefined },
  max: { type: Number, default: 1 },
  selectLetters: { type: String, default: 'abcdefghijklmnopqrstuvwxyz' },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: (string | number)[]): void
  (event: 'continue', payload: (string | number)[]): void
}>()

const maximum = vue.computed(() =>
  props.min && props.max < props.min ? props.min : props.max,
)

const attrs = vue.useAttrs()

const validEl = vue.ref<HTMLInputElement>()
const isValid = vue.ref({})
function choiceLetter(i: number): string {
  const remain = i % 26
  const letters = props.selectLetters
  return letters[remain]?.toUpperCase() ?? ''
}

function isSelected(item: ListItem): boolean {
  return props.modelValue.includes(item.value ?? '')
}

function selectItem(val: string | number) {
  const hasValue = props.modelValue.indexOf(val)

  let newList: (string | number)[]
  if (hasValue > -1) {
    newList = props.modelValue.filter(v => v !== val)
  }
  else {
    newList = [...props.modelValue, val]

    // remove the first items if we are over the max
    if (props.max && newList.length > props.max)
      newList = newList.slice(newList.length - props.max)
  }

  emit('update:modelValue', newList)

  setTimeout(() => {
    if (props.max === 1 && newList.length === 1)
      emit('continue', newList)
  }, 500)
}

const parsedList = vue.computed<ListItem[]>(() => {
  const li = props.list ? normalizeList(props.list) : []

  return li
})

function selectByLetter(ev: KeyboardEvent) {
  const letter = ev.key.toLowerCase()
  const index = 'abcdefghijklmnopqrstuvwxyz'.indexOf(letter)
  const val = parsedList.value[index]?.value
  if (val)
    selectItem(val)
}

vue.onMounted(() => {
  vue.watch(
    () => props.modelValue,
    (val) => {
      const isRequired = attrs.required !== undefined
      const min = props.min ?? (isRequired ? 1 : 0)
      if ((min && !val) || val.length < min) {
        validEl.value?.setCustomValidity(`Please select ${min}`)
        isValid.value = { min, val, valid: false, isRequired }
      }
      else {
        validEl.value?.setCustomValidity('')
        isValid.value = { min, val, valid: true, isRequired }
      }
    },
    { immediate: true },
  )
})
</script>

<template>
  <div
    class="focus-input-wrap space-y-2 outline-none"
    tabindex="0"
    @keyup="selectByLetter($event)"
  >
    <InputElTab v-if="parsedList.length === 0" prefix="-" label="No options" />
    <template v-else>
      <InputElTab
        v-for="(item, i) in parsedList"
        :key="item.value"
        class="cursor-pointer"
        :selected="isSelected(item)"
        :not-selected="!isSelected(item) && modelValue.length >= max"
        :prefix="choiceLetter(i)"
        :label="item.name"
        @click="selectItem(item.value ?? '')"
      />

      <div class="max-w-input relative inline-block">
        <input
          ref="validEl"
          class="pointer-events-none absolute h-0 w-0 p-0 opacity-0"
          type="text"
          :value="modelValue"
          :isValid="JSON.stringify(isValid)"
          :maximum="maximum"
          tabindex="-1"
        >
      </div>
    </template>
  </div>
</template>
