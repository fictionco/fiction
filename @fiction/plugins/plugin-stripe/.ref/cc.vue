<script lang="ts">
import { factorForm } from '@factor/ui'
import { storeItem, userInitialized } from '@factor/api'
import { getStripeClient } from './stripeClient'

export default {
  name: 'CC',
  components: { FactorForm: factorForm },
  data() {
    return {
      stripe: undefined,
      elements: undefined,
      error: '',
      style: {
        base: {
          'color': '#32325d',
          'fontFamily': '"Helvetica Neue", Helvetica, sans-serif',
          'fontSmoothing': 'antialiased',
          'fontSize': '16px',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a',
        },
      },
    }
  },
  async mounted(this: any) {
    this.user = await userInitialized()
    this.setPage()
  },

  methods: {
    async setPage(this: any) {
      this.stripe = await getStripeClient()

      this.elements = this.stripe.elements()

      this.cardElement = this.elements.create('card', { style: this.style })

      this.cardElement.addEventListener(
        'change',
        ({ error }: { error: Error }) => {
          if (error && error.message)
            this.$emit('error', error.message)
        },
      )

      this.cardElement.mount('#card-element')

      storeItem('stripeCardElement', this.cardElement)
    },
  },
}
</script>

<template>
  <div ref="cc" class="cc">
    <FactorForm id="subscription-form" @submit="$emit('submit')">
      <div
        id="card-element"
        ref="card"
        class="cc-el"
      />
    </FactorForm>
  </div>
</template>

<style lang="less" scoped>
.cc {
  border-radius: 6px;
  border: 1px solid var(--color-border);
  padding: 1rem;
}
</style>
