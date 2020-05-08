<template>
  <div>
    <div v-if="invoices.length == 0" class="zero-state">
      <div class="title">No Invoices Found</div>
    </div>
    <template v-else>
      <dashboard-list-item
        v-for="(invoice, i) in invoices"
        :key="i"
        :title="title(invoice)"
        :sub-title="subTitle(invoice)"
        :meta="meta(invoice)"
        :additional="additional(invoice)"
        :edit-path="invoice.invoice_pdf"
      />
    </template>
  </div>
</template>
<script lang="ts">
import Vue from "vue"
import { stored, standardDate, toLabel } from "@factor/api"
import { dashboardListItem } from "@factor/ui"
import StripeNode from "stripe"
export default Vue.extend({
  name: "Invoices",
  components: { dashboardListItem },
  computed: {
    composite() {
      return stored("customerComposite") || {}
    },
    invoices(this: any) {
      return this.composite.invoices?.data || []
    },
  },
  methods: {
    standardDate,
    title(invoice: StripeNode.Invoice) {
      return toLabel(invoice.billing_reason ?? "")
    },
    subTitle(invoice: StripeNode.Invoice) {
      const amount = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(invoice.amount_due / 100)

      return amount
    },
    meta(this: any, invoice: StripeNode.Invoice) {
      return [
        { label: "Date", value: standardDate(invoice.created) },
        { label: "Status", value: toLabel(invoice.status as string) },
        { label: "Number", value: invoice.number },
        { label: "Download", path: invoice.invoice_pdf },
      ]
    },
    additional(this: any, invoice: StripeNode.Invoice) {
      return [
        { label: "Id", value: invoice.id },
        { label: "Customer Email", value: invoice.customer_email },
      ]
    },
  },
})
</script>
<style lang="less" scoped>
.zero-state {
  padding: 2rem;
  .title {
    font-size: 1.2em;
  }
}
</style>
