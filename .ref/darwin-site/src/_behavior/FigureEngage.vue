<template>
  <div class="my-12">
    <dl
      class="
        mt-10
        text-center
        sm:max-w-4xl sm:mx-auto sm:grid sm:grid-cols-12 sm:gap-16
      "
    >
      <div
        v-for="(count, type) in activeInteractions"
        :key="type"
        class="flex col-span-12 md:col-span-6 flex-col"
      >
        <dt
          class="
            order-2
            mt-2
            text-lg
            leading-6
            font-medium
            text-primary-200
            select-none
          "
        >
          {{ toLabel(type) }}
        </dt>
        <dd
          class="order-1 text-7xl font-extrabold text-primary-500 select-none"
        >
          {{ formatNumber(count, "abbreviated") }}
        </dd>
      </div>
    </dl>
  </div>
</template>

<script lang="ts">
import screenBehaviorCharts from "./img/screenBehaviorCharts.webp"
import thumbBehavior from "./img/thumbBehavior.webp"
import { activeInteractions } from "../util"
import { formatNumber, toLabel } from "@factor/api"
export default {
  setup() {
    return {
      screenBehaviorCharts,
      thumbBehavior,
      activeInteractions,
      formatNumber,
      toLabel,
    }
  },
}
</script>
<style lang="less" scoped></style>
