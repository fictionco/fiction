<template>
  <div
    class="space-y-2 outline-none"
    tabindex="0"
    @keyup="selectByLetter($event)"
  >
    <InputElTab
      v-if="parsedList.length == 0"
      prefix="-"
      label="No options"
    ></InputElTab>
    <template v-else>
      <InputElTab
        v-for="(item, i) in parsedList"
        :key="item.value"
        class="cursor-pointer"
        :selected="isSelected(item)"
        :not-selected="!isSelected(item) && modelValue.length >= limit"
        :prefix="choiceLetter(i)"
        :label="item.name"
        @click="selectItem(item.value ?? '')"
      ></InputElTab>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { ListItem, normalizeList, vue } from "@factor/api"
import InputElTab from "./InputElTab.vue"

const props = defineProps({
  modelValue: { type: Array as vue.PropType<string[]>, default: () => [] },
  list: {
    type: Array as vue.PropType<(ListItem | "divider" | string)[]>,
    default: () => [],
  },
  limit: {
    type: Number,
    default: 1,
  },
  selectLetters: {
    type: String,
    default: "abcdefghijklmnopqrstuvwxyz",
  },
})

const choiceLetter = (i: number): string => {
  const remain = i % 26
  const letters = props.selectLetters
  return letters[remain].toUpperCase()
}

const isSelected = (item: ListItem): boolean => {
  return props.modelValue.includes(item.value ?? "")
}

const emit = defineEmits<{
  (event: "update:modelValue", payload: string[]): void
}>()

const selectItem = (val: string) => {
  const hasValue = props.modelValue.indexOf(val)

  let newList: string[]
  if (hasValue > -1) {
    newList = props.modelValue.filter((v) => v != val)
  } else {
    newList = [...props.modelValue, val]

    newList.slice(-1 * +props.limit)
  }

  emit("update:modelValue", newList)
}

const parsedList = vue.computed<ListItem[]>(() => {
  const li = props.list ? normalizeList(props.list) : []

  return li
})

const selectByLetter = (ev: KeyboardEvent) => {
  const letter = ev.key.toLowerCase()
  const index = "abcdefghijklmnopqrstuvwxyz".indexOf(letter)
  const val = parsedList.value[index]?.value
  if (val) selectItem(val)
}
</script>
