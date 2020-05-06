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
        <dashboard-btn
          btn="default"
          class="switch"
          size="small"
          @click="modal('change', item)"
        >Change Plan</dashboard-btn>
        <dashboard-btn
          btn="default"
          class="cancel"
          size="small"
          @click="modal('cancel', item)"
        >Cancel</dashboard-btn>
      </template>
    </dashboard-list-item>
    <factor-modal :vis.sync="modalVisible">
      <template v-if="modalMode == 'cancel'">
        <h2>Cancel Subscription</h2>
        <div class="info">
          <p>Are you sure? This will downgrade your premium suite to the free community version.</p>
          <p>Before you cancel, please get in touch with us and we'll do whatever we can to make you happy.</p>
        </div>
        <div class="actions">
          <dashboard-btn btn="warning" @click="updateSubscription(item, 'cancel')">Yes, I'm Sure</dashboard-btn>
          <dashboard-btn btn="default" @click="modalVisible = false">Close</dashboard-btn>
        </div>
      </template>
      <template v-else>
        <h2>Change Plan</h2>
        <div class="info plans-list">
          <div v-for="({plan, product}, i) in allPlans" :key="i" class="plans-list-item">
            <div class="text">
              <div class="title">{{ product.metadata.title }}</div>
              <div class="description">{{ product.metadata.description }}</div>
            </div>
            <div class="period">${{ plan.amount / 100 }} per {{ plan.interval }}</div>
            <div class="actions">
              <dashboard-btn
                v-if="modalItem.plan && modalItem.plan.id == plan.id"
                btn="default"
                size="small"
                disabled
              >Current Plan</dashboard-btn>
              <dashboard-btn
                v-else
                btn="primary"
                size="small"
                @click="updateSubscription(item, 'update', plan.id)"
              >Change to this plan</dashboard-btn>
            </div>
          </div>
        </div>
      </template>
    </factor-modal>
  </div>
</template>
<script lang="ts">
import Vue from "vue"
import { stored, standardDate, toLabel } from "@factor/api"
import { dashboardListItem, dashboardBtn, factorModal } from "@factor/ui"
import StripeNode from "stripe"
export default Vue.extend({
  name: "SubscriptionList",
  components: { dashboardListItem, dashboardBtn, factorModal },
  data() {
    return { modalVisible: false, modalMode: "", modalItem: {} }
  },
  computed: {
    allPlans() {
      return stored("allPlans") || []
    },
    composite() {
      return stored("customerComposite") || {}
    },
    subscriptions(this: any) {
      return this.composite.customer?.subscriptions?.data || []
    },
  },
  methods: {
    updateSubscription(item: StripeNode.Subscription, action: string) {},
    modal(this: any, mode: string, item: StripeNode.Subscription) {
      this.modalMode = mode
      this.modalItem = item
      this.modalVisible = true
    },
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
      return [{ label: "Id", value: item.id }]
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
.factor-modal {
  .modal-text-content {
    text-align: left;
  }

  h2 {
    font-size: 1.5em;
    font-weight: var(--font-weight-bold, 700);
    margin-bottom: 1rem;
  }
  p {
    text-align: left;
    margin: 1rem 0;
    opacity: 0.5;
    line-height: 1.5;
  }
}
.plans-list {
  text-align: left;
  font-size: 0.9em;
  .plans-list-item {
    padding: 1rem;
    border: 1px solid var(--color-border);
    border-radius: 5px;
    margin-bottom: 0.5rem;
    .actions {
      margin-top: 1rem;
    }
    .text {
      margin: 0 0 0.5rem 0;
      .title {
        font-size: 1.2em;
        font-weight: var(--font-weight-bold, 700);
        margin-bottom: 0.25em;
      }
      .description {
        opacity: 0.6;
      }
    }
  }
}
</style>
