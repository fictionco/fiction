<template>
  <div class="radio f-input">
    <label
      v-for="(option, i) in parsedList"
      :key="i"
      class="my-2 flex items-center"
      :for="option.value"
    >
      <input
        :id="option.value"
        v-model="selected"
        type="radio"
        class="form-radio appearance-none border border-slate-300 text-primary-600 focus:border-primary-200 focus:outline-none focus:ring-primary-500"
        name="radio-colors"
        :value="option.value"
        v-bind="$attrs"
      />
      <span class="ml-2">{{ option.name }}</span>
    </label>
  </div>
</template>
<script lang="ts" setup>
import { normalizeList } from "@factor/api"
import { ListItem } from "@factor/types"
import { PropType, ref, watch } from "vue"

const props = defineProps({
  modelValue: { type: String, default: "" },
  list: { type: Array as PropType<ListItem[]>, default: () => [] },
})

const emit = defineEmits(["update:modelValue"])
const selected = ref<string>(props.modelValue)
const parsedList = normalizeList(props.list)
watch(
  () => selected.value,
  (v) => {
    emit("update:modelValue", v)
  },
)
</script>
