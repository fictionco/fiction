<script lang="ts" setup>
import ElInput from '@factor/ui/ElInput.vue'
import { dayjs, formatNumber, vue } from '@factor/api'
import type Stripe from 'stripe'
import { useKaption } from '../utils'
import BillingWrap from './BillingWrap.vue'

const { kaptionBilling } = useKaption()

const invoices = vue.computed(() => {
  const invoices = kaptionBilling.activeCustomerData.value?.invoices ?? []

  return invoices
})

function getLine(invoice: Stripe.Invoice): Stripe.InvoiceLineItem {
  return invoice.lines.data[0]
}
</script>

<template>
  <BillingWrap title="Invoice History">
    <ElInput
      label="Invoices"
      description="All paid invoices for this organization"
    >
      <div class="mt-6 overflow-x-auto">
        <div class="inline-block min-w-full align-middle">
          <div class="overflow-hidden">
            <div
              v-if="invoices.length === 0"
              class="bg-theme-50 my-4 rounded-md p-8 text-center"
            >
              <h2 class="font-semibold">
                No Invoices
              </h2>
              <div class="text-theme-500">
                They will appear here
              </div>
            </div>
            <table
              v-else
              class="min-w-full divide-y divide-slate-200 border-b border-slate-200"
            >
              <thead class="bg-theme-50">
                <tr>
                  <th
                    scope="col"
                    class="text-theme-500 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Period
                  </th>
                  <th
                    scope="col"
                    class="text-theme-500 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    class="text-theme-500 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <!--
                            `relative` is added here due to a weird bug in Safari that causes `sr-only` headings to introduce overflow on the body on mobile.
                          -->
                  <th
                    scope="col"
                    class="text-theme-500 relative px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    <span class="sr-only">View</span>
                  </th>
                </tr>
              </thead>

              <tbody class="divide-y divide-slate-200 bg-white">
                <tr v-for="(invoice, i) in invoices" :key="i">
                  <td
                    class="text-theme-500 whitespace-nowrap px-6 py-4 text-sm font-medium"
                  >
                    {{
                      dayjs.unix(invoice.period_start).format("MMM DD, YYYY")
                    }}
                    to
                    {{ dayjs.unix(invoice.period_end).format("MMM DD, YYYY") }}
                  </td>
                  <td
                    class="text-theme-500 whitespace-nowrap px-6 py-4 text-sm"
                  >
                    {{ getLine(invoice).description }}
                  </td>
                  <td
                    class="text-theme-500 whitespace-nowrap px-6 py-4 text-sm font-medium"
                  >
                    {{ formatNumber(getLine(invoice).amount, "dollar") }}
                  </td>
                  <td
                    class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium"
                  >
                    <a
                      v-if="invoice.invoice_pdf"
                      :href="invoice.invoice_pdf"
                      class="text-primary-600 hover:text-primary-900"
                    >View invoice</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ElInput>
  </BillingWrap>
</template>
