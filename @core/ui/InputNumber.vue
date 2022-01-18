<template>
  <div
    class="flex flex-row h-10 rounded-md relative bg-transparent mt-1 bg-white border border-slate-400 w-56"
  >
    <button
      class="hover:bg-slate-50 h-full w-20 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 select-none"
      :class="
        minNumber >= modelValue ? 'disabled opacity-40' : 'cursor-pointer'
      "
      @click.prevent="increment(-1)"
    >
      <span class="m-auto text-2xl font-thin">−</span>
    </button>
    <input
      type="number"
      class="mx-1 rounded-md border-transparent focus:outline-none text-center w-full font-semibold text-md md:text-basecursor-default flex items-center outline-none select-none focus:ring-primary-500 focus:border-primary-500"
      name="custom-input-number"
      :min="min"
      :max="max"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <button
      class="hover:bg-slate-50 h-full w-20 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
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
