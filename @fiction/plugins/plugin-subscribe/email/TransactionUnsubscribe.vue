<script setup lang="ts">
import type { Card } from '@fiction/site'
import { useService, vue } from '@fiction/core'
import TransactionWrap from '@fiction/cards/transactions/TransactionWrap.vue'
import type { QueryVars } from '@fiction/plugins/plugin-transactions'
import type { FictionSubscribe } from '..'

type SpecEmailAction = FictionSubscribe['transactions']['subscribe']
const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  action: { type: Object as vue.PropType<SpecEmailAction>, required: true },
  queryVars: { type: Object as vue.PropType<QueryVars<SpecEmailAction['queryVars']>>, required: true },
})
const { fictionUser } = useService()
type TransactionProps = InstanceType<typeof TransactionWrap>['$props']

const loading = vue.ref(false)
const response = vue.ref<Awaited<ReturnType<SpecEmailAction['requestTransaction']>>>()
const errorMessage = vue.ref<string | undefined>()

const homeAction = { name: 'Home', href: '/', btn: 'default' as const, icon: 'i-tabler-home' }
const content = vue.computed<TransactionProps>(() => {
  if (errorMessage.value) {
    return {
      superHeading: 'Error',
      heading: 'Sorry! An error occurred',
      subHeading: `Please let us know (${errorMessage.value})`,
      status: 'error' as const,
      actions: [
        homeAction,
      ],
    }
  }
  else if (response.value) {
    return {
      superHeading: response.value.status,
      heading: props.queryVars.orgName || 'Subscribe',
      subHeading: response.value.message,
      status: response.value.status as 'success' | 'error' | 'pending',
      actions: [
        homeAction,
      ],
    }
  }
  else {
    return {
      icon: 'i-tabler-mail-x',
      heading: 'Unsubscribe',
      subHeading: 'Are you sure you want to unsubscribe?',
      status: 'pending',
      actions: [
        { name: 'Yes, unsubscribe', onClick: () => sendRequest(), btn: 'default', icon: 'i-tabler-x' },
        homeAction,
      ],
    }
  }
})

async function sendRequest() {
  loading.value = true

  const { userId, orgId, code } = props.queryVars

  if (!userId) {
    errorMessage.value = 'Missing userId'
  }
  else if (!orgId) {
    errorMessage.value = 'Missing orgId'
  }
  else {
    try {
      const r = await props.action.requestTransaction({ userId, orgId, code })
      response.value = r
    }
    catch (e) {
      errorMessage.value = (e as Error).message
    }
  }

  loading.value = false
}
</script>

<template>
  <TransactionWrap
    v-bind="content"
  />
</template>
