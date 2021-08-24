<template>
  <div class="mt-6">
    <div v-for="(item, i) of li" :key="i" class="my-2">
      <label class="f-input inline-flex cursor-pointer items-center">
        <input
          v-bind="$attrs"
          type="checkbox"
          class="
            form-checkbox
            text-primary-500
            rounded-md
            h-5
            w-5
            mr-4
            appearance-none
            border border-bluegray-400
          "
          :checked="isSelected(item.value)"
          @input="selectValue(item, $event.target.checked)"
        />
        <span
          class="
            checkbox-label
            text-sm text-bluegray-800
            hover:text-primary-500
          "
        >
          {{ item.name }}
        </span>
      </label>
    </div>
  </div>
</template>
<script lang="ts">
import { normalizeList } from "@factor/api"
import { ListItem } from "@factor/types"
import { computed, PropType } from "vue"
export default {
  props: {
    modelValue: {
      type: [Array, String],
      default: () => [],
    },
    list: { type: Array as PropType<ListItem[]>, default: () => {} },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const li = computed(() => {
      return normalizeList(props.list ?? ["no items"])
    })

    const val = computed<string[]>(() => {
      return typeof props.modelValue == "string"
        ? props.modelValue.split(",").map((_) => _.trim())
        : (props.modelValue as string[])
    })

    const selected = computed<string[]>({
      get: () => {
        return val.value
      },
      set: (v) => {
        emit("update:modelValue", v)
      },
    })

    const isSelected = (value: string): boolean => {
      return selected.value.includes(value)
    }

    const removeValue = (value: string) => {
      const index = selected.value.indexOf(value)
      if (index > -1) {
        selected.value.splice(index, 1)
        selected.value = [...selected.value]
      }
    }

    const selectValue = (item: ListItem) => {
      const value = item.value

      if (!selected.value.includes(value)) {
        selected.value = [...selected.value, value]
      } else {
        removeValue(value)
      }
    }

    return { li, selectValue, isSelected }
  },
}
</script>
