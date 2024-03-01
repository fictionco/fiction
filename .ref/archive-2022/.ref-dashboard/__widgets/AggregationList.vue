<script lang="ts" setup>
import '../../lib/css/flag-icon.css'

import { formatNumber, getFavicon } from '@factor/api'
import type { PropType } from 'vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { AggregationResponse, FullWidget } from '..'
import { enrichData, getDataIcon } from '../lib/enrich'
import { filterLink } from '../dataEngine'
import { getRoute } from '../../tools/routes'

const props = defineProps({
  config: {
    type: Object as PropType<FullWidget<AggregationResponse>>,
    default: () => {},
  },
})
const route = useRoute()

const defaultIcon = computed(() => {
  return getDataIcon({ widget: props.config.widget })
})

const valueFormat = computed(() => {
  return props.config.valueFormat || 'number'
})

const data = computed(() => {
  const d = props.config.data
  const { count: total } = d?.mainTotals ?? { count: 0 }
  const main = d?.main ?? []
  return main.map((_) => {
    return {
      ..._,
      total,
      percent: +_.count / +total,
      list: _.list?.filter(_ => _) || [],
    }
  })
})

const enrichedData = computed(() =>
  enrichData({
    data: data.value,
    aggregationFormat: props.config.aggregationFormat,
    widget: props.config.widget,
  }),
)

const detailsLink = computed(() => {
  if (props.config.queryFormat !== 'aggregation')
    return

  return getRoute(
    'dashboardSingle',
    {
      dashboardId: 'reports',
    },
    { ...route.query, dimension: props.config.groupBy },
  )
})
</script>

<template>
  <div class="py-2 px-4 overflow-scroll h-full no-scrollbar">
    <div
      v-if="enrichedData && enrichedData.length === 0"
      class="pt-12 pb-8 text-center text-xs font-semibold text-slate-400 uppercase tracking-wide text-opacity-40"
    >
      Waiting for data
    </div>
    <div v-else class="">
      <div
        v-for="(line, i) in enrichedData"
        :key="i"
        class="mt-1 py-1 text-base sm:text-sm font-medium"
      >
        <div class="flex relative justify-between">
          <div class="relative mr-4 min-w-0">
            <router-link
              class="flex hover:text-primary-500 items-center"
              :to="filterLink(line.name, config.groupBy)"
            >
              <template
                v-if="
                  config.aggregationFormat === 'enriched'
                    || config.aggregationFormat === 'url'
                "
              >
                <div
                  v-if="line.icon && line.icon.includes('svg')"
                  class="w-5 h-5 mr-2 flex-shrink-0 text-color-500"
                  v-html="line.icon"
                />
                <img
                  v-else-if="line.icon"
                  class="w-5 h-5 mr-2"
                  :src="line.icon"
                >
                <img
                  v-else-if="line.url"
                  class="w-5 h-5 mr-2"
                  :src="getFavicon(line.url)"
                >
                <div
                  v-else-if="defaultIcon"
                  class="w-5 h-5 mr-2 flex-shrink-0 text-color-500"
                  v-html="defaultIcon"
                />
              </template>
              <div
                v-else-if="config.aggregationFormat === 'country'"
                class="flag-icon flag-icon-squared w-5 h-5 mr-2 block rounded-full"
                :class="`flag-icon-${line.name.toLowerCase()}`"
              />

              <div class="text-sm min-w-0 flex items-center relative">
                <div
                  class="name truncate min-w-0"
                  :title="line.niceName || line.name"
                >
                  {{ line.niceName || line.name }}
                </div>
                <div
                  v-if="line.list && line.list.length > 0"
                  class="description ml-2 group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 text-slate-400"
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
                    class="absolute top-full left-0 max-w-lg text-xs p-2 bg-white shadow-lg z-10 rounded-md group-hover:opacity-100 opacity-0 ring-1 ring-black ring-opacity-10 overflow-hidden no-scrollbar pointer-events-none"
                  >
                    <div
                      v-for="(li, ii) in line.list"
                      :key="ii"
                      class="text-xs min-w-0 my-2 font-normal text-slate-500 break-words"
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
              v-if="!valueFormat.toLowerCase().includes('percent')"
              class="text-xs text-slate-300 ml-2 text-left w-8"
            >
              {{ formatNumber(line.percent, "rawPercent") }}
            </div>
            <div
              v-else-if="line.amount"
              class="text-xs text-slate-300 ml-2 text-left w-8"
            >
              {{ formatNumber(line.amount, "abbreviated") }}
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="detailsLink"
        class="details text-xs mt-8 mb-3 text-center text-slate-300 hover:text-slate-500"
      >
        <router-link :to="detailsLink" class="uppercase font-semibold">
          View Report &rarr;
        </router-link>
      </div>
    </div>
  </div>
</template>
