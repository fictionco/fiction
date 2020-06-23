
<template>
  <div class="checkout-wrap">
    <div class="checkout">
      <div v-if="!status" class="header">
        <h1>Checkout</h1>
        <div class="action">
          <factor-link
            v-if="$route.query.interval == 'month'"
            :query="{...$route.query, interval: `year`}"
          >Pay Yearly (Save 40%)</factor-link>
          <factor-link v-else :query="{...$route.query, interval: `month`}">Pay Monthly Instead</factor-link>
          <factor-link path="/plans">Change plan?</factor-link>
        </div>
      </div>
      <div v-if="status == 'success'" class="status-info">
        <div class="success">
          <img class="media" src="./img/popper.svg" />
          <h2 class="title">Success</h2>
          <div class="sub">
            <p>Congratulations! You've officially upgraded to {{ productConfig.title }}</p>
          </div>
          <div class="action">
            <factor-link btn="primary" path="/docs/pro-suite">Using {{ productConfig.title }} &rarr;</factor-link>
            <factor-link btn="default" path="/dashboard/developer">Developer Dashboard &rarr;</factor-link>
          </div>
        </div>
      </div>
      <div v-else class="checkout-info">
        <div class="checkout-col payment-details">
          <div class="super">Premium Membership</div>
          <div class="purchasing">
            <div class="price">
              <span class="currency">$</span>
              <span class="amount">{{ getTotal() }}</span>
              <span class="period">per {{ plan.interval || "" }}</span>
            </div>
            <div class="product">
              <div class="name">{{ productConfig.title || "No Title" }}</div>
              <div class="sub">{{ productConfig.description || "No Description" }}</div>
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

            <div class="item coupon">
              <div v-if="!toggleCode" class="label" @click="toggleCode = true">Add Code</div>
              <div v-if="toggleCode" class="coupon-code">
                <factor-input-text v-model="coupon" placeholder="Enter Code" />
                <factor-btn
                  btn="default"
                  size="small"
                  :loading="sending == 'coupon'"
                  @click="applyCoupon()"
                >Apply</factor-btn>
              </div>
            </div>
          </div>

          <div class="action">
            <div class="secure">This is a secure 128-bit SSL encrypted payment</div>
            <factor-btn
              btn="primary"
              :loading="sending == 'confirm'"
              @click="createSubscription()"
            >Confirm Order</factor-btn>
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
import { stored, currentUser, emitEvent, setting } from "@factor/api"
import { factorBtn, factorIcon, factorLink, factorInputText } from "@factor/ui"
import {
  getStripeClient,
  requestCreateSubscription,
  requestPlanInfo,
  requestCoupon,
  getProductConfig,
} from "./stripe-client"
export default {
  components: {
    factorBtn,
    factorIcon,
    factorLink,
    factorInputText,
    creditCard: () => import("./cc.vue"),
  },
  data() {
    return {
      sending: false,
      error: "",
      toggleCode: false,
      coupon: "",
      couponData: undefined,
    }
  },
  computed: {
    currentUser,
    productConfig() {
      const slug = this.$route.query.product ?? "pro"
      return slug ? getProductConfig(slug as string) : {}
    },
    cardElement() {
      return stored("stripeCardElement")
    },
    plan() {
      return stored("planInfo") ?? {}
    },
    product() {
      return stored("productInfo") ?? {}
    },
    metadata(this: any) {
      return this.product.metadata ?? {}
    },
    status() {
      return this.$route.query.status
    },
  },
  watch: {
    $route: {
      handler: function (this: any) {
        this.setPlan()
      },
    },
  },
  mounted(this: any) {
    this.setPlan()
  },
  methods: {
    setting,
    getTotal(this: any) {
      const baseline = this.plan?.amount ?? 0
      let amount = baseline
      if (this.couponData) {
        const { duration, amount_off, percent_off, valid } = this.couponData

        if (valid && duration == "forever") {
          if (percent_off) {
            amount = baseline * (1 - percent_off / 100)
          } else if (amount_off) {
            amount = baseline - amount_off
          }
        }
      }

      return amount ? Math.round(amount / 100) : ""
    },
    async applyCoupon(this: any) {
      if (this.coupon) {
        this.sending = "coupon"
        try {
          this.couponData = await requestCoupon({ coupon: this.coupon })
          emitEvent("notify", "Code applied")
        } catch (error) {
          this.sending = false
          throw error
        }

        this.sending = false
      }
    },
    async setPlan() {
      const product = this.$route.query.product ?? "pro"
      const interval = this.$route.query.interval ?? "year"
      await requestPlanInfo(product as string, interval as string)
    },
    async createSubscription(this: any) {
      this.sending = "confirm"
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

        const { status } = await requestCreateSubscription({
          paymentMethodId: this.paymentMethodId,
          plan: this.plan,
          coupon: this.coupon,
        })

        if (status == "success") {
          emitEvent("notify", "Success!")
          emitEvent("refresh-user")
          this.$router.push({ query: { ...this.$route.query, status } })
        }
      }
      this.sending = false
    },
  },
  routeClass() {
    return "keep-focused"
  },
  metaInfo(this: any) {
    return {
      title: `Checkout ${this.productConfig.title}`,
      script: [
        {
          vmid: "stripe",
          src: "https://js.stripe.com/v3/",
        },
      ],
    }
  },
}
</script>

<style lang="less" scoped>
.checkout-wrap {
  padding: 6rem 0;
  @media (max-width: 900px) {
    padding: 3rem 0;
  }
}
.checkout {
  max-width: 800px;
  padding: 1rem;
  margin: 0 auto;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.5rem;
    margin-bottom: 0.5rem;
    h1 {
      font-size: 1.3em;
      font-weight: var(--font-weight-bold, 700);
    }
    .action {
      font-size: 0.85em;
      color: var(--color-text-secondary);
      a {
        color: inherit;
        margin-left: 0.75rem;
      }
    }
  }
  .footer {
    text-align: center;
    margin-top: 1rem;

    font-size: 0.85em;
    color: var(--color-text-secondary);
  }
}
.checkout-info,
.status-info {
  box-shadow: 0 0 0 1px var(--color-border);
  border-radius: 8px;
  background: #fff;
}

.checkout-info {
  display: grid;
  grid-template-columns: 1fr 2fr;
  .payment-details,
  .payment-area {
    padding: 3rem 2rem;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}
.status-info {
  padding: 5rem;
  text-align: center;
  .media {
    max-width: 150px;
  }
  .title {
    font-weight: var(--font-weight-bold, 700);
    font-size: 2em;
  }
  .sub {
    color: var(--color-text-secondary);
    p {
      margin: 1rem 0;
    }
  }
  .action {
    margin-top: 2rem;
    .factor-link {
      margin-right: 1rem;
    }
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
  .terms,
  .coupon {
    color: var(--color-text-secondary);
  }
  .terms,
  .coupon .label {
    font-size: 0.9em;
  }
  .coupon .label {
    margin-bottom: 0.5rem;
    display: inline-block;
    &:hover {
      cursor: pointer;

      color: var(--color-primary);
    }
  }
  .coupon-code {
    display: flex;
    input {
      width: 120px;
      margin-right: 1rem;
    }
  }
  .action {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    border-top: 1px solid var(--color-border);
    align-items: center;

    .secure {
      font-size: 11px;

      color: var(--color-text-secondary);
    }
  }
}
.payment-details {
  background: var(--color-bg-contrast);
  border-right: 1px solid var(--color-border);
  @media (max-width: 900px) {
    border-right: none;
    border-bottom: 1px solid var(--color-border);
  }
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
      font-size: 2.5em;
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
