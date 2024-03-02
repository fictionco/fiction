<script lang="ts" setup>
import { vue } from '@fiction/core'

defineProps({
  title: { type: String, default: '' },
  subTitle: { type: String, default: '' },
  note: { type: String, default: '' },
})
const slots = vue.useSlots()
</script>

<template>
  <div
    class="zero-state mb-8 flex aspect-[3/1] items-center justify-center rounded-lg py-8 md:p-8"
  >
    <div class="w-full max-w-md">
      <div
        class="inline-block w-full rounded-lg p-4 text-left align-bottom transition-all sm:p-8 sm:align-middle"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div>
          <div class="text-center">
            <h3
              class="text-theme-900 mt-2 text-lg font-bold"
              v-html="title"
            />
            <p class="text-theme-500 mt-1 text-lg" v-html="subTitle" />

            <div v-if="note" class="mt-4">
              <p class="text-theme-500 text-base">
                {{ note }}
              </p>
            </div>
          </div>
        </div>
        <div
          v-if="slots.action"
          class="mt-5 flex justify-center space-x-4 space-y-4 text-center sm:mt-6"
        >
          <slot name="action" />
        </div>
      </div>
    </div>
  </div>
</template>
