<script lang="ts" setup>
import type { MediaObject, User } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import type { FictionAdmin } from '..'
import TransactionView from '@fiction/cards/page/transaction/TransactionView.vue'
import TransactionWrap from '@fiction/cards/page/transaction/TransactionWrap.vue'
import { isValidEmail, unhead, useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import EffectTransitionList from '@fiction/ui/effect/EffectTransitionList.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'

// Types and interfaces
export type UserConfig = { logo?: MediaObject, termsUrl?: string, privacyUrl?: string }
export type OrgData = { orgId: string, orgName: string, primaryDomain?: string }

// Define props
const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

// Core services
const { fictionRouter, fictionAdmin, fictionEnv, fictionUser } = useService<{ fictionAdmin: FictionAdmin }>()

// User configuration
const userConfig = vue.computed(() => props.card.userConfig.value)
const termsUrl = vue.computed(() => userConfig.value.termsUrl || fictionEnv.meta.app?.termsUrl)
const privacyUrl = vue.computed(() => userConfig.value.privacyUrl || fictionEnv.meta.app?.privacyUrl)

// Organization data state
const orgData = vue.ref<OrgData | null>(null)
const orgHandle = vue.computed(() => fictionRouter.query.value.for as string | undefined)
const redirectUrl = vue.computed(() => fictionRouter.query.value.redirect as string | undefined)
const emailQueryVars = vue.computed(() => {
  const out: Record<string, string> = {}

  if (orgHandle.value)
    out.for = orgHandle.value
  if (redirectUrl.value)
    out.redirect = redirectUrl.value

  return {}
})
const isLoadingOrg = vue.ref(false)

// Auth flow states
type AuthState =
  | 'welcome' // Initial email entry screen
  | 'verify-email' // Enter verification code
  | 'verify-success' // Successfully verified
  | 'email-link-sent' // Magic link sent
  | 'login-password' // Password login
  | 'reset-password' // Request password reset
  | 'reset-password-sent' // Password reset sent
  | 'set-new-password' // Set a new password
  | 'password-updated' // Password updated successfully

// Form state
const fields = vue.ref({
  email: '',
  fullName: '',
  orgName: '',
  password: '',
  passwordConfirm: '',
  oneTimeCode: '',
})

// UI state
const sending = vue.ref(false)
const formError = vue.ref('')
const redirectCountdown = vue.ref(0)
const redirectTimer = vue.ref<number | null>(null)

// Auth flow configuration
const authState = vue.computed<AuthState>(() => {
  const val = (fictionRouter.params.value.itemId as AuthState) || 'welcome'
  return isValidAuthState(val) ? val : 'welcome'
})

// Random inspiring quotes
const quotes = [
  { text: 'Yesterday you said tomorrow.', author: 'Nike' },
  { text: 'Become who you are.', author: 'Nietzsche' },
  { text: 'Take massive action now!', author: 'Tony Robbins' },
  { text: 'Change your story, change your life.', author: 'Lori Gottlieb' },
  { text: 'It all begins with your story...', author: 'Andrew Powers' },
  { text: 'Be as you wish to seem.', author: 'Socrates' },
]
const quote = vue.computed(() => quotes[Math.floor(Math.random() * quotes.length)])
type TransactionProps = InstanceType<typeof TransactionWrap>['$props']

// Screen configuration based on current auth state
const screenConfig = vue.computed(() => {
  const configs: Record<AuthState, TransactionProps> = {
    'welcome': {
      title: `Sign in to ${orgData.value?.orgName || 'Fiction'}`,
      subTitle: `Enter your email to continue`,
      icon: 'i-tabler-user-share',
    },
    'verify-email': {
      title: `Confirm Code`,
      subTitle: 'Enter the code we sent to your inbox',
      icon: 'i-tabler-mail-check',
    },
    'verify-success': {
      title: `Success!`,
      subTitle: 'You are now logged in',
      icon: 'i-tabler-user-check',
      status: 'success',
    },
    'email-link-sent': {
      title: `Check your inbox`,
      subTitle: 'We sent a sign-in link to your email',
      icon: 'i-tabler-mail',
      status: 'success',
    },
    'reset-password': {
      title: `Reset password`,
      subTitle: 'Enter your email to continue',
      icon: 'i-tabler-lock-open',
    },
    'login-password': {
      title: `Login with Password`,
      subTitle: 'Enter your password to continue',
      icon: 'i-tabler-key',
    },
    'reset-password-sent': {
      title: `Check your inbox`,
      subTitle: 'We sent password reset instructions',
      icon: 'i-tabler-mail',
      status: 'success',
    },
    'set-new-password': {
      title: `Create your password`,
      subTitle: 'Use 8+ characters with a number and special character',
      icon: 'i-tabler-key',
    },
    'password-updated': {
      title: `Password updated!`,
      subTitle: 'Your new password has been set',
      icon: 'i-tabler-check-circle',
      status: 'success',
    },
  }

  return configs[authState.value] || configs.welcome
})

// Page title
const pageTitle = vue.computed(() => {
  const orgPrefix = orgData.value ? `${orgData.value.orgName} - ` : ''
  const authText = authState.value === 'welcome' ? 'Sign in' : 'Create account'
  return `${orgPrefix}${authText} - ${fictionEnv.meta.app?.name}`
})

// Utility functions - can be extracted to a separate file
function isValidAuthState(state: string): state is AuthState {
  return [
    'welcome',
    'verify-email',
    'verify-success',
    'email-link-sent',
    'login-password',
    'reset-password',
    'reset-password-sent',
    'set-new-password',
    'password-updated',
  ].includes(state)
}

function getRedirectDestination(args: {
  redirectUrl?: string
  orgData?: OrgData | null
  isNewUser?: boolean
}): { path: string, query: Record<string, string> } {
  const { redirectUrl, orgData, isNewUser } = args

  // If redirect URL is provided, use it
  if (redirectUrl) {
    return { path: redirectUrl, query: {} }
  }

  // If org data is available and has primaryDomain, redirect to org site
  if (orgData?.primaryDomain) {
    return {
      path: `https://${orgData.primaryDomain}`,
      query: isNewUser ? { _isNewUser: '1' } : {},
    }
  }

  // Default: redirect to dashboard
  return {
    path: '/',
    query: isNewUser ? { _isNewUser: '1' } : {},
  }
}

// Lifecycle hooks
vue.onMounted(async () => {
  // Set page title
  unhead.useHead({
    title: () => pageTitle.value,
    meta: [{ name: 'description', content: pageTitle.value }],
  })

  // Watch for query parameters
  vue.watch(() => fictionRouter.query.value, async () => {
    const { email, code } = fictionRouter.query.value as { email?: string, code?: string }

    if (email)
      fields.value.email = email
    if (code)
      fields.value.oneTimeCode = code

    // Load org data if handle is provided
    if (orgHandle.value && !orgData.value) {
      await loadOrgData(orgHandle.value)
    }
  }, { immediate: true })
})

vue.onBeforeUnmount(() => {
  clearRedirectTimer()
})

vue.watch(() => authState.value, () => {
  formError.value = ''
})

// Organization data loading
async function loadOrgData(handle: string): Promise<void> {
  isLoadingOrg.value = true

  try {
    const response = await fictionUser.requests.ManageOrganization.request({
      _action: 'retrieve',
      where: { handle },
    })

    if (response.status === 'success' && response.data) {
      orgData.value = response.data as OrgData
    }
  }
  catch (error) {
    console.error('Failed to load organization data:', error)
  }
  finally {
    isLoadingOrg.value = false
  }
}

// Auth flow navigation
async function navigateTo(state: AuthState) {
  await fictionRouter.replace({
    path: props.card.link(`/auth/${state}`),
    query: fictionRouter.query.value,
  }, { caller: 'authCard' })
}

// Countdown and redirect
function startRedirectCountdown(seconds = 4) {
  redirectCountdown.value = seconds
  clearRedirectTimer()

  redirectTimer.value = window.setInterval(() => {
    redirectCountdown.value--

    if (redirectCountdown.value <= 0) {
      clearRedirectTimer()
      redirectToDashboard()
    }
  }, 1000)
}

function clearRedirectTimer() {
  if (redirectTimer.value) {
    window.clearInterval(redirectTimer.value)
    redirectTimer.value = null
  }
}

async function redirectToDashboard(args?: { isNewUser?: boolean }) {
  const destination = getRedirectDestination({
    redirectUrl: redirectUrl.value,
    orgData: orgData.value,
    isNewUser: args?.isNewUser,
  })

  await props.card.goto(destination, { caller: 'authCard-redirect' })
}

// Form submission handler
async function handleFormSubmit() {
  if (sending.value)
    return

  formError.value = ''
  sending.value = true

  try {
    const handlers: Record<AuthState, () => Promise<void>> = {
      'welcome': sendMagicLink,
      'login-password': passwordLogin,
      'verify-email': verifyCode,
      'reset-password': sendPasswordResetEmail,
      'set-new-password': setNewPassword,
      'email-link-sent': verifyCode,
      'verify-success': redirectToDashboard,
      'password-updated': redirectToDashboard,
      'reset-password-sent': () => Promise.resolve(),
    }

    const handler = handlers[authState.value]
    if (handler) {
      await handler()
    }
    else {
      throw new Error(`No form handler for ${authState.value}`)
    }
  }
  catch (error) {
    if (error instanceof Error) {
      formError.value = error.message
    }
    else {
      formError.value = 'An unexpected error occurred'
    }
  }
  finally {
    sending.value = false
  }
}

// Auth methods
async function verifyCode() {
  const { email, oneTimeCode } = fields.value

  if (oneTimeCode.length !== 6) {
    throw new Error('Enter the 6-digit code from your email')
  }

  const response = await fictionUser.requests.ManageUser.request({
    _action: 'loginWithCode',
    where: { email },
    code: oneTimeCode,
  })

  if (response.status !== 'success') {
    fields.value.oneTimeCode = ''
    throw new Error(response.message || 'Invalid code. Please try again.')
  }

  if (response.isNew) {
    await navigateTo('set-new-password')
  }
  else {
    await navigateTo('verify-success')
    startRedirectCountdown()
  }
}

async function setNewPassword() {
  const { email, password, passwordConfirm, oneTimeCode } = fields.value

  if (password !== passwordConfirm) {
    throw new Error('Passwords do not match')
  }

  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters')
  }

  const response = await fictionUser.requests.ManageUser.request({
    _action: 'loginWithCode',
    where: { email },
    code: oneTimeCode,
    newPassword: password,
  })

  if (response.status !== 'success') {
    throw new Error(response.message || 'Could not update password. Please try again.')
  }

  await navigateTo('password-updated')
  startRedirectCountdown()
}

async function sendPasswordResetEmail() {
  const { email } = fields.value

  if (!email) {
    throw new Error('Please enter your email address')
  }

  const response = await fictionAdmin.emailActions.passwordReset.requestSend({
    to: email,
    queryVars: emailQueryVars.value,
  })

  if (response?.status !== 'success') {
    throw new Error(response?.message || 'Could not send reset email. Please try again.')
  }

  await navigateTo('reset-password-sent')
}

async function sendMagicLink() {
  const { email } = fields.value

  if (!email) {
    throw new Error('Please enter your email address')
  }

  if (!isValidEmail(email)) {
    throw new Error('Please enter a valid email address')
  }

  const createUserFields: Partial<User> = {
    ...fields.value,
    email,
    needsOnboarding: true,
  }

  const response = await fictionAdmin.emailActions.magicLoginEmailAction.requestSend({
    to: email,
    createUserFields,
    baseRoute: '/app',
    queryVars: emailQueryVars.value,
  })

  if (response?.status !== 'success') {
    throw new Error(response?.message || 'Could not send login link. Please try again.')
  }

  await navigateTo('email-link-sent')
}

async function passwordLogin() {
  const { email, password } = fields.value

  if (!email || !password) {
    throw new Error('Please enter both email and password')
  }

  if (!isValidEmail(email)) {
    throw new Error('Please enter a valid email address')
  }

  const response = await fictionUser.requests.ManageUser.request({
    _action: 'login',
    where: { email },
    password,
    createOnEmpty: true,
    createUserFields: {
      fullName: fields.value.fullName,
      needsOnboarding: true,
    },
  })

  if (response?.status !== 'success') {
    throw new Error(response?.message || 'Login failed. Please check your credentials.')
  }

  if (!response.user?.emailVerified) {
    // Need to verify email
    await sendVerificationEmail({ email })
    await navigateTo('verify-email')
  }
  else {
    // Already verified, redirect
    await redirectToDashboard({ isNewUser: response.isNew })
  }
}

async function sendVerificationEmail(args: { email: string, withNotification?: boolean }) {
  const { email, withNotification } = args

  await fictionAdmin.emailActions.verifyEmailAction.requestSend({
    to: email,
    queryVars: emailQueryVars.value,
  })

  if (withNotification) {
    fictionEnv.events.emit('notify', {
      type: 'success',
      message: 'Verification email sent.',
      more: 'Please check your inbox.',
    })
  }
}

const isCodeConfirmState = vue.computed(() => ['verify-email', 'email-link-sent', 'reset-password-sent'].includes(authState.value))
</script>

<template>
  <TransactionView :card :quote>
    <TransactionWrap v-bind="screenConfig">
      <ElForm
        class="space-y-5"
        data-test-id="form"
        :data-value="JSON.stringify(fields)"
        :notify="formError"
        @submit="handleFormSubmit()"
      >
        <EffectTransitionList>
          <!-- Loading state for org data -->
          <div v-if="isLoadingOrg" class="flex justify-center p-4">
            <div class="animate-pulse text-center">
              <div class="text-theme-500 dark:text-theme-400">
                Loading organization...
              </div>
            </div>
          </div>

          <!-- Success states with redirect -->
          <template v-else-if="['verify-success', 'password-updated'].includes(authState)">
            <div class="text-center space-y-4">
              <p class="text-theme-500 dark:text-theme-400 text-sm text-pretty my-6">
                Redirecting to {{ orgData?.orgName || 'dashboard' }} in {{ redirectCountdown }} seconds...
              </p>

              <XButton
                theme="primary"
                design="solid"
                size="lg"
                icon-after="i-tabler-arrow-up-right"
                data-test-id="continue-button"
                @click.prevent="redirectToDashboard()"
              >
                Continue to {{ orgData?.orgName || 'dashboard' }}
              </XButton>
            </div>
          </template>

          <!-- Verification code entry -->
          <template v-else-if="isCodeConfirmState">
            <ElInput
              v-model="fields.oneTimeCode"
              data-test-id="input-one-time-code"
              class="w-full"
              label="Verification code"
              input="InputOneTimeCode"
              :input-props="{ required: true, placeholder: '6-digit code' }"
              ui-size="lg"
            />

            <XButton
              type="submit"
              format="block"
              theme="primary"
              design="solid"
              size="lg"
              :loading="sending"
              data-test-id="submit-button-verify"
              icon="i-tabler-check"
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

          <!-- Main auth forms -->
          <template v-else>
            <!-- Email input for most forms -->
            <ElInput
              v-if="['welcome', 'login-password', 'reset-password'].includes(authState)"
              v-model="fields.email"
              data-test-id="input-email"
              class="w-full"
              label="Email"
              input="InputEmail"
              :input-props="{ autocomplete: 'email', required: true, placeholder: 'Enter your email' }"
              ui-size="lg"
            />

            <!-- Password input for login -->
            <ElInput
              v-if="authState === 'login-password'"
              v-model="fields.password"
              data-test-id="input-password"
              input="InputPassword"
              label="Password"
              class="w-full"
              :input-props="{ autocomplete: 'current-password', required: true, placeholder: 'Your password' }"
              ui-size="lg"
            />

            <!-- New password fields for reset -->
            <template v-if="authState === 'set-new-password'">
              <ElInput
                v-model="fields.password"
                data-test-id="input-new-password"
                input="InputPassword"
                label="New password"
                class="w-full"
                :input-props="{ autocomplete: 'new-password', required: true, placeholder: 'Create a password' }"
                ui-size="lg"
              />

              <ElInput
                v-model="fields.passwordConfirm"
                data-test-id="input-new-password-confirm"
                input="InputPassword"
                label="Confirm password"
                class="w-full"
                :input-props="{ autocomplete: 'new-password', required: true, placeholder: 'Enter same password again' }"
                ui-size="lg"
              />
            </template>

            <!-- Action buttons -->
            <XButton
              type="submit"
              format="block"
              theme="primary"
              design="solid"
              size="lg"
              :loading="sending"
              :data-test-id="`submit-button-${authState}`"
              :icon="authState === 'set-new-password' ? 'i-tabler-key' : undefined"
              :icon-after="authState === 'welcome' ? 'i-tabler-arrow-right' : undefined"
            >
              <template v-if="authState === 'set-new-password'">
                Set Password
              </template>
              <template v-else-if="authState === 'reset-password'">
                Reset Password
              </template>
              <template v-else>
                Continue
              </template>
            </XButton>

            <!-- Links for navigation between auth screens -->
            <div class="text-theme-500 dark:text-theme-400 text-sm font-sans text-center space-y-6">
              <div class="flex gap-5 justify-center flex-wrap items-center">
                <XButton
                  v-if="['login-password'].includes(authState) || isCodeConfirmState"
                  size="sm"
                  design="link"
                  theme="default"
                  data-test-id="to-welcome"
                  @click.prevent="navigateTo(authState === 'reset-password' ? 'login-password' : 'welcome')"
                >
                  {{ isCodeConfirmState ? 'Start Again' : 'Login with Email' }}
                </XButton>
                <XButton
                  v-if="['login-password'].includes(authState)"
                  size="sm"
                  design="link"
                  theme="default"
                  data-test-id="to-reset-password"
                  @click.prevent="navigateTo('reset-password')"
                >
                  Forgot password
                </XButton>
                <XButton
                  v-else-if="['welcome', 'reset-password'].includes(authState)"
                  size="sm"
                  design="link"
                  theme="default"
                  data-test-id="to-login-password"
                  @click.prevent="navigateTo('login-password')"
                >
                  Login with Password
                </XButton>
              </div>

              <div v-if="['welcome'].includes(authState)" class="leading-normal text-xs px-4 text-pretty">
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
