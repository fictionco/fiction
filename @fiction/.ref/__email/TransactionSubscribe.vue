<script setup lang="ts">
import type { User } from '@fiction/core'
import type { QueryVars } from '@fiction/plugin-transactions'
import type { Card } from '@fiction/site'
import type { FictionContact } from '..'
import TransactionWrap from '@fiction/cards/standard/transaction/TransactionWrap.vue'
import { useService, vue } from '@fiction/core'

type SpecEmailAction = FictionContact['transactions']['subscribe']
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
      superTitle: { text: 'Error' },
      title: 'An error occurred',
      subTitle: errorMessage.value,
      status: 'error' as const,
      buttons: [
        { label: 'Home', href: props.card.link('/'), theme: 'primary', icon: 'i-tabler-home' },
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
        { label: 'Home', href: props.card.link('/'), theme: 'primary', icon: 'i-tabler-home' },
      ],
    } satisfies TransactionProps
  }
  else {
    return {
      loading: true,
      title: 'Loading...',
      status: 'pending',
    } satisfies TransactionProps
  }
})

async function sendRequest(user?: User) {
  loading.value = true

  const { userId, orgId, code } = props.queryVars

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
      const r = await props.action.requestTransaction({ userId, where: { orgId }, code })
      response.value = r
    }
    catch (e) {
      errorMessage.value = (e as Error).message
    }
  }

  loading.value = false
}

vue.onMounted(async () => {
  const user = await fictionUser.userInitialized({ caller: 'TransactionSubscribe' })
  await sendRequest(user)
})
</script>

<template>
  <TransactionWrap v-bind="content" />
</template>
