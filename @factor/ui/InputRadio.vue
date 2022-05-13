<template>
  <div class="radio f-input">
    <label
      v-for="(option, i) in parsedList"
      :key="i"
      class="my-2 flex cursor-pointer items-center text-input-size"
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
      <span class="ml-2 text-input-body hover:text-input-body-light">{{
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
  "border-input-edge",
  "text-input-primary",
  "focus:border-input-primary",
  "focus:outline-none",
  "focus:ring-input-primary",
]
</script>
