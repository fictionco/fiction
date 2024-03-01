<script lang="ts">
import type { PropType } from 'vue'
import { computed, ref, watch } from 'vue'
import type { ListItem } from '@factor/types'
import type { Variant } from '@kaption/types'
import type { FullWidget } from '..'
import { formatNumber, getRoute } from '../..'
import ConfidenceInterval from './ConfidenceInterval.vue'

export default {
  components: { ConfidenceInterval },
  props: {
    config: {
      type: Object as PropType<FullWidget<Record<string, any>>>,
      default: () => {},
    },
  },
  setup(props) {
    const data = ref<Record<string, any>[]>([])
    const headers = ref<ListItem[]>([
      { name: 'Variant Name', value: 'variantName' },
      {
        name: `Unique Conversions`,
        sub: 'Total Users',
        value: [`conversions`, 'uniqueVisitors'],
        format: 'conversions',
      },
      {
        name: `Conversion Rate`,
        value: `rate`,
        format: 'conversionRate',
      },
      {
        name: `Improvement`,
        value: `improvement`,
        format: 'improvement',
        hideControl: true,
      },
      {
        name: `Confidence Interval`,
        format: 'confidenceInterval',
        hideControl: true,
      },

      {
        name: `Significance`,
        value: `significance`,
        format: 'significance',
        hideControl: true,
      },
    ])

    watch(
      () => props.config.data,
      (v) => {
        if (v) {
          const { main } = v

          data.value = main
        }
      },
      { immediate: true, deep: true },
    )

    const lines = computed(() => {
      return data.value.map((d) => {
        return headers.value.map((h) => {
          return {
            ...h,
            data: d,
          }
        })
      })
    })

    const linkToVariantEdit = (v: Variant): string => {
      return getRoute('experimentVariant', v)
    }

    return {
      lines,
      formatNumber,
      getRoute,
      headers,
      linkToVariantEdit,
    }
  },
}
</script>

<template>
  <div class="data-table">
    <table class="min-w-full divide-y divide-slate-200">
      <thead class="bg-slate-50 text-slate-600 border-t border-slate-200">
        <tr>
          <th
            v-for="(header, i) in headers"
            :key="i"
            scope="col"
            class="px-5 py-4 text-sm"
            :class="i !== 0 ? 'text-right' : 'text-left'"
          >
            <div class="font-semibold">
              {{ header.name }}
            </div>
            <div v-if="header.sub" class="text-xs text-slate-500 font-normal">
              {{ header.sub }}
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-slate-200">
        <tr v-for="(line, i) in lines" :key="i">
          <td
            v-for="(col, ii) in line"
            :key="ii"
            class="px-5 py-4 max-w-md text-sm"
          >
            <div
              v-if="ii === 0"
              class="font-semibold hover:text-primary-500 items-center"
            >
              <div v-if="col.data.variantId === 'control'">
                Control
              </div>
              <router-link
                v-else
                class="capitalize"
                :to="linkToVariantEdit(col.data)"
              >
                {{ col.data.variantName || "(not set)" }}
              </router-link>
              <div
                v-if="col.data.variantId !== 'control'"
                class="mt-2 text-xs text-slate-500 font-normal"
              >
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 mr-2"
                >
                  {{ col.data.weight ?? 0 }}% Weight
                </span>
                <span
                  v-if="col.data.changes"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-500 mr-2"
                >
                  {{ Object.keys(col.data.changes).length }} Changes
                </span>

                <span v-if="col.data.variantDescription" class="text-slate-500">
                  {{ col.data.variantDescription }}
                </span>
              </div>
            </div>
            <div v-else class="text-base text-right">
              <span
                v-if="col.hideControl && i === 0"
                class="text-xs text-slate-300 uppercase tracking-wider font-semibold"
              >(baseline)</span>
              <template v-else>
                <ConfidenceInterval
                  v-if="col.format === 'confidenceInterval'"
                  :val="[col.data.lowChange, col.data.highChange]"
                />
                <template v-else-if="col.format === 'conversions'">
                  <span class="text-lg font-semibold">{{
                    col.data.conversions
                  }}</span>
                  <div class="text-xs text-slate-500">
                    {{ col.data.uniqueVisitors }}
                  </div>
                </template>
                <template v-else-if="col.format === 'conversionRate'">
                  <span class="text-lg font-semibold">{{
                    formatNumber(col.data.rate, "rawPercent") ?? "–"
                  }}</span>
                </template>

                <template v-else-if="col.format === 'improvement'">
                  <span
                    class="text-lg font-semibold"
                    :class="
                      col.data.improvement < 0
                        ? 'text-red-500'
                        : 'text-green-500'
                    "
                  >{{
                    formatNumber(col.data.improvement, "rawPercent") ?? "–"
                  }}</span>
                </template>

                <template v-else-if="col.format === 'significance'">
                  <span class="text-lg font-semibold">{{
                    formatNumber(col.data.significance, "rawPercent") ?? "–"
                  }}</span>
                  <div class="text-slate-500">
                    <div v-if="col.data.significance > 0.97" class="text-xs">
                      Significant
                    </div>
                    <div v-else class="text-xs">
                      Needs data (&lt; 97%)
                    </div>
                  </div>
                </template>

                <span v-else>{{
                  formatNumber(col.data[col.value], col.format) ?? "–"
                }}</span>
              </template>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
