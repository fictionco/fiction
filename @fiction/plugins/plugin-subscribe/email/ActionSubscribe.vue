<script setup lang="ts">
import type { Card } from '@fiction/site'
import { type EndpointResponse, toLabel, vue } from '@fiction/core'
import TransactionWrap from '@fiction/cards/transactions/TransactionWrap.vue'
import type { EmailVars } from '@fiction/plugins/plugin-email-actions'
import type { FictionSubscribe } from '..'

type SpecEmailAction = FictionSubscribe['emailActions']['actionSubscribe']
type QueryVarType = SpecEmailAction['queryVars']
const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  action: { type: Object as vue.PropType<SpecEmailAction>, required: true },
  vars: { type: Object as vue.PropType<EmailVars<QueryVarType>>, required: true },
})

const form = vue.ref({ email: '', code: '' })

const loading = vue.ref(false)
const response = vue.ref<Awaited<ReturnType<SpecEmailAction['requestTransaction']>>>()

async function sendRequest() {
  loading.value = true

  const { userId, queryVars: { orgId = '' } = {} } = props.vars

  if (!userId || !orgId) {
    throw new Error('Missing userId or orgId')
  }

  const r = await props.action.requestTransaction({ userId, orgId })

  response.value = r

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
