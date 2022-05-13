<template>
  <div :class="wrapClasses">
    <button
      :class="[
        buttonClasses,
        minNumber >= modelValue ? 'disabled opacity-40' : 'cursor-pointer',
      ]"
      @click.prevent="increment(-1)"
    >
      <span class="m-auto text-input-size font-bold">−</span>
    </button>
    <input
      type="number"
      :class="inputClasses"
      name="custom-input-number"
      :min="min"
      :max="max"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <button
      :class="[
        buttonClasses,
        maxNumber <= modelValue ? 'disabled opacity-40' : 'cursor-pointer',
      ]"
      @click.prevent="increment(1)"
    >
      <span class="m-auto text-input-size font-bold">+</span>
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

const inputClasses = [
  "cursor-default",
  "flex",
  "w-full",
  "select-none",
  "items-center",
  "rounded-md",
  "border-transparent",
  "text-center",
  "outline-none",
  "bg-input-base",
  "text-input-size",
  "text-input-body",
  "focus:border-input-primary",
  "focus:outline-none",
  "focus:ring-0",
  "px-input-x",
  "py-input-y",
]
const wrapClasses = [
  "bg-input-base",
  "relative",
  "flex",

  "w-56",
  "flex-row",
  "rounded-md",
  "border",
  "border-input-edge",
]

const buttonClasses = [
  "px-input-x",
  "py-input-y",
  "h-full",
  "w-20",
  "rounded-full",
  "select-none",
  "text-input-body",
  "hover:text-input-body-light",
  "focus:border-input-primary",
  "focus:outline-none",
  "focus:ring-input-primary",
]
</script>
