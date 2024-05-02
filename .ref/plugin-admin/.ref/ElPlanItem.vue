<script lang="ts" setup>
import type { vue } from '@factor/api'
import { formatNumber } from '@factor/api'
import type { CustomerDetails } from '..'

defineProps({
  price: { type: Object as vue.PropType<CustomerDetails>, default: () => {} },
})
</script>

<template>
  <label
    class="relative block cursor-pointer rounded-lg border px-6 py-4 shadow-sm focus:outline-none"
    :class="
      price.isCurrent
        ? 'border-theme-300 text-theme-400 bg-theme-50'
        : 'border-theme-300 bg-theme-0 hover:bg-theme-50'
    "
  >
    <input
      type="radio"
      name="server-size"
      value="Hobby"
      class="sr-only"
      aria-labelledby="server-size-0-label"
      aria-describedby="server-size-0-description-0 server-size-0-description-1"
    >
    <div class="mb-2 sm:flex sm:justify-between">
      <span class="flex items-center">
        <span class="flex flex-col text-sm">
          <span class="space-x-2 text-lg font-extrabold capitalize">
            <span class="font-extrabold">{{ price.group }}</span>
            <span class="opacity-50">
              {{ formatNumber(price.quantity, "abbreviated") }}
            </span>
            <span v-if="price.isCurrent" class="text-xs uppercase">(Current)</span>
          </span>
        </span>
      </span>
      <span class="mt-2 text-sm leading-[1] sm:ml-4 sm:mt-0 sm:text-right">
        <div class="text-xl font-extrabold">${{ price.cost }}</div>
        <div class="ml-1 text-[10px] font-bold uppercase opacity-50 sm:ml-0">
          monthly
        </div>
      </span>
    </div>
    <div class="space-y-1 text-xs opacity-50">
      <div class="block">
        {{ formatNumber(price.quantity * 0.06) }} Server Minutes
      </div>
      <div class="block capitalize">Unlimited Models and Images</div>
    </div>
    <span
      class="border-1 pointer-events-none absolute -inset-px rounded-lg"
      aria-hidden="true"
    />
  </label>
</template>
