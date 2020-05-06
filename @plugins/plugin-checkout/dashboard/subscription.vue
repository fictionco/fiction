<template>
  <div class="subscriptions-list">
    <div v-for="(subscription, i) in subscriptions" :key="i" class="subscription">
      <div class="text-header">
        <div class="title">{{ subscription.title }}</div>
        <div class="description">{{ subscription.description }}</div>
      </div>
      <div class="meta-information">
        <div class="status data-item">
          <div class="label">Status:</div>
          <div class="value">{{ toLabel(subscription.status) }}</div>
        </div>
        <div class="next-payment data-item">
          <div class="label">Renews:</div>
          <div class="value">{{ standardDate(subscription.current_period_end) }}</div>
        </div>
        <div
          class="interval data-item"
        >${{ plan(subscription, 'amount') / 100 }} / {{ plan(subscription, 'interval') }}</div>
        <div class="data-item">
          <div
            class="toggle-additional-information value"
            @click="moreInfoToggle = moreInfoToggle == subscription.id ? false : subscription.id"
          >
            <span v-if="moreInfoToggle == subscription.id">{{ toggle.hide }} &uarr;</span>
            <span v-else>{{ toggle.show }} &darr;</span>
          </div>
        </div>
      </div>
      <transition name="fade">
        <div v-if="moreInfoToggle == subscription.id" class="additional-information">
          <div class="additional-items">
            <div class="id data-item">
              <div class="label">ID</div>
              <div class="value">{{ subscription.id }}</div>
            </div>
            <div class="id data-item">
              <div class="label">Actions</div>
              <div class="value">
                <factor-btn btn="default" class="switch" size="small">Switch Plan</factor-btn>
                <factor-btn btn="default" class="cancel" size="small">Cancel</factor-btn>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue"
import { stored, standardDate, toLabel } from "@factor/api"
import { factorBtn } from "@factor/ui"
import StripeNode from "stripe"
export default Vue.extend({
  name: "Subscriptions",
  components: { factorBtn },
  data() {
    return {
      moreInfoToggle: false,
      toggle: { show: "More", hide: "Less" },
    }
  },
  computed: {
    customer() {
      return stored("stripeCustomer") || {}
    },
    subscriptions(this: any) {
      const raw = this.customer.subscriptions?.data || []
      return raw.map(
        (_: StripeNode.Subscription & { title: string; description: string }) => {
          _.title = _.plan?.metadata?.title || "Subscription"
          _.description = _.plan?.metadata?.description || "Membership"
          return _
        }
      )
    },
  },
  methods: {
    standardDate,
    toLabel,
    plan(subscription: Record<string, any>, key: string) {
      return subscription.plan[key] ?? ""
    },
  },
})
</script>
<style lang="less" scoped>
.subscriptions-list {
  .fade-enter-active {
    transition: opacity 0.2s;
  }
  .fade-enter {
    opacity: 0;
  }
  .subscription {
    border-bottom: 1px solid var(--color-border);
    &:last-child {
      border-bottom: none;
    }
    padding: 2rem 0;
    .text-header {
      margin-bottom: 0.5rem;
      .title {
        font-size: 1.2em;
        font-weight: var(--font-weight-bold, 700);
        margin-bottom: 0.25rem;
      }
      .description {
        opacity: 0.7;
      }
    }

    .data-item {
      .value {
        font-weight: var(--font-weight-bold, 700);
      }
    }
    .meta-information {
      display: flex;
      flex-wrap: wrap;
      line-height: 1.7;
      overflow-x: scroll;
      .data-item {
        margin-right: 1rem;
        display: inline-block;
        white-space: nowrap;
        .value,
        .label {
          display: inline-block;
        }
        .label {
          opacity: 0.6;
        }
      }
    }
    .toggle-additional-information {
      cursor: pointer;
      padding: 0 0.5rem;
      border-radius: 4px;
      &:hover {
        background: var(--color-bg-contrast);
      }
    }
    .additional-information {
      padding: 1rem 0;
      .data-item {
        margin: 1rem 0;
        .label {
          font-weight: var(--font-weight-bold, 700);
          text-transform: uppercase;
          font-size: 0.8em;
          opacity: 0.4;
          margin-bottom: 0.5rem;
        }
        .value {
          .factor-btn {
            margin-right: 1rem;
          }
        }
      }
    }
  }
}
</style>
