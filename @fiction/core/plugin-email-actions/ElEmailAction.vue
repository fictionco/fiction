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

const { fictionUser, fictionEmailActions, fictionRouter } = useService<{ fictionEmailActions: FictionEmailActions }>()

const loading = vue.ref(true)
const actionId = vue.computed(() => {
  return fictionRouter.params.value.itemId as string
})

const vars = vue.computed(() => {
  const routeQuery = fictionRouter.query.value || {}
  return { actionId: actionId.value, ...routeQuery } as EmailVars
})

const currentAction = vue.computed(() => {
  const allActions = fictionEmailActions.emailActions || {}
  const action = allActions[actionId.value]

  return action
})

vue.onMounted(async () => {
  if (vars.value.token)
    await fictionUser.userInitialized({ newToken: vars.value.token })

  loading.value = false
})
</script>

<template>
  <div>
    <div v-if="loading">
      <div class="text-theme-300 dark:text-theme-600 flex justify-center pt-32">
        <svg
          class="size-6 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    </div>
    <template v-else>
      <component :is="currentAction.settings.template" v-if="currentAction.settings.template" :card="card" :action="currentAction" :vars="vars" />
    </template>
  </div>
</template>
