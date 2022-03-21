<template>
  <div
    class="relative mt-1 flex h-10 w-56 flex-row rounded-md border border-slate-400 bg-transparent"
  >
    <button
      class="h-full w-20 select-none rounded-md hover:bg-slate-50 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
      :class="
        minNumber >= modelValue ? 'disabled opacity-40' : 'cursor-pointer'
      "
      @click.prevent="increment(-1)"
    >
      <span class="m-auto text-2xl font-thin">−</span>
    </button>
    <input
      type="number"
      class="text-md md:text-basecursor-default mx-1 flex w-full select-none items-center rounded-md border-transparent text-center font-semibold outline-none focus:border-primary-500 focus:outline-none focus:ring-primary-500"
      name="custom-input-number"
      :min="min"
      :max="max"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <button
      class="h-full w-20 rounded-md hover:bg-slate-50 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
      :class="
        maxNumber <= modelValue ? 'disabled opacity-40' : 'cursor-pointer'
      "
      @click.prevent="increment(1)"
    >
      <span class="m-auto text-2xl font-thin">+</span>
    </button>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps({
  min: { type: String, default: "0" },
  max: { type: String, default: "10" },
  modelValue: { type: [String, Number], default: "" },
})
const emit = defineEmits(["update:modelValue"])
const minNumber = Number.parseInt(props.min)
const maxNumber = Number.parseInt(props.max)
const increment = (v: number): void => {
  const current = !props.modelValue
    ? minNumber
    : typeof props.modelValue == "string"
    ? Number.parseInt(props.modelValue)
    : props.modelValue

  const currentValue = current ?? 0

  const newValue = currentValue + v

  if (newValue <= maxNumber && newValue >= minNumber) {
    emit("update:modelValue", newValue)
  }
}
</script>
