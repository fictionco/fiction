<script setup lang="ts">
import type { Card } from '@fiction/site'
import { type User, useService, vue } from '@fiction/core'
import TransactionWrap from '@fiction/cards/transactions/TransactionWrap.vue'
import type { QueryVars } from '@fiction/plugins/plugin-email-actions'
import type { FictionEmailActions } from '@fiction/plugin-email-actions'
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

const content = vue.computed<TransactionProps>(() => {
  if (errorMessage.value) {
    return {
      superHeading: 'Error',
      heading: 'An error occurred',
      subHeading: errorMessage.value,
      status: 'error' as const,
      actions: [
        { name: 'Home', href: props.card.link('/'), btn: 'primary', icon: 'i-tabler-home' },
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
        { name: 'Home', href: props.card.link('/'), btn: 'primary', icon: 'i-tabler-home' },
      ],
    }
  }
  else {
    return {
      loading: true,
      heading: 'Loading...',
      status: 'pending',
    }
  }
})

async function sendRequest(user?: User) {
  loading.value = true

  const { userId, orgId } = props.queryVars

  if (!user) {
    errorMessage.value = 'Not logged in'
  }
  else if (!userId) {
    errorMessage.value = 'Missing userId'
  }
  else if (!orgId) {
    errorMessage.value = 'Missing orgId'
  }
  else {
    try {
      const r = await props.action.requestTransaction({ userId, orgId })
      response.value = r
    }
    catch (e) {
      errorMessage.value = (e as Error).message
    }
  }

  loading.value = false
}

vue.onMounted(async () => {
  const user = await fictionUser.userInitialized()
  await sendRequest(user)
})
</script>

<template>
  <TransactionWrap
    v-bind="content"
  />
</template>
