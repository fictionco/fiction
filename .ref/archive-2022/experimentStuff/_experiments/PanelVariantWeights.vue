<script lang="ts" setup>
import ElemForm from '@factor/ui/ElemForm.vue'
import ElemInput from '@factor/ui/ElemInput.vue'
import type { PropType } from 'vue'
import { computed, ref } from 'vue'
import type { Variant } from '@kaption/types'
import ElemSlideOver from '@kaption/shared/ElemSlideOver.vue'
import { emitEvent, resetUi } from '@factor/api'
import { activeExperiment } from './utils'

const props = defineProps({
  variants: { type: Array as PropType<Variant[]>, default: () => [] },
})
const sending = ref(false)
const isValid = ref<boolean>(false)

const variantsAll = computed(() => {
  return [
    {
      variantName: 'Control',
      variantDescription: 'Default website / Control',
      variantId: 'control',
    },
    ...props.variants,
  ]
})
const updatedWeights = ref<Record<string, number>>({})
const weights = computed<Record<string, number>>(() => {
  const initial = activeExperiment.value?.variantWeights ?? {}

  return { ...initial, ...updatedWeights.value }
})
const activeWeights = computed<Record<string, number>>(() => {
  const out: Record<string, number> = {}

  let sum = 0
  variantsAll.value.forEach(({ variantId }) => {
    const v = weights.value[variantId] || 0
    out[variantId] = v
    sum += v
  })

  out.base = 100 - sum

  return out
})

const variantsWeightTotal = computed(() => {
  const totalWeight = ref(0)
  const theVariants = props.variants

  theVariants.forEach((item: any) => {
    totalWeight.value += item.weight
  })

  return totalWeight.value
})

function updateWeight(variantId: string, newValue: number) {
  const currentValue = activeWeights.value[variantId]
  const v
    = activeWeights.value.base <= 0 && currentValue < newValue
      ? currentValue
      : Number(newValue)

  const w = {
    ...weights.value,
    [variantId]: v,
  }

  updatedWeights.value = w
}

async function saveWeights() {
  const weights = activeWeights.value
  delete weights.base

  emitEvent('updateWeights', weights)

  resetUi()
}
</script>

<template>
  <ElemSlideOver name="variantWeights">
    <div
      class="flex items-center justify-center h-12 w-12 rounded-full bg-green-100"
    >
      <svg
        class="h-6 w-6 text-green-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
        />
      </svg>
    </div>
    <div class="py-3">
      <h2 class="text-xl font-semibold">
        Edit variant weights
      </h2>
      <p class="text-slate-500">
        Distribute the proportion of traffic amongst variants
      </p>
    </div>
    <ElemForm v-model:valid="isValid" @submit="saveWeights()">
      <div class="variant-weights">
        <div
          class="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-5 text-slate-400"
        >
          <div class="sm:col-span-4">
            <label for="name" class="block font-semibold"> Variant </label>
          </div>

          <div class="sm:col-span-1">
            <label for="weight" class="block font-semibold"> Weight </label>
          </div>
        </div>

        <div
          v-for="(variant, i) in variantsAll"
          :key="i"
          class="grid grid-cols-1 gap-y-6 gap-x-4 items-center my-4 sm:grid-cols-4"
        >
          <div class="capitalize sm:col-span-3">
            <div class="font-semibold">
              {{ variant.variantName }}
            </div>
            <p class="text-sm text-slate-500">
              {{ variant.variantDescription }}
            </p>
          </div>

          <div class="flex items-center sm:col-span-1">
            <div class="relative flex items-center w-full">
              <input
                :value="activeWeights[variant.variantId]"
                type="number"
                min="0"
                :max="100"
                step="1"
                :disabled="variant.variantId === 'base'"
                class="flex-grow appearance-none shadow-sm focus:ring-primary-500 placeholder-slate-500 focus:border-primary-500 block w-full sm:text-sm border-slate-200 rounded-md pr-8"
                :class="
                  variant.variantId === 'base'
                    ? 'bg-gray-50 cursor-not-allowed'
                    : ''
                "
                @input="updateWeight(variant.variantId, $event.target.value)"
              >
              <span class="absolute right-2 ml-2 text-slate-500">%</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-3 border-t border-slate-200">
        <ElemInput
          input="submit"
          :disabled="!isValid"
          :loading="sending"
        >
          Change...
        </ElemInput>
      </div>
    </ElemForm>
  </ElemSlideOver>
</template>
