<script setup lang="ts">
import type { QueryVars } from '@fiction/plugin-transactions'
import type { Card } from '@fiction/site'
import type { FictionContact } from '..'
import TransactionWrap from '@fiction/cards/standard/transaction/TransactionWrap.vue'
import { vue } from '@fiction/core'

type SpecEmailAction = FictionContact['transactions']['subscribe']
const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  action: { type: Object as vue.PropType<SpecEmailAction>, required: true },
  queryVars: { type: Object as vue.PropType<QueryVars<SpecEmailAction['queryVars']>>, required: true },
})

type TransactionProps = InstanceType<typeof TransactionWrap>['$props']

const loading = vue.ref(false)
const response = vue.ref<Awaited<ReturnType<SpecEmailAction['requestTransaction']>>>()
const errorMessage = vue.ref<string | undefined>()

const homeAction = { name: 'Home', href: '/', theme: 'default' as const, icon: 'i-tabler-home' }
const content = vue.computed<TransactionProps>(() => {
  if (errorMessage.value) {
    return {
      superTitle: { text: 'Error' },
      title: 'Sorry! An error occurred',
      subTitle: `Please let us know (${errorMessage.value})`,
      status: 'error' as const,
      buttons: [
        homeAction,
      ],
    } satisfies TransactionProps
  }
  else if (response.value) {
    return {
      superTitle: { text: response.value.status },
      title: props.queryVars.name || 'Subscribe',
      subTitle: response.value.message,
      status: response.value.status as 'success' | 'error' | 'pending',
      buttons: [
        homeAction,
      ],
    } satisfies TransactionProps
  }
  else {
    return {
      icon: 'i-tabler-mail-x',
      title: 'Unsubscribe',
      subTitle: 'Are you sure you want to unsubscribe?',
      status: 'pending',
      buttons: [
        { label: 'Yes, unsubscribe', onClick: () => sendRequest(), theme: 'default', icon: 'i-tabler-x' },
        homeAction,
      ],
    } satisfies TransactionProps
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
      const r = await props.action.requestTransaction({ userId, where: { orgId }, code })
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
