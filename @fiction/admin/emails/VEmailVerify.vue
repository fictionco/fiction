<script setup lang="ts">
import type { Card } from '@fiction/site'
import { vue } from '@fiction/core'
import TransactionWrap from '@fiction/cards/transactions/TransactionWrap.vue'
import type { FictionAdmin } from '..'

type VerifyEmailAction = FictionAdmin['emailActions']['verifyEmailAction']

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  action: { type: Object as vue.PropType<VerifyEmailAction>, required: true },
  queryVars: { type: Object as vue.PropType<Record<string, any>>, required: true },
})

const form = vue.ref({ email: '', code: '' })

const loading = vue.ref(false)
const response = vue.ref<Awaited<ReturnType<VerifyEmailAction['requestTransaction']>>>()

async function sendRequest() {
  loading.value = true

  const r = await props.action.requestTransaction(form.value)

  response.value = r

  loading.value = false
}

vue.onMounted(async () => {
  form.value = {
    email: props.queryVars.email,
    code: props.queryVars.code,
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
