<template>
  <div class="radio f-input">
    <label
      v-for="(option, i) in parsedList"
      :key="i"
      class="flex items-center my-2"
      :for="option.value"
    >
      <input
        :id="option.value"
        v-model="selected"
        type="radio"
        class="
          form-radio
          text-primary-600
          focus:outline-none focus:ring-primary-500 focus:border-primary-200
          appearance-none
          border border-bluegray-400
        "
        name="radio-colors"
        :value="option.value"
        v-bind="$attrs"
      />
      <span class="ml-2">{{ option.name }}</span>
    </label>
  </div>
</template>
<script lang="ts">
import { normalizeList } from "@factor/api"
import { ListItem } from "@factor/types"
import { PropType, ref, watch } from "vue"
export default {
  props: {
    modelValue: { type: String, default: "" },
    list: { type: Array as PropType<ListItem[]>, default: () => [] },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const selected = ref<string>(props.modelValue)
    const parsedList = normalizeList(props.list)
    watch(
      () => selected.value,
      (v) => {
        emit("update:modelValue", v)
      },
    )
    return { parsedList, selected }
  },
}
</script>
