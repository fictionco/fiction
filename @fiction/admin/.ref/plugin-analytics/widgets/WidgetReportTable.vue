<script lang="ts" setup>
import type {
  ListItem,
  NumberFormats,
  RawListItem,
} from '@factor/api'
import {
  formatNumber,
  normalizeList,
  toLabel,
  vue,
} from '@factor/api'
import type { ClientWidget, DataCompared } from '@factor/api/plugin-dashboards'
import ElButton from '../../ui/ElButton.vue'
import { useKaption } from '../../utils'
import type { DateResponse } from './queryReports'

const props = defineProps({
  widget: {
    type: Object as vue.PropType<ClientWidget<DataCompared<DateResponse>>>,
    required: true,
  },
})

const { kaptionFilter, factorRouter } = useKaption()

const filterLink = kaptionFilter.filterLink
const activeSelectedDimension = kaptionFilter.activeSelectedDimension

const page = vue.computed(
  () => factorRouter.router.currentRoute.value.query.page || 1,
)
const data = vue.ref<DateResponse[]>([])
const headers = vue.ref<(ListItem & { format?: NumberFormats })[]>([])
const totals = vue.ref<Record<string, string | number> | undefined>()
const pagination = vue.ref<{
  total?: number
  start: number
  end: number
  pages: number
}>()

vue.watch(
  () => props.widget.data.value,
  (v) => {
    if (v) {
      const { main, columns = [], mainTotals, meta } = v

      totals.value = mainTotals

      data.value = main
      headers.value = normalizeList(columns as RawListItem[])

      pagination.value = meta
    }
  },
  { immediate: true, deep: true },
)

async function setPage(direction: 1 | -1): Promise<void> {
  const pg = +(page.value as string)
  const q = factorRouter.router.currentRoute.value.query

  await factorRouter.push({ query: { ...q, page: pg + direction } })
}

async function setOrderBy(header: ListItem): Promise<void> {
  const q = factorRouter.router.currentRoute.value.query
  const currentOrder = factorRouter.router.currentRoute.value.query.order as
    | string
    | undefined

  const order = currentOrder && currentOrder === 'desc' ? 'asc' : 'desc'
  await factorRouter.push({ query: { ...q, orderBy: header.value, order } })
}

const orderBy = vue.computed(() => {
  return factorRouter.router.currentRoute.value.query.orderBy as
    | string
    | undefined
})

const totalLine = vue.computed(() => {
  const t = totals.value
  if (!t)
    return []

  return headers.value.map((h) => {
    const v = h.value ?? ''
    return h.format ? formatNumber(t[v], h.format) : t[v]
  })
})

const lines = vue.computed(() => {
  return data.value.map((d) => {
    return headers.value.map((h) => {
      const v = h.value ?? ''
      const r = h.format ? formatNumber(d[v], h.format) : d[v]
      return r
    })
  })
})
</script>

<template>
  <div class="data-table">
    <table class="min-w-full divide-y divide-slate-200">
      <thead class="bg-theme-50 text-theme-600">
        <tr>
          <th
            v-for="(header, i) in headers"
            :key="i"
            scope="col"
            class="hover:bg-theme-100 cursor-pointer p-3 text-left text-xs"
            :class="orderBy === header.value ? 'bg-theme-100' : ''"
            @click="setOrderBy(header)"
          >
            <div class="font-semibold">
              {{ toLabel(header.name) }}
            </div>
            <div v-if="header.sub" class="text-theme-500 text-xs font-normal">
              {{ header.sub }}
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-200 bg-white">
        <tr>
          <td
            v-for="(col, i) in totalLine"
            :key="i"
            class="whitespace-nowrap p-3 text-xs font-semibold tracking-wide"
          >
            <div
              v-if="i === 0 && !orderBy"
              class="text-theme-400 flex items-center font-semibold"
            >
              TOTALS
            </div>
            <div v-else class="text-xs">
              {{ col }}
            </div>
          </td>
        </tr>
        <tr v-for="(line, i) in lines" :key="i">
          <td
            v-for="(col, ii) in line"
            :key="ii"
            class="whitespace-nowrap p-3 text-xs tracking-wide"
          >
            <router-link
              v-if="ii === 0"
              class="flex items-center font-semibold hover:text-primary-500"
              :to="filterLink(col, activeSelectedDimension.value)"
            >
              {{ col || "(not set)" }}
            </router-link>
            <div v-else class="text-xs">
              {{ col }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- This example requires Tailwind CSS v2.0+ -->
    <nav
      v-if="pagination"
      class="flex items-center justify-between border-t border-slate-200 px-4 py-3 sm:px-6"
      aria-label="Pagination"
    >
      <div class="hidden sm:block">
        <p class="text-theme-500 text-sm">
          {{ pagination.start }}
          to
          {{ pagination.end }}
          of
          {{ pagination.total }}
          total results
        </p>
      </div>
      <div class="flex flex-1 justify-between space-x-3 sm:justify-end">
        <ElButton
          :class="page === 1 ? 'cursor-not-allowed opacity-50' : ''"
          @click.prevent="setPage(-1)"
        >
          Previous
        </ElButton>
        <ElButton @click.prevent="setPage(1)">
          Next
        </ElButton>
      </div>
    </nav>
  </div>
</template>
