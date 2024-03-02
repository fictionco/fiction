<script lang="ts" setup>
import { vue } from '../utils'
import { useService } from '../inject'
import type { FactorRouter } from '../plugin-router'
import type { FactorUser } from '../plugin-user'
import { googleOneTap } from './google'

const { factorRouter, factorUser } = useService<{
  factorRouter: FactorRouter
  factorUser: FactorUser
}>()

async function showGoogle() {
  await googleOneTap({
    autoSignIn: false,
    promptParentId: 'google-signin-prompt',
    showPrompt: false,
    factorUser,
    callback: async (r) => {
      const email = r.user?.email
      if (email && r.isNew) {
        if (r.code) {
          await factorRouter.goto(
            'authSetPassword',
            {},
            { flow: 'register', code: r.code, email },
          )
        }
        else {
          await factorRouter.goto(
            'home',
            {},
            { flow: 'register', newUser: '1', email },
          )
        }
      }
      else {
        await factorRouter.goto('home')
      }
    },
  })
}

vue.onMounted(async () => {
  await factorUser.userInitialized()
  await showGoogle()
})
</script>

<template>
  <div
    id="google-signin-button"
    class="flex w-full justify-start text-left md:justify-center md:text-center"
  />
</template>
../plugin-user/google
