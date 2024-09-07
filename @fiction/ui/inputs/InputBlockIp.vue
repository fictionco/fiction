<script lang="ts" setup>
import { getNetworkIp, useService, vue } from '@fiction/core'
import type { FictionUser } from '@fiction/core'
import ElButton from '../ElButton.vue'

export interface BlockIp {
  ipName?: string
  ipAddress?: string
}

const props = defineProps({
  modelValue: {
    type: Array as vue.PropType<BlockIp[]>,
    default: () => [],
  },
})
const emit = defineEmits(['update:modelValue'])
const { fictionUser } = useService<{ fictionUser: FictionUser }>()
const ips = vue.computed<BlockIp[]>({
  get: () => props.modelValue ?? [],
  set: (v) => {
    emit('update:modelValue', v)
  },
})

function newIp(): void {
  ips.value = [...ips.value, {}]
}

async function addCurrentIp(): Promise<void> {
  const name = fictionUser.activeUser.value?.fullName ?? 'My'
  const currentIp = await getNetworkIp()
  ips.value = [
    ...ips.value,
    { ipName: `${name} IP Address`, ipAddress: currentIp },
  ]
}

function deleteIp(index: number): void {
  ips.value.splice(index, 1)
}

vue.watch(
  () => ips.value,
  () => {
    emit('update:modelValue', ips.value)
  },
  { deep: true },
)
</script>

<template>
  <div class="ip-blocker">
    <div
      v-if="ips.length > 0"
      class="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6"
    >
      <div class="sm:col-span-2">
        <label for="state" class="block text-sm font-medium">
          IP Address
        </label>
      </div>
      <div class="sm:col-span-2">
        <label for="city" class="block text-sm font-medium">
          Reference Name
        </label>
      </div>
      <div class="sm:col-span-1" />
    </div>

    <div
      v-for="(item, i) in ips"
      :key="i"
      class="mt-2 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6"
    >
      <div class="sm:col-span-2">
        <input
          v-model="item.ipAddress"
          type="text"
          class="placeholder:text-theme-400 focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border-slate-400 sm:text-sm"
          placeholder="0.0.0.0"
        >
      </div>
      <div class="sm:col-span-2">
        <input
          v-model="item.ipName"
          type="text"
          class="placeholder:text-theme-400 focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border-slate-400 sm:text-sm"
          placeholder="Home IP"
        >
      </div>

      <div class="sm:col-span-1">
        <ElButton btn="default" @click.prevent="deleteIp(i)">
          <svg
            class="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </ElButton>
      </div>
    </div>
    <div class="add-new mt-4">
      <ElButton
        btn="default"
        size="sm"
        @click.prevent="newIp()"
      >
        <svg
          class="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        Add New IP
      </ElButton>
      <ElButton
        class="ml-4"
        btn="default"
        size="sm"
        @click.prevent="addCurrentIp()"
      >
        <svg
          class="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        Add Current IP
      </ElButton>
    </div>
  </div>
</template>
