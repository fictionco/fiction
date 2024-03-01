<script lang="ts" setup>
import ElForm from '@factor/ui/ElForm.vue'
import { onEvent, storeItem, stored, vue } from '@factor/api'
import { useKaption } from '../utils'
import type { CardElements } from './types'

defineEmits(['created', 'error'])

const { kaptionDashboard, factorStripe, factorUser } = useKaption()

const filter = kaptionDashboard.kaptionFilter
const formError = vue.ref<string>()

const def = {
  name: '',
  zip: '',
  email: '',
}

const cardElements = vue.ref<Partial<CardElements>>(def)

vue.watch(
  () => cardElements.value,
  (v) => {
    storeItem('cardElements', {
      ...stored<Partial<CardElements>>('cardElements'),
      ...v,
    })
  },
  { deep: true },
)

const stripeCardStyle = vue.ref({
  base: {
    'color': '#3a4854',
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
})
const inputClasses = vue.ref(
  'p-2 text-base leading-5 border shadow-sm rounded-md border-slate-200 placeholder-slate-400 focus:ring-primary-500 focus:border-primary-500',
)

function inputListeners(): void {
  const inputs = document.querySelectorAll<HTMLInputElement>(
    '#addPaymentMethodForm .input',
  )
  inputs.forEach((input: HTMLInputElement) => {
    input.addEventListener('focus', () => {
      input.classList.add('focused')
    })
    input.addEventListener('blur', () => {
      input.classList.remove('focused')
    })
    input.addEventListener('keyup', () => {
      if (input.value.length === 0)
        input.classList.add('empty')
      else
        input.classList.remove('empty')
    })
  })
}

function runErrors(error: {
  type?: string
  code?: string
  message?: string
} = {}): void {
  formError.value = error.message ?? ''
}

onEvent('formError', error => runErrors(error as Error))

let loops = 0
async function initialize(): Promise<void> {
  loops++
  const user = await factorUser.userInitialized()

  cardElements.value.email = user?.email

  const el = document.querySelector('#cardNumber')
  if (!el && loops < 50) {
    setTimeout(() => initialize(), 50)
    return
  }
  const stripe = await factorStripe.getBrowserClient()
  inputListeners()
  const elements = stripe.elements()
  const options = {
    style: stripeCardStyle.value,
    classes: {
      base: inputClasses.value,
    },
  }

  const cardNumber = elements.create('cardNumber', options)
  cardNumber.mount('#cardNumber')
  cardNumber.on('change', e => runErrors(e.error))

  const cardExpiry = elements.create('cardExpiry', options)
  cardExpiry.mount('#cardExpiry')
  cardExpiry.on('change', e => runErrors(e.error))

  const cardCvc = elements.create('cardCvc', options)
  cardCvc.mount('#cardCvc')
  cardCvc.on('change', e => runErrors(e.error))

  const card = {
    cardNumber,
    cardExpiry,
    cardCvc,
  }

  onEvent('resetForm', () => {
    Object.values(card).forEach(c => c.clear())
    cardElements.value = {}
  })

  storeItem('cardElements', {
    ...stored<Partial<CardElements>>('cardElements'),
    card,
  })
}

vue.onUpdated(() => initialize())
vue.onMounted(() => initialize())
</script>

<template>
  <ElForm id="addPaymentMethodForm" autocomplete>
    <div v-if="formError" class="my-4 rounded-md bg-yellow-50 p-4">
      <div class="flex">
        <div class="shrink-0">
          <!-- Heroicon name: solid/exclamation -->
          <svg
            class="h-5 w-5 text-yellow-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-yellow-800">
            {{ formError }}
          </h3>
        </div>
      </div>
    </div>
    <div class="my-8 grid grid-cols-12 gap-4">
      <div class="col-span-12 sm:col-span-6">
        <label class="mb-1 block text-sm font-semibold" for="cardName">Name on Card</label>
        <input
          id="cardName"
          v-model="cardElements.name"
          class="w-full"
          type="text"
          :class="inputClasses"
          placeholder="Name on Card"
          autocomplete="cc-name"
        >
      </div>
      <div class="order-last col-span-6 sm:order-none sm:col-span-3">
        <label class="mb-1 block text-sm font-semibold" for="cardZip">Billing Zip Code</label>
        <input
          id="cardZip"
          v-model="cardElements.zip"
          class="w-full"
          type="text"
          :class="inputClasses"
          placeholder="Postal Code"
          autocomplete="billing postal-code"
        >
      </div>
      <div class="col-span-12 sm:col-span-6">
        <label class="mb-1 block text-sm font-semibold" for="cardExpiry">Card Number</label>
        <div
          id="cardNumber"
          class="input empty rounded-md border border-slate-200 p-2"
        />
      </div>

      <div class="col-span-6 sm:col-span-3">
        <label class="mb-1 block text-sm font-semibold" for="cardExpiry">Expiration</label>
        <div
          id="cardExpiry"
          class="input empty rounded-md border border-slate-200 p-2"
        />
      </div>

      <div class="col-span-6 sm:col-span-3">
        <label class="mb-1 block text-sm font-semibold" for="cardCvc">CVC</label>
        <div
          id="cardCvc"
          class="input empty rounded-md border border-slate-200 p-2"
        />
      </div>
    </div>
    <input
      id="ccSubmit"
      type="submit"
      class="hidden"
      value="Submit"
    >
  </ElForm>
</template>
