<script lang="ts" setup>
import type { EndpointResponse, MediaObject, User } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import type { FictionAdmin } from '..'
import TransactionView from '@fiction/cards/standard/transaction/TransactionView.vue'
import TransactionWrap from '@fiction/cards/standard/transaction/TransactionWrap.vue'
import { isValidEmail, toCamel, toKebab, unhead, useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import EffectTransitionList from '@fiction/ui/effect/EffectTransitionList.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'

// Types
type UserConfig = { logo?: MediaObject, termsUrl?: string, privacyUrl?: string }
type OrgData = { orgId: string, orgName: string, primaryDomain?: string }

// Props
const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

// Services and state
const { fictionRouter, fictionAdmin, fictionEnv, fictionUser } = useService<{ fictionAdmin: FictionAdmin }>()
const userConfig = vue.computed(() => props.card.userConfig.value)
const termsUrl = vue.computed(() => userConfig.value.termsUrl || fictionEnv.meta?.termsUrl)
const privacyUrl = vue.computed(() => userConfig.value.privacyUrl || fictionEnv.meta?.privacyUrl)
const form = vue.reactive({
  email: '',
  fullName: '',
  orgName: '',
  password: '',
  passwordConfirm: '',
  oneTimeCode: '',
})
const state = vue.reactive({
  isLoadingOrg: false,
  sending: false,
  formError: '',
  redirectCountdown: 0,
  userToken: '',
  orgData: null as OrgData | null,
  redirectTimer: null as number | null,
})

// Computed properties
const orgHandle = vue.computed(() => decodeURIComponent(fictionRouter.query.value.for as string || ''))
const redirectUrl = vue.computed(() => decodeURIComponent(fictionRouter.query.value.redirect as string || ''))
const emailQueryVars = vue.computed(() => ({ for: orgHandle.value || '' }))

// Auth state configuration
interface AuthState {
  title: string
  subTitle?: string
  icon: string
  status?: 'success'
  showEmailInput?: boolean
  showPasswordInputs?: boolean
  showCodeInput?: boolean
  showTerms?: boolean
  isSuccess?: boolean
  callback: (args: { caller: string }) => Promise<void>
}

type AuthStateKey = 'welcome' | 'verifyEmail' | 'verifySuccess' | 'emailLinkSent' | 'resetPassword' | 'loginPassword' | 'resetPasswordSent' | 'setNewPassword' | 'passwordUpdated'

const states: Record<AuthStateKey, AuthState> = {
  welcome: {
    title: 'Sign in',
    subTitle: 'Enter your email to continue',
    icon: 'i-tabler-user-share',
    showEmailInput: true,
    showTerms: true,
    callback: args => sendOneTimeCode('emailLinkSent', args),
  },
  verifyEmail: {
    title: 'Confirm Code',
    subTitle: 'Enter the code we sent to your inbox',
    icon: 'i-tabler-mail-check',
    showCodeInput: true,
    callback: () => verifyCode(response => navigateTo(!response.isNew ? 'setNewPassword' : 'verifySuccess')),
  },
  verifySuccess: {
    title: 'Success!',
    subTitle: 'You are now logged in',
    icon: 'i-tabler-user-check',
    status: 'success',
    isSuccess: true,
    callback: () => redirectToDashboard(),
  },
  emailLinkSent: {
    title: 'Check your inbox',
    subTitle: 'We sent a code to your email',
    icon: 'i-tabler-mail',
    status: 'success',
    showCodeInput: true,
    callback: () => verifyCode(response => navigateTo(response.isNew ? 'setNewPassword' : 'verifySuccess')),
  },
  resetPassword: {
    title: 'Reset password',
    subTitle: 'Enter your email to continue',
    icon: 'i-tabler-lock-open',
    showEmailInput: true,
    callback: () => sendOneTimeCode('resetPasswordSent'),
  },
  loginPassword: {
    title: 'Login with Password',
    subTitle: 'Enter your password to continue',
    icon: 'i-tabler-key',
    showEmailInput: true,
    showPasswordInputs: true,
    callback: passwordLogin,
  },
  resetPasswordSent: {
    title: 'Check your inbox',
    subTitle: 'We sent password reset instructions',
    icon: 'i-tabler-mail',
    status: 'success',
    showCodeInput: true,
    callback: () => verifyCode(() => navigateTo('setNewPassword')),
  },
  setNewPassword: {
    title: 'Create your password',
    icon: 'i-tabler-key',
    showPasswordInputs: true,
    callback: setNewPassword,
  },
  passwordUpdated: {
    title: 'Password updated!',
    subTitle: 'Your new password has been set',
    icon: 'i-tabler-check',
    status: 'success',
    isSuccess: true,
    callback: () => redirectToDashboard(),
  },
}

// Current state
const authState = vue.computed<AuthStateKey>(() => {
  const stateFromUrl = toCamel(fictionRouter.params.value.itemId as string || '')
  return Object.keys(states).includes(stateFromUrl) ? stateFromUrl as AuthStateKey : 'welcome'
})

const currentState = vue.computed(() => {
  const s = { ...states[authState.value] }
  if (state.orgData?.orgName && s.title === 'Sign in') {
    s.title = `Sign in to ${state.orgData.orgName}`
  }
  return s
})

const isCodeConfirmState = vue.computed(() => !!currentState.value.showCodeInput)
const isSuccessState = vue.computed(() => !!currentState.value.isSuccess)
const pageTitle = vue.computed(() =>
  `${state.orgData ? `${state.orgData.orgName} - ` : ''}${authState.value === 'welcome' ? 'Sign in' : 'Create account'} - ${fictionEnv.meta?.name}`)

// Lifecycle hooks
vue.onMounted(() => {
  unhead.useHead({ title: pageTitle, meta: [{ name: 'description', content: pageTitle }] })
  handleQueryParams()
  vue.watch(authState, () => {
    state.formError = ''
    if (isSuccessState.value)
      startRedirectCountdown()
  })
})

vue.onBeforeUnmount(() => clearRedirectTimer())

// Core functions
async function handleQueryParams() {
  vue.watch(() => fictionRouter.query.value, async () => {
    const { email, code } = fictionRouter.query.value as { email?: string, code?: string }
    if (email)
      form.email = email
    if (code)
      form.oneTimeCode = code
    if (orgHandle.value && !state.orgData)
      await loadOrgData(orgHandle.value)
  }, { immediate: true })
}

async function loadOrgData(handle: string) {
  state.isLoadingOrg = true
  try {
    const response = await fictionUser.requests.ManageOrganization.request({
      _action: 'read',
      where: { handle },
    }, { disableNotify: true })
    if (response.status === 'success' && response.data) {
      state.orgData = response.data as OrgData
    }
  }
  catch (error) {
    console.error('Failed to load organization data:', error)
  }
  finally {
    state.isLoadingOrg = false
  }
}

async function navigateTo(nextState: AuthStateKey) {
  await fictionRouter.replace({
    path: props.card.link(`/auth/${toKebab(nextState)}`),
    query: fictionRouter.query.value,
  }, { caller: 'authCard' })
}

function startRedirectCountdown(seconds = 2) {
  state.redirectCountdown = seconds
  clearRedirectTimer()
  state.redirectTimer = window.setInterval(() => {
    if (--state.redirectCountdown <= 0) {
      clearRedirectTimer()
      redirectToDashboard()
    }
  }, 1000)
}

function clearRedirectTimer() {
  if (state.redirectTimer) {
    window.clearInterval(state.redirectTimer)
    state.redirectTimer = null
  }
}

async function redirectToDashboard(args?: { isNewUser?: boolean }) {
  const query: Record<string, string> = {}
  if (state.userToken)
    query._token = encodeURIComponent(state.userToken)
  if (args?.isNewUser)
    query._isNewUser = '1'

  let path = '/'
  if (redirectUrl.value)
    path = redirectUrl.value
  else if (state.orgData?.primaryDomain)
    path = `https://${state.orgData.primaryDomain}`

  await props.card.goto({ path, query }, { caller: 'authCard-redirect' })
}

async function handleFormSubmit() {
  if (state.sending)
    return
  state.formError = ''
  state.sending = true
  try {
    await currentState.value.callback({ caller: 'formSubmit' })
  }
  catch (error) {
    state.formError = error instanceof Error ? error.message : 'An unexpected error occurred'
  }
  finally {
    state.sending = false
  }
}

async function verifyCode(callback: (response: EndpointResponse<User> & { isNew?: boolean }) => Promise<void> = async () => {}) {
  if (form.oneTimeCode.length !== 6)
    throw new Error('Enter the 6-digit code from your email')
  const response = await fictionUser.requests.ManageUser.request({
    _action: 'loginWithCode',
    where: { email: form.email },
    code: form.oneTimeCode,
    keepCode: ['resetPasswordSent', 'emailLinkSent', 'verifyEmail'].includes(authState.value),
  })
  if (response.status !== 'success') {
    form.oneTimeCode = ''
    throw new Error(response.message || 'Invalid code')
  }
  state.userToken = response.token || ''
  await callback(response)
}

async function setNewPassword() {
  if (form.password !== form.passwordConfirm)
    throw new Error('Passwords do not match')
  if (form.password.length < 8)
    throw new Error('Password must be at least 8 characters')
  const response = await fictionUser.requests.ManageUser.request({
    _action: 'loginWithCode',
    where: { email: form.email },
    code: form.oneTimeCode,
    newPassword: form.password,
    keepCode: false,
  })
  if (response.status !== 'success')
    throw new Error(response.message || 'Could not update password')
  if (response.token)
    state.userToken = response.token
  await navigateTo('passwordUpdated')
}

async function sendOneTimeCode(next: AuthStateKey, args: { caller?: string } = {}) {
  const { email } = form
  if (!email)
    throw new Error('Please enter your email address')
  if (!isValidEmail(email))
    throw new Error('Please enter a valid email address')

  const response = await fictionUser.requests.ManageUserEmail.request({
    _action: 'oneTimeCode',
    email,
    createUserFields: { ...form, needsOnboarding: true },
    queryVars: emailQueryVars.value || {},
    caller: 'authCard-sendOneTimeCode',
  })
  if (response?.status !== 'success')
    throw new Error(response?.message || 'Could not send login link')
  await navigateTo(next)
}

async function passwordLogin() {
  if (!form.email || !form.password)
    throw new Error('Please enter both email and password')
  if (!isValidEmail(form.email))
    throw new Error('Please enter a valid email address')
  const response = await fictionUser.requests.ManageUser.request({
    _action: 'login',
    where: { email: form.email },
    password: form.password,
    createOnEmpty: true,
    createUserFields: { fullName: form.fullName, needsOnboarding: true },
  })
  if (response?.status !== 'success')
    throw new Error(response?.message || 'Login failed')
  await navigateTo(response.user?.emailVerified ? 'verifySuccess' : 'verifyEmail')
}
</script>

<template>
  <TransactionView :card>
    <TransactionWrap v-bind="{ logo: card.userConfig.value.logo, ...currentState }">
      <ElForm
        class="space-y-5"
        :data-step="authState"
        :notify="state.formError"
        data-test-id="form"
        @submit="handleFormSubmit()"
      >
        <EffectTransitionList>
          <div v-if="state.isLoadingOrg" class="flex justify-center p-4">
            <div class="animate-pulse text-center text-theme-500 dark:text-theme-400">
              Loading organization...
            </div>
          </div>
          <template v-else-if="isSuccessState">
            <div class="text-center space-y-4">
              <p class="text-theme-500 dark:text-theme-400 text-sm my-6">
                Redirecting in {{ state.redirectCountdown }} seconds...
              </p>
              <XButton
                theme="primary"
                design="solid"
                size="lg"
                icon-after="i-tabler-arrow-up-right"
                data-test-id="continue-button"
                @click.prevent="redirectToDashboard()"
              >
                Complete
              </XButton>
            </div>
          </template>
          <template v-else-if="isCodeConfirmState">
            <ElInput
              v-model="form.oneTimeCode"
              label="Verification code"
              input="InputOneTimeCode"
              :input-props="{ required: true, placeholder: '6-digit code' }"
              ui-size="lg"
              data-test-id="input-one-time-code"
            />
            <XButton
              type="submit"
              format="block"
              theme="primary"
              design="solid"
              size="lg"
              :loading="state.sending"
              icon="i-tabler-check"
              data-test-id="submit-button"
            >
              Verify Code
            </XButton>
            <div class="text-theme-500 dark:text-theme-400 text-xs text-center">
              <p>Didn't receive the code?</p>
              <XButton
                size="xs"
                design="link"
                theme="default"
                data-test-id="to-welcome-try-again"
                @click.prevent="navigateTo('welcome')"
              >
                Try again
              </XButton>
            </div>
          </template>
          <template v-else>
            <ElInput
              v-if="currentState.showEmailInput"
              v-model="form.email"
              label="Email"
              input="InputEmail"
              :input-props="{ autocomplete: 'email', required: true, placeholder: 'Enter your email' }"
              ui-size="lg"
              data-test-id="input-email"
            />
            <ElInput
              v-if="authState === 'loginPassword'"
              v-model="form.password"
              input="InputPassword"
              label="Password"
              :input-props="{ autocomplete: 'current-password', required: true, placeholder: 'Your password' }"
              ui-size="lg"
              data-test-id="input-password"
            />
            <template v-if="authState === 'setNewPassword'">
              <ElInput
                v-model="form.password"
                input="InputPassword"
                label="New password"
                description="Use 8+ characters with a number and special character"
                :input-props="{ autocomplete: 'new-password', required: true, placeholder: 'Create a password' }"
                ui-size="lg"
                data-test-id="input-new-password"
              />
              <ElInput
                v-model="form.passwordConfirm"
                input="InputPassword"
                label="Confirm password"
                :input-props="{ autocomplete: 'new-password', required: true, placeholder: 'Confirm password' }"
                ui-size="lg"
                data-test-id="input-new-password-confirm"
              />
            </template>
            <XButton
              type="submit"
              format="block"
              theme="primary"
              design="solid"
              size="lg"
              :loading="state.sending"
              :icon="authState === 'setNewPassword' ? 'i-tabler-key' : undefined"
              :icon-after="authState === 'welcome' ? 'i-tabler-arrow-right' : undefined"
              data-test-id="submit-button"
            >
              {{ authState === 'setNewPassword' ? 'Set Password' : authState === 'resetPassword' ? 'Reset Password' : 'Continue' }}
            </XButton>
            <div class="text-theme-500 dark:text-theme-400 text-sm text-center space-y-4">
              <div class="flex gap-4 justify-center flex-wrap">
                <XButton
                  v-if="['loginPassword', 'verifyEmail', 'emailLinkSent', 'resetPasswordSent', 'resetPassword'].includes(authState)"
                  size="sm"
                  design="link"
                  theme="default"
                  data-test-id="to-welcome"
                  @click.prevent="navigateTo(authState === 'resetPassword' ? 'loginPassword' : 'welcome')"
                >
                  {{ isCodeConfirmState ? 'Start Again' : 'Login with Email' }}
                </XButton>
                <XButton
                  v-if="authState === 'loginPassword'"
                  size="sm"
                  design="link"
                  theme="default"
                  data-test-id="to-reset-password"
                  @click.prevent="navigateTo('resetPassword')"
                >
                  Forgot password
                </XButton>
                <XButton
                  v-else-if="['welcome', 'resetPassword'].includes(authState)"
                  size="sm"
                  design="link"
                  theme="default"
                  data-test-id="to-login-password"
                  @click.prevent="navigateTo('loginPassword')"
                >
                  Login with Password
                </XButton>
              </div>
              <div v-if="currentState.showTerms" class="text-xs px-4 text-pretty">
                By continuing, you agree to the
                <a class="underline hover:text-theme-600 dark:hover:text-theme-300" :href="termsUrl" target="_blank">Terms</a>
                and
                <a class="underline hover:text-theme-600 dark:hover:text-theme-300" :href="privacyUrl" target="_blank">Privacy Policy</a>
              </div>
            </div>
          </template>
        </EffectTransitionList>
      </ElForm>
    </TransactionWrap>
  </TransactionView>
</template>
