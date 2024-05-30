<script setup lang="ts">
import type { Card } from '@fiction/site'
import { type EndpointResponse, toLabel, vue } from '@fiction/core'
import TransactionWrap from '@fiction/cards/transactions/TransactionWrap.vue'
import type { FictionAdmin } from '..'

type VerifyEmailAction = FictionAdmin['emailActions']['verifyEmailAction']

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  action: { type: Object as vue.PropType<VerifyEmailAction>, required: true },
  vars: { type: Object as vue.PropType<Record<string, any>>, required: true },
})

const form = vue.ref({
  email: '',
  code: '',
})

const loading = vue.ref(false)
const response = vue.ref<EndpointResponse>()

async function sendRequest() {
  loading.value = true

  response.value = await props.action.requestTransaction(form.value)

  loading.value = false
}

vue.onMounted(async () => {
  form.value = {
    email: props.vars.email,
    code: props.vars.code,
  }

  await sendRequest()
})
</script>

<template>
  <TransactionWrap
    :loading="loading"
    :super-heading="response?.status"
    heading="Verify Email"
    :sub-heading="response?.message"
    :actions="[
      { name: 'Home', href: card.link('/'), btn: 'default', icon: 'i-tabler-home' },
      { name: 'Support', href: `mailto:hello@fiction.com`, target: '_blank', icon: 'i-tabler-mail' },
    ]"
  />
</template>
