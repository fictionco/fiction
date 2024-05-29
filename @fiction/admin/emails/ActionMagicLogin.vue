<script setup lang="ts">
import type { Card } from '@fiction/site'
import { type EndpointResponse, toLabel, useService, vue } from '@fiction/core'
import TransactionWrap from '../TransactionWrap.vue'
import type { FictionAdmin } from '..'

type ActionProps = FictionAdmin['emailActions']['magicLoginEmailAction']

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  action: { type: Object as vue.PropType<ActionProps>, required: true },
  vars: { type: Object as vue.PropType<Record<string, any>>, required: true },
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
  return {
    superHeading: 'Success!',
    heading: 'You\'re Logged In',
    subHeading: 'You\'re now logged in to your account.',
    actions: [
      { name: 'Home', href: props.card.link('/'), btn: 'default' as const, icon: 'i-tabler-home' },
    ],
  }
})
</script>

<template>
  <TransactionWrap
    :loading="loading"
    v-bind="wrapProps"
  >
    {{ vars }}
  </TransactionWrap>
</template>
