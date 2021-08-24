<template>
  <select
    :value="modelValue"
    class="
      f-input
      block
      w-full
      appearance-none
      px-3
      py-2
      rounded-md
      border border-bluegray-400
      placeholder-bluegray-400
      focus:outline-none focus:ring-primary-500 focus:border-primary-500
      pr-8
      overflow-ellipsis overflow-hidden
    "
    @input="emit('update:modelValue', $event.target.value)"
  >
    <option disabled value>{{ attrs.placeholder || "Select" }}</option>
    <template v-for="(s, i) in parsedList" :key="i">
      <option v-if="s == 'divider' || s.value == 'divider'" disabled>
        ──────────
      </option>
      <option v-else :value="s.value" :disabled="s.disabled">
        {{ s.label || s.name }}
      </option>
    </template>
  </select>
</template>
<script lang="ts">
import { ListItem, normalizeList } from "@factor/api"
import { computed, PropType } from "vue"
export default {
  props: {
    defaultValue: { type: [Number, String, Boolean], default: "" },
    modelValue: { type: [Number, String, Boolean], default: "" },
    list: { type: Array as PropType<ListItem[]>, default: () => [] },
    suffix: { type: String, default: "" },
  },
  emits: ["update:modelValue"],
  setup(props, { attrs, emit }) {
    if (!props.modelValue && props.defaultValue) {
      emit("update:modelValue", props.defaultValue)
    }

    const parsedList = computed<ListItem[]>(() => {
      return props.list
        ? normalizeList(props.list, {
            suffix: props.suffix,
          })
        : []
    })

    return { parsedList, attrs, emit }
  },
}
</script>
