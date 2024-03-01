<script lang="ts" setup>
import { vue } from '@factor/api'
import ElInput from './ElInput.vue'

const props = defineProps({
  modelValue: {
    type: Array as vue.PropType<string[]>,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])
const origins = vue.computed<string[]>({
  get: () => props.modelValue,
  set: (v) => {
    emit('update:modelValue', v)
  },
})

function newVal(): void {
  origins.value = [...origins.value, '']
}

function deleteVal(index: number): void {
  origins.value.splice(index, 1)
}

vue.watch(
  () => origins.value,
  () => {
    emit('update:modelValue', origins.value)
  },
  { deep: true },
)
</script>

<template>
  <div class="origins">
    <div
      v-for="(item, i) in origins"
      :key="i"
      class="mt-2"
    >
      <div class="relative flex">
        <ElInput
          v-model="origins[i]"
          input="InputUrl"
          placeholder="www.example.com"
          class="grow"
        />
        <div class="absolute left-full flex h-full items-center" @click.stop>
          <div
            class="text-theme-300 hover:text-theme-700 ml-2 cursor-pointer px-0.5"
            @click.stop="newVal()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
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
          </div>
          <div
            v-if="origins.length > 1"
            class="text-theme-300 hover:text-theme-700 cursor-pointer px-0.5"
            @click.stop="deleteVal(i)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
