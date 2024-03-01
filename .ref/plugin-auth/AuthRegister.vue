<script lang="ts" setup>
import ElForm from '@factor/ui/ElForm.vue'
import ElInput from '@factor/ui/ElInput.vue'
import ElButton from '@factor/ui/ElButton.vue'
import { emitEvent, vue } from '../utils'
import type { FactorRouter } from '../plugin-router'
import { useService } from '../inject'
import AuthGoogleButton from './AuthGoogleButton.vue'
import AuthWrap from './AuthWrap.vue'
import type { FactorAuth } from '.'

const { factorRouter, factorAuth } = useService<{
  factorRouter: FactorRouter
  factorAuth: FactorAuth
}>()
const form = vue.ref({
  fullName: '',
  email: '',
  password: '',
  tos: false,
  accessCode: '',
  organizationName: '',
})
const sending = vue.ref(false)
const formError = vue.ref('')

async function send(): Promise<void> {
  sending.value = true
  formError.value = ''
  const { email, organizationName, fullName } = form.value

  const q = factorRouter.query.value

  await factorRouter.push({
    path: factorRouter.link('authVerify').value,
    query: { ...q, email, organizationName, fullName, flow: 'register' },
  })

  sending.value = false
}
</script>

<template>
  <AuthWrap title="Create New Account" :loading="sending">
    <template #sub>
      Have an account?
      <RouterLink
        id="to-login"
        :to="factorRouter.link('authLogin', {}, factorRouter.query.value).value"
        class="text-primary-500 hover:text-primary-600"
      >
        Login
      </RouterLink>
    </template>

    <div class="account-services text-center" data-test="google-button">
      <AuthGoogleButton mode="register" />
    </div>
    <div class="relative my-4">
      <div class="absolute inset-0 flex items-center" aria-hidden="true">
        <div class="w-full border-t border-slate-200" />
      </div>
      <div class="relative flex justify-center">
        <span class="text-theme-400 bg-white px-2 text-sm"> or </span>
      </div>
    </div>
    <ElForm
      :notify="formError"
      class="space-y-6"
      @submit="send()"
    >
      <ElInput
        id="input-name"
        v-model="form.fullName"
        label="Your Full Name"
        sub-label="What should we call you?"
        input="InputText"
        required
        placeholder="Name"
        @keyup.enter.stop="emitEvent('submit')"
      />

      <ElInput
        id="input-email"
        v-model="form.email"
        label="Your Email"
        sub-label="We'll send you a verification email."
        input="InputEmail"
        required
        placeholder="Email"
        @keyup.enter.stop="emitEvent('submit')"
      />

      <ElInput
        id="input-organization-name"
        v-model="form.organizationName"
        label="Organization Name"
        sub-label="(Optional) We'll use your email if blank."
        input="InputText"
        placeholder="Company"
        @keyup.enter.stop="emitEvent('submit')"
      />

      <div class="action text-center">
        <ElButton
          id="email-signin-button"
          btn="primary"
          format="block"
        >
          Create Account &rarr;
        </ElButton>
      </div>
      <div class="text-xs">
        By creating an account, you agree to the
        <a
          class="text-primary-700"
          :href="factorAuth.termsUrl"
          target="_blank"
        >terms</a>
        and
        <a
          class="text-primary-700"
          :href="factorAuth.privacyUrl"
          target="_blank"
        >privacy policy</a>.
      </div>
    </ElForm>
  </AuthWrap>
</template>
