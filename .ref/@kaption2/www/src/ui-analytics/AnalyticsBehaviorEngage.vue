<script lang="ts" setup>
import { formatNumber, toLabel } from '@factor/api'
import { activeInteractions } from '../util'
</script>

<template>
  <div
    class="text-theme-800 my-12 rounded-lg bg-white p-4 text-left text-xs shadow-xl ring-1 ring-black/5"
  >
    <dl
      class="py-10 text-center sm:mx-auto sm:grid sm:max-w-4xl sm:grid-cols-12 sm:gap-16"
    >
      <div
        v-for="(count, type) in activeInteractions"
        :key="type"
        class="col-span-12 flex flex-col md:col-span-6"
      >
        <dt
          class="text-theme-400 order-2 mt-2 select-none text-lg font-medium leading-6"
        >
          {{ toLabel(type) }}
        </dt>
        <dd
          class="order-1 select-none text-7xl font-extrabold tracking-tight text-primary-500"
        >
          {{ formatNumber(count, "abbreviated") }}
        </dd>
      </div>
    </dl>
  </div>
</template>

<style lang="less" scoped></style>
