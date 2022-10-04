<template>
  <ElForm class="test-input p-4">
    <div class="text-theme-700 flex items-end justify-between space-x-6">
      <h3 class="grow text-sm font-semibold">{{ inputName }}</h3>
      <div class="flex max-w-[70%] space-x-4 text-[10px]">
        <div class="opacity-50">Value</div>
        <div class="min-w-0 break-words">{{ val || "[empty]" }}</div>
      </div>
      <div class="text-[10px]">
        <button class="text-slate-500" type="submit">Valid</button>
      </div>
    </div>
    <div class="pt-2">
      <component
        :is="inputEl"
        v-model="val"
        v-bind="attrs"
        required
      ></component>
    </div>
  </ElForm>
</template>
<script lang="ts" setup>
import { vue } from "@factor/api"
import ElForm from "@factor/ui/ElForm.vue"
const props = defineProps({
  inputName: { type: String, default: "" },
  inputEl: { type: Object as vue.PropType<vue.Component>, default: () => ({}) },
  modelValue: {
    type: [Array, Object, String, Number, Boolean],
    default: undefined,
  },
})
const val = vue.ref(props.modelValue)
const attrs = vue.useAttrs()
</script>
