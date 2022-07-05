<template>
  <div :class="wrapClasses">
    <button
      class="border-r border-slate-200"
      :class="[
        buttonClasses,
        minNumber >= modelValue ? 'disabled opacity-40' : 'cursor-pointer',
      ]"
      @click.prevent="increment(-1)"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" />
      </svg>
    </button>
    <input
      type="number"
      :class="inputClasses"
      name="custom-input-number"
      :min="min"
      :max="max"
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    />
    <button
      class="border-l border-slate-200"
      :class="[
        buttonClasses,
        maxNumber <= modelValue ? 'disabled opacity-40' : 'cursor-pointer',
      ]"
      @click.prevent="increment(1)"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 4v16m8-8H4"
        />
      </svg>
    </button>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps({
  min: { type: String, default: "0" },
  max: { type: String, default: "10" },
  defaultValue: { type: String, default: "0" },
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
  "flex",
  "items-center",
  "rounded-md",
  "border",
  "border-input-edge",
  "overflow-hidden",
]

const buttonClasses = [
  "px-input-x",
  "py-input-y",
  "h-full",
  "w-20",
  "select-none",
  "text-input-body",
  "hover:text-primary-500",
  "hover:bg-input-base-alt",
  "focus:outline-none",
  "focus:ring-input-primary",
  "flex",
  "justify-center",
  "items-center",
]
</script>
