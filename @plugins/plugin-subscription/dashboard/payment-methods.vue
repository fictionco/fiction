<template>
  <div>
    <dashboard-list-item
      v-for="(item, i) in paymentMethods"
      :key="i"
      :title="title(item)"
      :sub-title="subTitle(item)"
      :meta="meta(item)"
      :additional="additional(item)"
    />
  </div>
</template>
<script lang="ts">
import Vue from "vue"
import { stored, standardDate, toLabel } from "@factor/api"
import { dashboardListItem } from "@factor/ui"
import StripeNode from "stripe"
export default Vue.extend({
  name: "PaymentMethods",
  components: { dashboardListItem },
  computed: {
    composite() {
      return stored("customerComposite") || {}
    },
    paymentMethods(this: any) {
      return this.composite.paymentMethods.data || []
    },
  },
  methods: {
    standardDate,
    title(item: StripeNode.PaymentMethod) {
      const last4 = item.card?.last4

      return `${toLabel(item.card?.brand)} (**** ${last4})`
    },
    subTitle(item: StripeNode.PaymentMethod) {
      return item.type == "card" ? "Credit Card" : "Other"
    },
    meta(this: any, item: StripeNode.PaymentMethod) {
      return [
        { label: "Expires", value: `${item.card?.exp_month}/${item.card?.exp_year}` },
        { label: "Created", value: standardDate(item.created) },
      ]
    },
    additional(this: any, item: StripeNode.PaymentMethod) {
      return [
        { label: "Id", value: item.id },
        { label: "Billing Email", value: item.billing_details.email },
        {
          label: "Billing Postal Code",
          value: item.billing_details.address?.postal_code || "N/A",
        },
      ]
    },
  },
})
</script>
<style lang="less" scoped>
</style>
