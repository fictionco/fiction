<template>
  <div>
    <dashboard-list-item
      v-for="(item, i) in subscriptions"
      :key="i"
      :title="title(item)"
      :sub-title="subTitle(item)"
      :meta="meta(item)"
      :additional="additional(item)"
    >
      <template #actions>
        <factor-btn btn="default" class="switch" size="small">Change Plan</factor-btn>
        <factor-btn btn="default" class="cancel" size="small">Cancel</factor-btn>
      </template>
    </dashboard-list-item>
  </div>
</template>
<script lang="ts">
import Vue from "vue"
import { stored, standardDate, toLabel } from "@factor/api"
import { dashboardListItem, factorBtn } from "@factor/ui"
import StripeNode from "stripe"
export default Vue.extend({
  name: "SubscriptionList",
  components: { dashboardListItem, factorBtn },
  computed: {
    composite() {
      return stored("customerComposite") || {}
    },
    subscriptions(this: any) {
      return this.composite.customer?.subscriptions?.data || []
    },
  },
  methods: {
    standardDate,
    title(item: StripeNode.Subscription) {
      return item.plan?.metadata?.title || "Subscription"
    },
    subTitle(item: StripeNode.Subscription) {
      return item.plan?.metadata?.description || `Per ${item.plan?.interval}`
    },
    meta(this: any, item: StripeNode.Subscription) {
      return [
        { value: this.getAmount(item) },
        { label: "Renews", value: standardDate(item.current_period_end) },
        { label: "Status", value: toLabel(item.status as string) },
      ]
    },
    additional(this: any, item: StripeNode.Subscription) {
      return [
        { label: "Id", value: item.id },
        { label: "Customer Email", value: " " },
      ]
    },
    getAmount(this: any, item: StripeNode.Subscription) {
      const amount = item.plan?.amount ? item.plan?.amount / 100 : ""
      const interval = item.plan?.interval

      return `${amount} / ${interval}`
    },
  },
})
</script>
<style lang="less" scoped>
</style>
