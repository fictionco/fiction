<script lang="ts" setup>
import ElInput from '@factor/ui/ElInput.vue'
import ElForm from '@factor/ui/ElForm.vue'
import ElButton from '@factor/ui/ElButton.vue'
import { emitEvent, vue } from '../utils'
import type { FactorRouter } from '../plugin-router'
import type { FactorApp } from '../plugin-app'
import type { FactorUser } from '../plugin-user'
import { useService } from '../inject'
import AuthGoogleButton from './AuthGoogleButton.vue'
import RegisterWrap from './AuthWrap.vue'
import type { FactorAuth } from '.'

const { factorUser, factorApp, factorRouter, factorAuth } = useService<{
  factorUser: FactorUser
  factorAuth: FactorAuth
  factorApp: FactorApp
  factorRouter: FactorRouter
}>()

const form = vue.ref({ email: '', password: '' })
const sending = vue.ref(false)
const formError = vue.ref('')
async function send(): Promise<void> {
  sending.value = true
  formError.value = ''
  const { email, password } = form.value

  if (!email)
    formError.value = 'Please enter your email'

  if (!password)
    formError.value = 'Please enter your password'

  const r = await factorUser.requests.Login.request({
    email,
    password,
  })
  const q = factorRouter.query.value

  if (r.status === 'success') {
    if (r.user?.emailVerified) {
      // refresh page to ensure auth state handled correctly
      // otherwise it becomes an edge-case

      let goto = q.redirect ? decodeURIComponent(q.redirect as string) : '/'

      const s = window.location.search

      if (s)
        goto += `?${s}`

      // refresh page to prevent cross-auth edge cases that are difficult to test
      location.href = goto
    }
    else {
      await factorRouter.push({
        path: factorRouter.link('authVerify').value,
        query: { ...q, email },
      })
    }
  }

  sending.value = false
}
</script>

<template>
  <RegisterWrap
    title="Login"
    sub-title="Welcome back. Please login to continue."
    :loading="sending"
  >
    <template #sub>
      No account?
      <RouterLink
        id="to-register"
        :to="factorRouter.link('authRegister').value"
        class="text-primary-500 hover:text-primary-600"
      >
        Create One
      </RouterLink>
    </template>
    <template #footer>
      <div class="flex justify-center space-x-7">
        <RouterLink
          :to="factorRouter.link('authRegister').value"
          class="hover:text-primary-500 ml-1"
        >
          New Account
        </RouterLink>

        <RouterLink
          :to="factorRouter.link('authResetPassword').value"
          class="hover:text-primary-500 ml-1"
        >
          Reset Password
        </RouterLink>
      </div>
    </template>

    <div class="account-services text-center">
      <AuthGoogleButton mode="login" />
    </div>
    <div class="relative my-4">
      <div class="absolute inset-0 flex items-center" aria-hidden="true">
        <div class="w-full border-t border-slate-200" />
      </div>
      <div class="relative flex justify-center">
        <span class="text-theme-400 bg-white px-2 text-sm"> or </span>
      </div>
    </div>
    <ElForm :notify="formError" @submit="send()">
      <ElInput
        id="input-email"
        key="inputEmail"
        v-model="form.email"
        class="my-6"
        label="Email Address"
        input="InputEmail"
        required
        placeholder="Email"
        @keyup.enter.stop="emitEvent('submit')"
      />

      <ElInput
        id="input-password"
        key="inputPassword"
        v-model="form.password"
        class="my-6"
        input="InputPassword"
        label="Password"
        autocomplete="current-password"
        required
        @keyup.enter.stop="emitEvent('submit')"
      />

      <div class="action">
        <ElButton
          id="email-signin-button"
          type="submit"
          format="block"
          btn="primary"
        >
          Login
        </ElButton>
      </div>
    </ElForm>
  </RegisterWrap>
</template>
