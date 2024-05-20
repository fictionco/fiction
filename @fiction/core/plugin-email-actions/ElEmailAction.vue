<script setup lang="ts">
import type { Card } from '@fiction/site'
import { vue } from '../utils/libraries'
import { useService } from '../inject'
import type { EmailVars } from './action'
import type { FictionEmailActions } from '.'

type UserConfig = {
  test: string
}
defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const { fictionEmailActions, fictionRouter } = useService<{ fictionEmailActions: FictionEmailActions }>()

const actionId = vue.computed(() => {
  return fictionRouter.params.value.itemId as string
})

const vars = vue.computed(() => {
  const routeQuery = fictionRouter.query.value || {}
  return { actionId: actionId.value, ...routeQuery } as EmailVars
})

const currentAction = vue.computed(() => {
  const routeQuery = fictionRouter.query.value || {}
  const vars = { actionId: actionId.value, ...routeQuery } as EmailVars
  const allActions = fictionEmailActions.emailActions || {}
  const action = allActions[actionId.value]

  return action
})
</script>

<template>
  <div>
    <component :is="currentAction.settings.template" v-if="currentAction.settings.template" :card="card" :action="currentAction" :vars="vars" />
  </div>
</template>
