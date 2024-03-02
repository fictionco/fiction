<script lang="ts">
import { currentUser, emitEvent, standardDate, stored, toLabel } from '@factor/api'
import { dashboardBtn, dashboardListItem, factorModal } from '@factor/ui'
import type StripeNode from 'stripe'
import { getStripeClient, requestPaymentMethodAction } from '../stripe-client'

export default {
  name: 'PaymentMethods',
  components: {
    DashboardListItem: dashboardListItem,
    FactorModal: factorModal,
    DashboardBtn: dashboardBtn,
    CreditCard: () => import('../cc.vue'),
  },
  data() {
    return { modalVisible: false, error: '', sending: false, cardDescription: '' }
  },
  computed: {
    composite() {
      return stored('customerComposite') || {}
    },
    paymentMethods(this: any) {
      return this.composite.paymentMethods?.data || []
    },
    customer(this: any) {
      return this.composite.customer || {}
    },
    cardElement() {
      return stored('stripeCardElement')
    },
    currentUser,
  },
  methods: {
    standardDate,
    async action(this: any, pm: StripeNode.PaymentMethod, action: 'delete' | 'default') {
      this.sending = action
      await requestPaymentMethodAction({
        action,
        paymentMethodId: pm.id,
        customerId: this.currentUser?.stripeCustomerId,
      })
      this.sending = false
    },
    async addPaymentMethod(this: any) {
      this.sending = 'setup'
      this.error = ''
      const stripeClient = await getStripeClient()

      const { paymentMethod, error } = await stripeClient.createPaymentMethod({
        type: 'card',
        card: this.cardElement,
        billing_details: {
          email: this.currentUser?.email ?? '',
        },
      })

      if (error) {
        this.error = error.message
        this.sending = false
        return
      }

      if (paymentMethod?.id) {
        this.paymentMethodId = paymentMethod?.id

        await requestPaymentMethodAction({
          action: 'setup',
          paymentMethodId: this.paymentMethodId,
          customerId: this.currentUser?.stripeCustomerId,
        })

        this.modalVisible = false
        emitEvent('notify', 'Success!')
      }
      this.sending = false
    },
    title(item: StripeNode.PaymentMethod) {
      const last4 = item.card?.last4

      return `${toLabel(item.card?.brand)} (**** ${last4})`
    },
    subTitle(item: StripeNode.PaymentMethod) {
      return item.type === 'card' ? 'Credit Card' : 'Other'
    },
    isDefault(this: any, item: StripeNode.PaymentMethod) {
      return item.id === this.customer.invoice_settings.default_payment_method
    },
    meta(this: any, item: StripeNode.PaymentMethod) {
      const meta: { label?: string, value?: string, tag?: string }[] = [
        { label: 'Expires', value: `${item.card?.exp_month}/${item.card?.exp_year}` },
        { label: 'Created', value: standardDate(item.created) },
      ]

      if (this.isDefault(item))
        meta.unshift({ tag: 'Default' })

      return meta
    },
    additional(this: any, item: StripeNode.PaymentMethod) {
      return [
        { label: 'Id', value: item.id },
        { label: 'Billing Email', value: item.billing_details.email },
        {
          label: 'Billing Postal Code',
          value: item.billing_details.address?.postal_code || 'N/A',
        },
      ]
    },
  },
}
</script>

<template>
  <div>
    <div class="list-action">
      <DashboardBtn btn="primary" @click="modalVisible = true">
        Add New Payment Method
      </DashboardBtn>
    </div>
    <div v-if="paymentMethods.length === 0" class="zero-state">
      <div class="title">
        No payment methods found.
      </div>
    </div>
    <template v-else>
      <DashboardListItem
        v-for="(item, i) in paymentMethods"
        :key="i"
        :title="title(item)"
        :sub-title="subTitle(item)"
        :meta="meta(item)"
        :additional="additional(item)"
      >
        <template #actions>
          <template v-if="!isDefault(item)">
            <DashboardBtn
              size="small"
              btn="primary"
              :loading="sending === 'default'"
              @click="action(item, `default`)"
            >
              Set To Default
            </DashboardBtn>
            <DashboardBtn
              v-if="!isDefault(item)"
              size="small"
              btn="default"
              :loading="sending === 'delete'"
              @click="action(item, `delete`)"
            >
              Delete
            </DashboardBtn>
          </template>
          <template v-else>
            <DashboardBtn
              btn="default"
              size="small"
              @click="modalVisible = true"
            >
              Add Another Payment Method
            </DashboardBtn>
          </template>
        </template>
      </DashboardListItem>
    </template>
    <FactorModal v-model:vis="modalVisible" class="add-payment-method">
      <h2>Add Payment Method</h2>
      <div class="content">
        <div v-if="error" class="error">
          {{ error }}
        </div>

        <CreditCard @error="error = $event" />
        <div class="actions">
          <DashboardBtn
            btn="primary"
            :loading="sending === 'setup'"
            @click="addPaymentMethod()"
          >
            Add Card &rarr;
          </DashboardBtn>
        </div>
      </div>
    </FactorModal>
  </div>
</template>

<style lang="postcss" scoped>
.add-payment-method {
  h2 {
    font-size: 1.5em;
    font-weight: var(--font-weight-bold, 700);
    margin-bottom: 2rem;
  }
  .actions {
    margin-top: 1rem;
  }
  .error {
    margin: 1rem 0;
  }
}

.zero-state {
  padding: 4rem 0;
  .title {
    font-size: 1.2em;
  }
}
</style>
