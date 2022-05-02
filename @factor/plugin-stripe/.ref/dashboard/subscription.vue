<template>
  <div>
    <div v-if="subscriptions.length == 0" class="zero-state banner">
      <div class="super">Money Back Guarantee</div>
      <div class="title">Get the Pro Suite</div>
      <div
        class="sub-title"
      >Experience pro extensions, pro features, dashboard enhancements and more.</div>
      <div class="actions">
        <factor-link to="/plans" btn="primary">Pick a Plan &rarr;</factor-link>
        <factor-link to="/pro" btn="default">Learn More &rarr;</factor-link>
      </div>
    </div>
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
          btn="primary"
          class="switch"
          size="small"
          @click="modal('change', item)"
        >{{ item.cancel_at_period_end ? "Restore" : "Change" }} Plan</dashboard-btn>
        <dashboard-btn
          v-if="!item.cancel_at_period_end"
          btn="subtle"
          class="cancel"
          size="small"
          @click="modal('cancel', item)"
        >Cancel Subscription</dashboard-btn>
        <dashboard-btn
          v-else
          btn="subtle"
          class="cancel"
          size="small"
          @click="updateSubscription({ subscriptionId: item.id, action: 'delete' })"
        >Delete Permanently</dashboard-btn>
      </template>
    </dashboard-list-item>
    <factor-modal class="sub-modal" :vis.sync="modalVisible">
      <template v-if="modalMode == 'cancel'">
        <h2>Cancel Subscription</h2>
        <div class="info">
          <p>Are you sure? This will downgrade your premium suite to the community version.</p>
          <p>
            Have a concern? Please
            <router-link to="/contact">get in touch</router-link>&nbsp;with us and we'll do whatever we can to make you happy.
          </p>
        </div>
        <div class="actions">
          <dashboard-btn
            btn="warning"
            :loading="sending"
            @click="updateSubscription({ subscriptionId: modalItem.id, action: 'cancel' })"
          >Yes, I'm Sure</dashboard-btn>
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
                v-if="modalItem.plan && modalItem.plan.id == plan.id && !modalItem.cancel_at_period_end"
                btn="default"
                disabled
              >Current Plan</dashboard-btn>
              <dashboard-btn
                v-else
                btn="primary"
                :loading="sending == plan.id"
                @click="updateSubscription({ subscriptionId: modalItem.id, action: 'change', planId: plan.id })"
              >{{ modalItem.cancel_at_period_end ? "Restore" : "Change to" }} this plan</dashboard-btn>
            </div>
          </div>
        </div>
      </template>
    </factor-modal>
  </div>
</template>
<script lang="ts">
import { stored, standardDate, toLabel } from "@factor/api"
import { dashboardListItem, dashboardBtn, factorModal, factorLink } from "@factor/ui"
import StripeNode from "stripe"
import { requestUpdateSubscription } from "../stripe-client"
import { UpdateSubscription } from "../types"
export default {
  name: "SubscriptionList",
  components: { dashboardListItem, dashboardBtn, factorModal, factorLink },
  data() {
    return {
      modalVisible: false,
      modalMode: "",
      modalItem: {},
      sending: false,
    }
  },
  computed: {
    allPlans(this: any) {
      return this.composite.allPlans || []
    },
    composite() {
      return stored("customerComposite") || {}
    },
    subscriptions(this: any) {
      return this.composite.customer?.subscriptions?.data || []
    },
  },
  beforeDestroy() {
    this.modalVisible = false
  },
  methods: {
    async updateSubscription(this: any, _arguments: UpdateSubscription) {
      this.sending = _arguments.planId ?? true

      try {
        await requestUpdateSubscription(_arguments)
      } catch (error) {
        this.sending = false
        throw error
      }

      this.sending = false
      this.modalVisible = false
    },
    modal(this: any, mode: string, item: StripeNode.Subscription) {
      this.modalMode = mode
      this.modalItem = item
      this.modalVisible = true
    },
    standardDate,
    title(item: StripeNode.Subscription) {
      return item.plan?.nickname || "Subscription"
    },
    subTitle(item: StripeNode.Subscription) {
      return `Since ${standardDate(item.created)}`
    },
    meta(this: any, item: StripeNode.Subscription) {
      const meta = [
        { label: "Renews", value: standardDate(item.current_period_end) },
        { label: "Status", value: this.getStatus(item) },
        { value: this.getAmount(item) },
      ]

      return meta
    },
    additional(this: any, item: StripeNode.Subscription) {
      return [{ label: "Id", value: item.id }]
    },
    getStatus(item: StripeNode.Subscription) {
      if (item.status == "active" && item.cancel_at_period_end) {
        return "Awaiting Cancellation"
      } else {
        return toLabel(item.status as string)
      }
    },
    getAmount(this: any, item: StripeNode.Subscription) {
      let amount = item.plan?.amount ? item.plan?.amount / 100 : 0
      const interval = item.plan?.interval

      const coupon = item.discount?.coupon
      let discount = ""
      if (coupon) {
        const { percent_off, amount_off } = coupon

        if (percent_off) {
          amount = amount * (1 - percent_off / 100)
          discount = `${percent_off}% Off`
        } else if (amount_off) {
          amount = amount - amount_off
          discount = `$${amount_off / 100} Off`
        }
        discount = `<span class="discount-tag">(${discount})</span>`
      }

      return `$${Math.round(amount)} / ${interval} ${discount}`
    },
  },
}
</script>
<style>
.discount-tag {
  color: var(--color-primary);
  opacity: 0.5;
}
</style>
<style lang="less" scoped>
.zero-state {
  padding: 4rem;
  .super {
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 0.08em;
    font-size: 0.9em;
    color: var(--color-primary);
    margin-bottom: 0.5rem;
  }
  .title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  .sub-title {
    font-size: 1.5em;
    color: var(--color-text-secondary);
    line-height: 1.6;
  }
  .actions {
    margin-top: 1rem;
    a {
      margin: 0.5rem 1rem 0.5rem 0;
    }
  }
  @media (max-width: 900px) {
    padding: 1rem;
  }
}
.discount-tag {
  color: var(--color-primary);
}
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
