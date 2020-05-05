
<template>
  <div class="checkout-wrap">
    <div class="checkout">
      <div class="header">
        <h1>Checkout</h1>
        <div class="action">
          <factor-link path="/plans">Change selection?</factor-link>
        </div>
      </div>
      <div class="checkout-info">
        <div class="checkout-col payment-details">
          <div class="super">Your Membership</div>
          <div class="purchasing">
            <div class="price">
              <span class="currency">$</span>
              <span class="amount">348</span>
              <span class="period">per year</span>
            </div>
            <div class="product">
              <div class="name">Pro Suite</div>
              <div class="sub">Professional extensions, features and support.</div>
            </div>
          </div>
          <ul>
            <li>
              <factor-icon icon="fas fa-check" />
              <span class="text">Money-Back Guarantee</span>
            </li>
            <li>
              <factor-icon icon="fas fa-check" />
              <span class="text">Cancel Anytime</span>
            </li>
            <li>
              <factor-icon icon="fas fa-check" />
              <span class="text">Instant Access</span>
            </li>
          </ul>
        </div>
        <div class="checkout-col payment-info">
          <div class="payment-area">
            <div v-if="error" class="item error">
              <div id="card-errors" role="alert">{{ error }}</div>
            </div>
            <div class="item cc">
              <credit-card @submit="createSubscription()" @error="error = $event" />
            </div>

            <div class="item terms">
              By accepting the order and purchasing a subscription, you're agreeing to the
              <factor-link path="/terms-of-service">terms of service</factor-link>.
            </div>
          </div>

          <div class="action">
            <div class="secure">This is a secure 128-bit SSL encrypted payment</div>
            <factor-btn btn="primary" :loading="sending" @click="createSubscription()">Confirm Order</factor-btn>
          </div>
        </div>
      </div>
      <div class="footer contact">
        Have questions? Don't hesitate to
        <factor-link path="/terms">contact us</factor-link>.
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import Vue from "vue"
import { stored, currentUser, emitEvent } from "@factor/api"
import { factorBtn, factorIcon, factorLink } from "@factor/ui"
import { getStripeClient, requestCreateSubscription } from "."
export default Vue.extend({
  components: { factorBtn, factorIcon, factorLink, creditCard: () => import("./cc.vue") },
  data() {
    return {
      sending: false,
      error: "",
    }
  },
  computed: {
    currentUser,
    cardElement() {
      return stored("stripeCardElement")
    },
    plan() {
      return this.$route.query.plan
    },
  },
  methods: {
    async createSubscription(this: any) {
      this.sending = true
      this.error = ""
      const stripeClient = await getStripeClient()

      const { paymentMethod, error } = await stripeClient.createPaymentMethod({
        type: "card",
        card: this.cardElement,
        billing_details: {
          email: this.currentUser?.email ?? "",
        },
      })

      if (error) {
        this.error = error.message
        this.sending = false
        return
      }

      if (paymentMethod?.id) {
        this.paymentMethodId = paymentMethod?.id

        const result = await requestCreateSubscription({
          paymentMethodId: this.paymentMethodId,
          plan: this.plan,
        })

        console.log("result", result)

        emitEvent("notify", "Success!")
        this.sending = false
      }
    },
  },
  metaInfo() {
    return {
      title: "Checkout",
      script: [
        {
          vmid: "stripe",
          src: "https://js.stripe.com/v3/",
        },
      ],
    }
  },
})
</script>

<style lang="less" scoped>
.checkout-wrap {
  padding: 10rem 0;
}
.checkout {
  max-width: 800px;
  margin: 0 auto;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.5rem;
    margin-bottom: 0.5rem;
    h1 {
      font-size: 1.5em;
      font-weight: var(--font-weight-bold, 700);
    }
    .action {
      font-weight: var(--font-weight-bold, 700);
      opacity: 0.5;
      font-size: 0.85em;
      color: var(--color-text-secondary);
    }
  }
  .footer {
    text-align: center;
    margin-top: 1rem;
    opacity: 0.5;
    font-size: 0.85em;
    color: var(--color-text-secondary);
  }
}
.checkout-info {
  box-shadow: 0 0 0 1px var(--color-border);
  border-radius: 8px;
  background: #fff;

  display: grid;
  grid-template-columns: 1fr 2fr;
  .payment-details,
  .payment-area {
    padding: 3rem 2rem;
  }
}
.payment-info {
  display: grid;
  grid-template-rows: 1fr 4rem;
  .item {
    margin: 2rem 0;
  }
  .cc {
    .action {
      text-align: right;
    }
  }
  .item.error {
    color: var(--color-warning, "#ff0000");
    font-size: 0.8em;
  }
  .terms {
    opacity: 0.7;
    font-size: 0.85em;
    color: var(--color-text-secondary);
  }
  .action {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    border-top: 1px solid var(--color-border);
    align-items: center;

    .secure {
      font-size: 11px;
      opacity: 0.5;

      color: var(--color-text-secondary);
    }
  }
}
.payment-details {
  background: var(--color-bg-contrast);
  border-right: 1px solid var(--color-border);
  .super {
    text-transform: uppercase;
    font-weight: var(--font-weight-bold, 700);
    opacity: 0.5;
    color: var(--color-text-secondary);
  }

  .price {
    margin: 1rem 0;
    font-weight: var(--font-weight-bold, 700);

    .period {
      color: var(--color-text-secondary);
    }
    .currency {
      vertical-align: top;
      font-size: 1.3em;
    }
    .amount {
      font-size: 3.5em;
      line-height: 1;
    }
  }
  .product {
    .name {
      font-size: 1.1em;

      font-weight: var(--font-weight-bold, 700);
    }
    .sub {
      color: var(--color-text-secondary);
    }
  }
  ul {
    font-size: 0.9em;
    margin: 1rem 0;
    list-style: none;
    li {
      padding: 0.25em;
    }
    .factor-icon {
      opacity: 0.5;
      color: var(--color-primary);
      margin-right: 0.5rem;
    }
  }
}
</style>
