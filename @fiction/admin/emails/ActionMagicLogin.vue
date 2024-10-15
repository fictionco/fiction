<script setup lang="ts">
import type { Card } from '@fiction/site'
import type { FictionAdmin } from '..'
import TransactionWrap from '@fiction/cards/transactions/TransactionWrap.vue'
import { useService, vue } from '@fiction/core'

type ActionProps = FictionAdmin['emailActions']['magicLoginEmailAction']

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  action: { type: Object as vue.PropType<ActionProps>, required: true },
  queryVars: { type: Object as vue.PropType<Record<string, any>>, required: true },
})

const { fictionUser, fictionRouter } = useService()

const loading = vue.ref(true)

vue.onMounted(async () => {
  const user = await fictionUser.userInitialized()

  if (user) {
    await fictionRouter.replace(props.card.link('/'), { caller: 'magic-login' })
  }

  loading.value = false
})

const wrapProps = vue.computed(() => {
  const actions = [
    { name: 'Home', href: props.card.link('/'), theme: 'default' as const, icon: 'i-tabler-home' },
  ]
  const success = {
    superHeading: 'Success!',
    heading: 'You\'re Logged In',
    subHeading: 'You\'re now logged in to your account.',
    icon: 'i-tabler-check',
    actions,
  }

  const error = {
    superHeading: 'Error!',
    heading: 'Invalid Token',
    subHeading: 'The token you provided is invalid. Please try again.',
    icon: 'i-tabler-x',
    actions,
  }

  return fictionUser.activeUser.value ? success : error
})
</script>

<template>
  <TransactionWrap
    :loading="loading"
    v-bind="wrapProps"
  />
</template>
