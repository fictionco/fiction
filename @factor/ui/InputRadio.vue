<template>
  <div class="radio f-input">
    <label
      v-for="(option, i) in parsedList"
      :key="i"
      class="text-input-size my-2 flex cursor-pointer items-center"
      :for="option.value"
    >
      <input
        :id="option.value"
        v-model="selected"
        type="radio"
        :class="classes"
        name="radio-colors"
        :value="option.value"
        v-bind="$attrs"
      />
      <span class="text-theme-600 hover:text-theme-500 ml-[.5em]">{{
        option.name
      }}</span>
    </label>
  </div>
</template>
<script lang="ts" setup>
import { normalizeList, ListItem, vue } from "@factor/api"

const props = defineProps({
  modelValue: { type: String, default: "" },
  list: { type: Array as vue.PropType<ListItem[]>, default: () => [] },
})

const emit = defineEmits<{
  (event: "update:modelValue", payload: string): void
}>()
const selected = vue.ref<string>(props.modelValue)
const parsedList = normalizeList(props.list)
vue.watch(
  () => selected.value,
  (v) => {
    emit("update:modelValue", v)
  },
)

const classes = [
  "form-radio",
  "appearance-none",
  "border",
  "border-theme-300",
  "text-theme-500",
  "w-[.9em]",
  "h-[.9em]",
  "focus:border-theme-500",
  "focus:outline-none",
  "focus:ring-2",
  "focus:ring-theme-100",
  "focus:ring-offset-0",
]
</script>
