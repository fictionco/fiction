<script lang="ts" setup>
import { formatNumber, getFavicon, vue } from '@factor/api'
import type {
  AggregationFormat,
  ValueFormat,
} from '../plugin-dashboards'
import {
  enrichData,
} from '../plugin-dashboards'
import { useKaption } from '../utils'
import type { AggregationResponse } from '../plugin-analytics/types'

const props = defineProps({
  data: {
    type: Array as vue.PropType<AggregationResponse[]>,
    default: () => {},
  },
  totals: {
    type: Object as vue.PropType<AggregationResponse>,
    default: () => {},
  },
  limit: {
    type: Number as vue.PropType<number>,
    default: 20,
  },
  format: {
    type: String as vue.PropType<AggregationFormat>,
    default: 'standard',
  },
  valueFormat: {
    type: String as vue.PropType<ValueFormat>,
    default: 'number',
  },
  defaultIcon: {
    type: String as vue.PropType<string>,
    default: '',
  },
})
const { factorRouter, kaptionFilter } = useKaption()
const enrichedData = vue.computed(() => {
  const limited = props.data.slice(0, props.limit)
  const { count: total } = props.totals ?? { count: 0 }
  const data = limited.map((_) => {
    return {
      ..._,
      total,
      percent: total ? +_.count / +total : 0,
      list: _.list?.filter(_ => _) || [],
    }
  })

  return enrichData({
    data,
    aggregationFormat: props.format,
  })
})
</script>

<template>
  <div class="no-scrollbar h-full overflow-scroll">
    <div
      v-if="enrichedData && enrichedData.length === 0"
      class="p-4 text-center text-xs font-medium"
    >
      Waiting for Data
    </div>
    <div v-else class="">
      <div
        v-for="(line, i) in enrichedData"
        :key="i"
        class="mt-1 py-1 text-base font-medium sm:text-sm"
      >
        <div class="relative flex justify-between">
          <div class="relative mr-4 min-w-0">
            <router-link
              class="hover:text-primary-500 flex items-center"
              to="/"
            >
              <template v-if="format === 'enriched' || format === 'url'">
                <div
                  v-if="line.icon && line.icon.includes('svg')"
                  class="text-color-500 mr-2 h-5 w-5 shrink-0"
                  v-html="line.icon"
                />
                <img
                  v-else-if="line.icon"
                  class="mr-2 h-5 w-5"
                  :src="line.icon"
                >
                <img
                  v-else-if="line.url"
                  class="mr-2 h-5 w-5"
                  :src="getFavicon(line.url)"
                >
                <div
                  v-else-if="defaultIcon"
                  class="text-color-500 mr-2 h-5 w-5 shrink-0"
                  v-html="defaultIcon"
                />
              </template>
              <div
                v-else-if="['country', 'city'].includes(format)"
                class="fi fis mr-2 block h-5 w-5 rounded-full"
                :class="`fi-${line.countryCode}`"
              />

              <div class="relative flex min-w-0 items-center text-sm">
                <div
                  class="name min-w-0 truncate"
                  :title="line.niceName || line.name"
                >
                  {{ line.niceName || line.name }}
                </div>
                <div
                  v-if="line.list && line.list.length > 0"
                  class="description group ml-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 text-theme-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div
                    class="no-scrollbar pointer-events-none absolute top-full left-0 z-10 max-w-lg overflow-hidden rounded-md bg-white p-2 text-xs opacity-0 shadow-lg ring-1 ring-black/10 group-hover:opacity-100"
                  >
                    <div
                      v-for="(li, ii) in line.list"
                      :key="ii"
                      class="my-2 min-w-0 break-words text-xs font-normal text-theme-500"
                    >
                      {{ li }}
                    </div>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
          <div class="flex items-baseline">
            <div class="text-primary-500 font-bold">
              {{ formatNumber(line.count, valueFormat) }}
            </div>
            <div
              v-if="
                !valueFormat.toLowerCase().includes('percent') && line.percent
              "
              class="ml-2 w-8 text-left text-xs text-theme-300"
            >
              {{ formatNumber(line.percent, "rawPercent") }}
            </div>
            <div
              v-else-if="line.amount"
              class="ml-2 w-8 text-left text-xs text-theme-300"
            >
              {{ formatNumber(line.amount, "abbreviated") }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
