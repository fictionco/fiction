<template>
  <div class="f-input flex">
    <span
      class="inline-flex items-center rounded-l-md border border-r-0 border-slate-300 bg-slate-100 px-3 text-slate-300"
    >
      https://
    </span>

    <input
      v-bind="$attrs"
      type="text"
      class="block w-full flex-1 rounded-none rounded-r-md border-slate-300 placeholder:text-slate-300 focus:border-primary-500 focus:ring-primary-500"
      placeholder="www.example.com"
      autocomplete="url"
      :value="modelValue"
      @input="updateValue($event)"
    />
  </div>
</template>
<script lang="ts" setup>
defineProps({
  modelValue: { type: [String, Number], default: "" },
})
const emit = defineEmits(["update:modelValue"])

const updateValue = (event: Event): void => {
  const target = event.target as HTMLTextAreaElement

  const v = target.value
    .replace(/^https?:\/\//, "")
    .toLowerCase()
    .replace(" ", "")

  emit("update:modelValue", v)
}
</script>
