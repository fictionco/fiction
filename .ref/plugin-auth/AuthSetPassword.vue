<script lang="ts" setup>
import ElInput from '@factor/ui/ElInput.vue'
import ElForm from '@factor/ui/ElForm.vue'
import ElButton from '@factor/ui/ElButton.vue'
import { emitEvent, vue } from '@factor/api/utils'
import type { FactorRouter } from '@factor/api/plugin-router'
import type { FactorUser } from '@factor/api/plugin-user'
import { useService } from '@factor/api/inject'
import RegisterWrap from './AuthWrap.vue'
import type { FactorAuth } from '.'

const { factorUser, factorAuth, factorRouter } = useService<{
  factorUser: FactorUser
  factorAuth: FactorAuth
  factorRouter: FactorRouter
}>()
const form = vue.ref({
  password: '',
  passwordConfirm: '',
})

const formError = vue.ref('')
const sending = vue.ref(false)
const disabled = vue.computed(() => form.value.password.length < 6)
const email = vue.computed(() => {
  const email = factorRouter.query.value.email as string | undefined

  return email ?? factorUser.activeUser.value?.email
})

const code = vue.computed(() => {
  const code = factorRouter.query.value.code as string | undefined
  return code
})

const flow = vue.computed(() => {
  const code = factorRouter.query.value.flow as string | undefined
  return code
})

vue.onMounted(async () => {
  await factorUser.userInitialized()
})

async function setPassword(): Promise<void> {
  if (!email.value) {
    formError.value = 'account email address is missing'
    return
  }

  if (!code.value) {
    formError.value = 'verification code is missing'
    return
  }

  const r = await factorUser.requests.SetPassword.request(
    {
      email: email.value,
      password: form.value.password,
      verificationCode: code.value,
    },
    { debug: true },
  )

  const q = factorRouter.query.value
  if (r.status === 'success') {
    let goto = q.redirect ? decodeURIComponent(q.redirect as string) : '/'

    const s = window.location.search

    if (s) {
      const searchParams = new URLSearchParams(s)

      if (q.flow === 'register' || q.flow === 'invite')
        searchParams.set('flow', `${q.flow}&newUser=1&login=new`)

      goto += `?${searchParams.toString()}`
    }
    else if (q.flow === 'register' || q.flow === 'invite') {
      goto += `?flow=${q.flow}&newUser=1&login=new`
    }

    console.warn(`redirecting to ${goto}`)

    // refresh page to prevent cross-auth edge cases that are difficult to test
    location.href = goto
  }
}

async function send(): Promise<void> {
  sending.value = true
  await setPassword()

  sending.value = false
}
</script>

<template>
  <RegisterWrap
    title="Create A Password"
    sub-title="Create a password to login with email"
    :loading="sending"
  >
    <ElForm :notify="formError" @submit="send()">
      <ElInput
        v-model="email"
        class="my-6"
        input="InputEmail"
        label="Email Address"
        autocomplete="username"
        placeholder="Email"
        disabled
      />

      <ElInput
        key="inputPassword"
        v-model="form.password"
        class="my-6"
        input="InputPassword"
        label="Create Password"
        sub-label="Minimum 6 characters"
        autocomplete="new-password"
        placeholder="Password"
        required
        @keyup.enter.stop="emitEvent('submit')"
      />

      <div class="action">
        <ElButton
          format="block"
          btn="primary"
          type="submit"
          :class="disabled ? 'opacity-80 cursor-not-allowed' : ''"
        >
          Set Password
        </ElButton>
      </div>
    </ElForm>
  </RegisterWrap>
</template>
