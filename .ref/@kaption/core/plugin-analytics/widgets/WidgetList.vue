<script lang="ts" setup>
import { formatNumber, getFavicon, vue, vueRouter } from '@factor/api'
import type {
  ClientWidget,
  DataCompared,
} from '@factor/api/plugin-dashboards'
import {
  enrichData,
  getDataIcon,
} from '@factor/api/plugin-dashboards'
import { useKaption } from '../../utils'
import type { AggregationResponse } from '../types'

const props = defineProps({
  widget: {
    type: Object as vue.PropType<
      ClientWidget<DataCompared<AggregationResponse>>
    >,
    default: () => {},
  },
})
const { factorRouter, kaptionFilter } = useKaption()
const route = vueRouter.useRoute()

const format = vue.computed(
  () => props.widget.ui.aggregationFormat || 'standard',
)

const defaultIcon = vue.computed(() => {
  return getDataIcon({ widgetKey: props.widget.widgetKey })
})

const valueFormat = vue.computed(() => {
  return props.widget.ui.valueFormat || 'number'
})

const data = vue.computed(() => {
  const d = props.widget.data.value
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

const enrichedData = vue.computed(() =>
  enrichData({
    data: data.value,
    aggregationFormat: format.value,
    widgetKey: props.widget.widgetKey,
  }),
)

const detailsLink = vue.computed(() => {
  const dimension = props.widget.dimension

  return factorRouter.link(
    'analyticsReports',
    {},
    { ...route.query, dimension },
  )
})
</script>

<template>
  <div class="no-scrollbar h-full overflow-scroll py-2 px-4">
    <div
      v-if="enrichedData && enrichedData.length === 0"
      class="text-theme-400 pt-12 pb-8 text-center text-xs font-semibold uppercase tracking-wide text-opacity-40"
    >
      No Data
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
              class="flex items-center hover:text-primary-500"
              :to="
                kaptionFilter.filterLink(
                  line.name,
                  widget.queryHandler?.groupBy,
                )
              "
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
              >
                <div :about="`i-flag-${line.countryCode}}-1x1`" />
              </div>

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
                    class="text-theme-400 h-4 w-4"
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
                      class="text-theme-500 my-2 min-w-0 break-words text-xs font-normal"
                    >
                      {{ li }}
                    </div>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
          <div class="flex items-baseline">
            <div class="font-bold text-primary-500">
              {{ formatNumber(line.count, valueFormat) }}
            </div>
            <div
              v-if="!valueFormat.toLowerCase().includes('percent')"
              class="text-theme-300 ml-2 w-8 text-left text-xs"
            >
              {{ formatNumber(line.percent, "rawPercent") }}
            </div>
            <div
              v-else-if="line.amount"
              class="text-theme-300 ml-2 w-8 text-left text-xs"
            >
              {{ formatNumber(line.amount, "abbreviated") }}
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="detailsLink.value"
        class="details text-theme-300 hover:text-theme-500 mt-8 mb-3 text-center text-xs"
      >
        <RouterLink :to="detailsLink.value" class="font-semibold uppercase">
          View Report &rarr;
        </RouterLink>
      </div>
    </div>
  </div>
</template>
