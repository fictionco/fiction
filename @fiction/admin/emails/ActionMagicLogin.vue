<script setup lang="ts">
import type { Card } from '@fiction/site'
import type { FictionAdmin } from '..'
import TransactionWrap from '@fiction/cards/page-transaction/TransactionWrap.vue'
import { useService, vue } from '@fiction/core'

type ActionProps = FictionAdmin['emailActions']['magicLoginEmailAction']

const { card, action, queryVars } = defineProps<{
  card: Card
  action: ActionProps
  queryVars: Record<string, any>
}>()

const { fictionUser } = useService()

const loading = vue.ref(true)

vue.onMounted(async () => {
  const user = await fictionUser.userInitialized()

  if (user) {
    await card.goto({ path: '/', query: queryVars }, { caller: 'magic-login', replace: true })
  }

  loading.value = false
})

type TProps = InstanceType<typeof TransactionWrap>['$props']
const wrapProps = vue.computed<TProps>(() => {
  const buttons = [
    {
      name: 'Home',
      href: card.link({ path: '/', query: queryVars }),
      theme: 'default' as const,
      icon: 'i-tabler-home',
    },
  ]
  const success: TProps = {
    superTitle: { text: 'Success!' },
    title: 'You\'re Logged In',
    subTitle: 'You\'re now logged in to your account.',
    icon: 'i-tabler-check',
    buttons,
  }

  const error: TProps = {
    superTitle: { text: 'Error!' },
    title: 'Invalid Token',
    subTitle: 'The token you provided is invalid. Please try again.',
    icon: 'i-tabler-x',
    buttons,
  }

  return fictionUser.activeUser.value ? success : error
})
</script>

<template>
  <TransactionWrap :loading="loading" v-bind="wrapProps" />
</template>
