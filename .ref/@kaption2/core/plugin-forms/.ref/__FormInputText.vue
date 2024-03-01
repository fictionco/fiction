<script lang="ts" setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void
}>()

const inputClasses = [
  'f-input',
  'block',
  'bg-input-base',
  'text-input-body',
  'placeholder:text-input-placeholder',
  'disabled:text-input-body-alt',
  'w-full',
  'appearance-none',
  'rounded-md',
  'border-none',
  'px-0',
  'py-3',
  'text-xl',
  'focus:outline-none',
  'focus:ring-0',
  'disabled:cursor-not-allowed',
]
</script>

<template>
  <div class="">
    <div class="my-2">
      <input
        :class="inputClasses"
        type="text"
        :value="modelValue"
        placeholder="Type your answer here..."
        spellcheck="false"
        @input="
          emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
      >
    </div>
  </div>
</template>
