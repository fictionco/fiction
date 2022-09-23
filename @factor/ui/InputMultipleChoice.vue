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
        :selected="item.value && modelValue.includes(item.value) ? true : false"
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
  maxSelect: {
    type: [Number, String],
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

const emit = defineEmits<{
  (event: "update:modelValue", payload: string[]): void
}>()

const selectItem = (val: string) => {
  const hasValue = props.modelValue.indexOf(val)

  if (hasValue > -1) {
    const newList = props.modelValue.filter((v) => v != val)
    emit("update:modelValue", newList)
  } else {
    emit("update:modelValue", [...props.modelValue, val])
  }
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
