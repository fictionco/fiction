<script setup lang="ts">
import type { Card } from '@fiction/site'
import type { FictionTransactions } from '.'
import type { EmailAction, EmailVars } from './action'
import TransactionWrap from '@fiction/cards/transactions/TransactionWrap.vue'
import { toCamel, useService, vue } from '@fiction/core'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import El404 from '@fiction/ui/page/El404.vue'

type UserConfig = {
  test: string
}
defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig> | undefined>, required: true },
})

const { fictionUser, fictionTransactions, fictionRouter } = useService<{ fictionTransactions: FictionTransactions }>()

const loading = vue.ref(true)
const actionId = vue.computed(() => {
  return toCamel(fictionRouter.params.value.itemId as string)
})

const vars = vue.computed(() => {
  const routeQuery = fictionRouter.query.value || {}
  return { actionId: actionId.value, ...routeQuery } as EmailVars
})

const currentAction = vue.computed<EmailAction | undefined>(() => {
  const allActions = fictionTransactions.emailActions || {}
  const action = allActions[actionId.value]

  return action
})

const authError = vue.ref()
vue.onMounted(async () => {
  try {
    await fictionUser.userInitialized()

    if (vars.value.token) {
      const queryToken = vars.value.token
      const code = vars.value.code
      const { status, data, message, token } = await fictionUser.requests.ManageUser.request({ _action: 'getUserWithToken', token: queryToken, code })

      if (status === 'success') {
        fictionUser.setCurrentUser({ user: data, token, reason: 'transactionToken' })
      }
      else {
        authError.value = message || 'Invalid token'
      }
    }
  }
  catch (e) {
    authError.value = (e as Error).message
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <div :data-action-id="actionId" :class="card?.classes?.value.contentWidth">
    <div v-if="loading">
      <div class="text-theme-300 dark:text-theme-600 flex justify-center pt-32">
        <ElSpinner class="size-6" />
      </div>
    </div>
    <TransactionWrap v-else-if="authError" heading="Login Problem" :sub-heading="authError" icon="i-tabler-x" icon-theme="error" />
    <template v-else-if="currentAction?.settings.template">
      <component
        :is="currentAction?.settings.template"
        v-if="currentAction?.settings.template"
        :card="card"
        :action="currentAction"
        :query-vars="vars"
      />
    </template>
    <El404 v-else heading="Missing Action" :sub-heading="`The transaction utility (${actionId}) wasn't found.`" />
  </div>
</template>
