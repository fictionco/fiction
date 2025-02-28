<script lang="ts" setup>
import type { MediaObject, User } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import type { FictionAdmin } from '..'
import TransactionView from '@fiction/cards/page-transaction/TransactionView.vue'
import TransactionWrap from '@fiction/cards/page-transaction/TransactionWrap.vue'
import { log, unhead, useService, vue } from '@fiction/core'
import { googleAuth } from '@fiction/core/plugin-user/google'
import XButton from '@fiction/ui/buttons/XButton.vue'
import EffectTransitionList from '@fiction/ui/effect/EffectTransitionList.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const logger = log.contextLogger('AuthCard')

export type UserConfig = { logo?: MediaObject, termsUrl?: string, privacyUrl?: string }

const uc = vue.computed(() => props.card.userConfig.value)

const { fictionRouter, fictionAdmin, fictionEnv, fictionUser } = useService<{ fictionAdmin: FictionAdmin }>()

const authItems = [
  'welcome',
  'register',
  'verify-email',
  'verify-success',
  'magic-link-sent',
  'request-magic-link',
  'reset-password',
  'reset-password-sent',
  'set-new-password',
  'password-updated',
] as const

type AuthItemId = typeof authItems[number]

const itemId = vue.computed<AuthItemId>(() => {
  const val = (fictionRouter.params.value.itemId as AuthItemId) || 'welcome'
  return authItems.includes(val) ? val : 'welcome'
})

type TransactionProps = InstanceType<typeof TransactionWrap>['$props']

const transactionConfig = vue.computed<TransactionProps | undefined>(() => {
  const mapping: Record<AuthItemId, TransactionProps> = {
    'register': {
      title: 'Create your account',
      subTitle: 'Get started in seconds',
      icon: 'i-tabler-user-plus',
    },
    'welcome': {
      title: 'Welcome back',
      subTitle: 'Sign in to continue',
      icon: 'i-tabler-user-share',
    },
    'verify-email': {
      title: 'Verify your email',
      subTitle: 'Enter the code we sent to your inbox',
      icon: 'i-tabler-mail-check',
    },
    'verify-success': {
      title: 'Email verified!',
      subTitle: 'Your account is now active',
      icon: 'i-tabler-check-circle',
      status: 'success',
    },
    'magic-link-sent': {
      title: 'Check your inbox',
      subTitle: 'We sent a sign-in link to your email',
      icon: 'i-tabler-mail',
      status: 'success',
    },
    'request-magic-link': {
      title: 'Email sign-in',
      subTitle: 'We\'ll send you a secure link',
      icon: 'i-tabler-sparkles',
    },
    'reset-password': {
      title: 'Reset password',
      subTitle: 'Enter your email to continue',
      icon: 'i-tabler-lock-open',
    },
    'reset-password-sent': {
      title: 'Check your inbox',
      subTitle: 'We sent password reset instructions',
      icon: 'i-tabler-mail',
      status: 'success',
    },
    'set-new-password': {
      title: 'Create new password',
      subTitle: 'Choose a secure password for your account',
      icon: 'i-tabler-key',
    },
    'password-updated': {
      title: 'Password updated!',
      subTitle: 'Your new password has been set',
      icon: 'i-tabler-check-circle',
      status: 'success',
    },
  }

  return mapping[itemId.value] || mapping.welcome
})

const fields = vue.ref({
  email: '',
  fullName: '',
  orgName: '',
  password: '',
  passwordConfirm: '',
  oneTimeCode: '',
})

const redirectTimer = vue.ref<number | null>(null)
const redirectCountdown = vue.ref(0)

vue.onMounted(() => {
  vue.watch(() => fictionRouter.query.value, () => {
    const { email, code } = fictionRouter.query.value as { email?: string, code?: string }

    if (email)
      fields.value.email = email
    if (code)
      fields.value.oneTimeCode = code
  }, { immediate: true })
})

vue.onBeforeUnmount(() => {
  if (redirectTimer.value) {
    window.clearInterval(redirectTimer.value)
  }
})

const sending = vue.ref<'google' | 'button' | ''>('')
const formError = vue.ref('')
const showOneTimeCode = vue.ref(false)

async function updateAuthStep(id: AuthItemId) {
  await fictionRouter.push({
    path: props.card.link(`/auth/${id}`),
    query: fictionRouter.query.value,
  }, { caller: 'authCard' })
}

const title = () => `${itemId.value === 'welcome' ? 'Sign in' : 'Create account'} - ${fictionEnv.meta.app?.name}`
unhead.useHead({ title, meta: [{ name: `description`, content: title }] })

function startRedirectCountdown(seconds = 5) {
  redirectCountdown.value = seconds

  if (redirectTimer.value) {
    window.clearInterval(redirectTimer.value)
  }

  redirectTimer.value = window.setInterval(() => {
    redirectCountdown.value--

    if (redirectCountdown.value <= 0) {
      window.clearInterval(redirectTimer.value as number)
      redirectTimer.value = null
      redirectToDashboard()
    }
  }, 1000)
}

async function redirectToDashboard() {
  await props.card.goto(
    { path: '/', query: {} },
    { caller: 'authCard-redirect' },
  )
}

async function handleFormSubmit() {
  formError.value = ''

  const handlers: Record<AuthItemId, () => Promise<void>> = {
    'welcome': passwordLogin,
    'register': passwordLogin,
    'request-magic-link': sendMagicLink,
    'reset-password': sendPasswordResetEmail,
    'set-new-password': setNewPassword,
    'verify-email': verifyWithCode,
    'magic-link-sent': loginWithCode,
    'verify-success': redirectToDashboard,
    'password-updated': redirectToDashboard,
    'reset-password-sent': () => Promise.resolve(),
  }

  const handler = handlers[itemId.value]
  if (handler) {
    await handler()
  }
  else {
    throw new Error(`No form handler for ${itemId.value}`)
  }
}

async function verifyWithCode() {
  sending.value = 'button'

  const { email, oneTimeCode } = fields.value

  if (!oneTimeCode || oneTimeCode.length !== 6) {
    formError.value = 'Please enter the 6-digit code from your email'
    sending.value = ''
    return
  }

  const r = await fictionUser.requests.ManageUser.request({
    _action: 'verifyEmail',
    email,
    code: oneTimeCode,
  })

  if (r.status === 'success') {
    updateAuthStep('verify-success')
    startRedirectCountdown()
  }
  else {
    formError.value = r.message || 'Invalid verification code. Please try again.'
  }

  sending.value = ''
}

async function loginWithCode() {
  sending.value = 'button'

  const { email, oneTimeCode } = fields.value

  if (oneTimeCode.length !== 6) {
    formError.value = 'Please enter the 6-digit code from your email'
    sending.value = ''
    return
  }

  const r = await fictionUser.requests.ManageUser.request({
    _action: 'loginWithCode',
    where: { email },
    code: oneTimeCode,
  })

  if (r.status === 'success') {
    await redirectToDashboard()
  }
  else {
    formError.value = r.message || 'Invalid code. Please try again.'
  }

  sending.value = ''
}

async function setNewPassword() {
  sending.value = 'button'

  const { email, password, passwordConfirm, oneTimeCode } = fields.value

  if (password !== passwordConfirm) {
    formError.value = 'Passwords do not match'
    sending.value = ''
    return
  }

  if (password.length < 8) {
    formError.value = 'Password must be at least 8 characters'
    sending.value = ''
    return
  }

  const r = await fictionUser.requests.ManageUser.request({
    _action: 'loginWithCode',
    where: { email },
    code: oneTimeCode,
    newPassword: password,
  })

  if (r.status === 'success') {
    updateAuthStep('password-updated')
    startRedirectCountdown()
  }
  else {
    formError.value = r.message || 'Could not update password. Please try again.'
  }

  sending.value = ''
}

async function sendPasswordResetEmail() {
  sending.value = 'button'
  formError.value = ''

  const { email } = fields.value

  if (!email) {
    formError.value = 'Please enter your email address'
    sending.value = ''
    return
  }

  const r = await fictionAdmin.emailActions.passwordReset.requestSend({
    to: email,
    queryVars: {},
  })

  if (r?.status === 'error') {
    formError.value = r.message || 'Could not send reset email. Please try again.'
  }
  else if (r?.status === 'success') {
    updateAuthStep('reset-password-sent')
  }

  sending.value = ''
}

async function sendMagicLink(): Promise<void> {
  sending.value = 'button'
  formError.value = ''

  const { email } = fields.value

  if (!email) {
    formError.value = 'Please enter your email address'
    sending.value = ''
    return
  }

  const createUserFields: Partial<User> = {
    ...fields.value,
    email,
    needsOnboarding: true,
  }

  const r = await fictionAdmin.emailActions.magicLoginEmailAction.requestSend({
    to: email,
    createUserFields,
    baseRoute: '/app',
    queryVars: {},
  })

  if (r?.status === 'error') {
    formError.value = r.message || 'Could not send login link. Please try again.'
  }
  else if (r?.status === 'success') {
    updateAuthStep('magic-link-sent')
  }

  sending.value = ''
}

async function passwordLogin() {
  sending.value = 'button'
  formError.value = ''

  const { email, password } = fields.value

  if (!email || !password) {
    formError.value = 'Please enter both email and password'
    sending.value = ''
    return
  }

  const isRegister = itemId.value === 'register'

  const r = await fictionUser.requests.ManageUser.request({
    _action: 'login',
    where: { email },
    password,
    createOnEmpty: isRegister,
    createUserFields: {
      fullName: fields.value.fullName,
      needsOnboarding: true,
    },
  })

  if (r?.status === 'error') {
    formError.value = r.message || 'Login failed. Please check your credentials.'
  }
  else if (r?.status === 'success') {
    if (!r.user?.emailVerified) {
      // Need to verify email
      await sendVerificationEmail(email)
      updateAuthStep('verify-email')
    }
    else {
      // Already verified, go to dashboard
      const query: Record<string, string> = {}
      if (r.isNew) {
        query._isNewUser = '1'
      }
      await props.card.goto({ path: '/', query }, { caller: 'authCard-passwordLogin' })
    }
  }

  sending.value = ''
}

async function sendVerificationEmail(email: string) {
  await fictionAdmin.emailActions.verifyEmailAction.requestSend({
    to: email,
    queryVars: {},
  })
}

const quotes = [
  { text: 'Every journey begins with a single step.', author: 'Lao Tzu' },
  { text: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' },
  { text: 'Make it simple, but significant.', author: 'Don Draper' },
  { text: 'The key to growth is the introduction of higher dimensions of consciousness.', author: 'Lao Tzu' },
]

const quote = vue.computed(() => quotes[Math.floor(Math.random() * quotes.length)])

async function runGoogleLogin() {
  sending.value = 'google'
  googleAuth({
    fictionUser,
    createUserFields: { needsOnboarding: true },
    createOnEmpty: true,
    onComplete: async (response) => {
      if (response.status === 'success') {
        if (!response.user?.emailVerified) {
          await sendVerificationEmail(response.user?.email || '')
          updateAuthStep('verify-email')
        }
        else {
          const query: Record<string, string> = {}
          if (response.isNew) {
            query._isNewUser = '1'
          }
          await props.card.goto({ path: '/', query }, { caller: 'authCard-googleLogin' })
        }
      }
      else {
        formError.value = response.message || 'Google authentication failed'
      }
    },
    onFinally: () => {
      sending.value = ''
    },
  })
}

vue.watch(() => itemId.value, () => {
  formError.value = ''
})
</script>

<template>
  <TransactionView :card :quote>
    <TransactionWrap v-bind="transactionConfig">
      <ElForm
        class="space-y-5"
        data-test-id="auth-form"
        :data-value="JSON.stringify(fields)"
        :notify="formError"
        @submit="handleFormSubmit()"
      >
        <EffectTransitionList>
          <!-- Success states with redirect -->
          <div
            v-if="['verify-success', 'password-updated'].includes(itemId)"
            class="text-center space-y-4"
          >
            <div class="text-2xl text-theme-700 dark:text-theme-300 mb-4">
              <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 mb-2">
                <span class="i-tabler-check text-3xl" />
              </div>
            </div>

            <p class="text-theme-700 dark:text-theme-100 text-lg">
              {{ itemId === 'verify-success' ? 'Your email has been verified!' : 'Your password has been updated!' }}
            </p>

            <p class="text-theme-500 dark:text-theme-400 text-sm">
              Redirecting to dashboard in {{ redirectCountdown }} seconds...
            </p>

            <XButton
              format="block"
              theme="primary"
              design="solid"
              data-test-id="continue-button"
              @click.prevent="redirectToDashboard()"
            >
              Continue to dashboard
            </XButton>
          </div>

          <!-- Sent confirmation states -->
          <div
            v-else-if="['magic-link-sent', 'reset-password-sent'].includes(itemId)"
            class="text-center space-y-4"
          >
            <XButton
              size="sm"
              design="outline"
              theme="default"
              icon="i-tabler-arrow-left"
              data-test-id="back-to-login"
              @click.prevent="updateAuthStep('welcome')"
            >
              Back to sign in
            </XButton>
          </div>

          <!-- Email verification screen -->
          <template v-else-if="itemId === 'verify-email'">
            <div class="text-center mb-4">
              <p class="text-theme-700 dark:text-theme-100">
                We've sent a verification code to your email
              </p>
            </div>

            <ElInput
              data-test-id="input-verification-code"
              class="w-full"
              label="Verification code"
              input="InputOneTimeCode"
              :input-props="{ required: true, placeholder: '6-digit code' }"
              :model-value="fields.oneTimeCode"
              ui-size="lg"
              @update:model-value="fields.oneTimeCode = $event"
            />

            <XButton
              type="submit"
              format="block"
              theme="primary"
              design="solid"
              size="lg"
              :loading="sending === 'button'"
              data-test-id="verify-email-button"
              icon="i-tabler-check"
            >
              Verify email
            </XButton>

            <div class="text-theme-500 dark:text-theme-400 text-sm text-center">
              <p>Didn't receive the code?</p>
              <XButton
                size="xs"
                design="link"
                theme="default"
                @click.prevent="sendVerificationEmail(fields.email)"
              >
                Send again
              </XButton>
            </div>
          </template>

          <!-- Main auth forms -->
          <template v-else>
            <!-- Google login for welcome and register screens -->
            <XButton
              v-if="['welcome', 'register'].includes(itemId)"
              :key="`googleLogin-${itemId}`"
              data-test-id="google-login-button"
              type="button"
              format="block"
              theme="primary"
              design="outline"
              size="lg"
              :loading="sending === 'google'"
              icon="i-tabler-brand-google-filled"
              @click.prevent="runGoogleLogin()"
            >
              {{ itemId === 'register' ? 'Sign up' : 'Sign in' }} with Google
            </XButton>

            <div v-if="['welcome', 'register'].includes(itemId)" class="text-center text-theme-500 flex items-center justify-center gap-4">
              <div class="border-b border-theme-200 dark:border-theme-700/60 grow" />
              <span>or</span>
              <div class="border-b border-theme-200 dark:border-theme-700/60 grow" />
            </div>

            <!-- Email input for most forms -->
            <ElInput
              v-if="['welcome', 'register', 'request-magic-link', 'reset-password'].includes(itemId)"
              :key="`inputEmail-${itemId}`"
              data-test-id="input-email"
              class="w-full"
              label="Email"
              input="InputEmail"
              :input-props="{ autocomplete: 'email', required: true, placeholder: 'Your email address' }"
              :model-value="fields.email"
              ui-size="lg"
              @update:model-value="fields.email = $event"
            />

            <!-- Name input for register -->
            <ElInput
              v-if="itemId === 'register'"
              key="inputFullName"
              data-test-id="input-full-name"
              input="InputText"
              label="Full name"
              class="w-full"
              :input-props="{ autocomplete: 'name', required: false, placeholder: 'Your name' }"
              ui-size="lg"
              :model-value="fields.fullName"
              @update:model-value="fields.fullName = $event"
            />

            <!-- Password input for login and register -->
            <ElInput
              v-if="itemId === 'welcome'"
              key="inputCurrentPassword"
              data-test-id="input-current-password"
              input="InputPassword"
              label="Password"
              class="w-full"
              :input-props="{ autocomplete: 'current-password', required: true, placeholder: 'Your password' }"
              ui-size="lg"
              :model-value="fields.password"
              @update:model-value="fields.password = $event"
            />

            <ElInput
              v-else-if="itemId === 'register'"
              key="inputNewPassword"
              data-test-id="input-new-password"
              input="InputPassword"
              label="Password"
              class="w-full"
              :input-props="{ autocomplete: 'new-password', required: true, placeholder: 'Create a password (8+ characters)' }"
              ui-size="lg"
              :model-value="fields.password"
              @update:model-value="fields.password = $event"
            />

            <!-- New password fields for reset -->
            <ElInput
              v-if="itemId === 'set-new-password'"
              key="set-new-password"
              v-model="fields.password"
              data-test-id="input-new-password"
              input="InputPassword"
              label="New password"
              class="w-full"
              :input-props="{ autocomplete: 'new-password', required: true, placeholder: 'Create a password (8+ characters)' }"
              ui-size="lg"
            />

            <ElInput
              v-if="itemId === 'set-new-password'"
              key="set-new-password-confirm"
              v-model="fields.passwordConfirm"
              data-test-id="input-new-password-confirm"
              input="InputPassword"
              label="Confirm password"
              class="w-full"
              :input-props="{ autocomplete: 'new-password', required: true, placeholder: 'Enter same password again' }"
              ui-size="lg"
            />

            <!-- Action buttons -->
            <XButton
              v-if="itemId === 'set-new-password'"
              data-test-id="update-password-button"
              type="submit"
              format="block"
              theme="primary"
              design="solid"
              size="lg"
              :loading="sending === 'button'"
              icon="i-tabler-key"
            >
              Update password
            </XButton>

            <XButton
              v-else-if="itemId === 'welcome'"
              data-test-id="login-button"
              type="submit"
              format="block"
              theme="primary"
              design="solid"
              size="lg"
              :loading="sending === 'button'"
              icon="i-tabler-login"
            >
              Sign in
            </XButton>

            <XButton
              v-if="itemId === 'register'"
              data-test-id="register-button"
              type="submit"
              format="block"
              theme="primary"
              design="solid"
              size="lg"
              :loading="sending === 'button'"
              icon="i-tabler-user-plus"
            >
              Create account
            </XButton>

            <XButton
              v-if="['request-magic-link', 'reset-password'].includes(itemId)"
              :key="`submit-send-email-${itemId}`"
              data-test-id="submit-button-send-email"
              type="submit"
              format="block"
              theme="primary"
              design="solid"
              size="lg"
              :loading="sending === 'button'"
              :icon="itemId === 'request-magic-link' ? 'i-tabler-mail' : 'i-tabler-key'"
            >
              {{ itemId === 'request-magic-link' ? 'Send sign-in link' : 'Reset password' }}
            </XButton>

            <!-- Links for navigation between auth screens -->
            <div class="text-theme-500 dark:text-theme-400 text-sm font-sans text-center space-y-6">
              <div class="flex gap-4 justify-center flex-wrap items-center">
                <XButton
                  v-if="itemId === 'welcome'"
                  size="sm"
                  design="link"
                  theme="default"
                  icon="i-tabler-user-plus"
                  data-test-id="to-register"
                  @click.prevent="updateAuthStep('register')"
                >
                  Create account
                </XButton>

                <XButton
                  v-if="['register', 'request-magic-link', 'reset-password'].includes(itemId)"
                  size="sm"
                  design="link"
                  theme="default"
                  icon="i-tabler-arrow-left"
                  data-test-id="to-welcome"
                  @click.prevent="updateAuthStep('welcome')"
                >
                  Back to sign in
                </XButton>

                <XButton
                  v-if="['welcome', 'register'].includes(itemId)"
                  size="sm"
                  design="link"
                  theme="default"
                  icon="i-tabler-key"
                  data-test-id="to-reset-password"
                  @click.prevent="updateAuthStep('reset-password')"
                >
                  Forgot password
                </XButton>

                <XButton
                  v-if="['welcome', 'register'].includes(itemId)"
                  size="sm"
                  design="link"
                  theme="default"
                  icon="i-tabler-mail"
                  data-test-id="to-magic-link"
                  @click.prevent="updateAuthStep('request-magic-link')"
                >
                  Sign in with email
                </XButton>
              </div>

              <div v-if="['welcome', 'register'].includes(itemId)" class="leading-normal text-xs px-4">
                By continuing, you agree to the
                <a class="underline hover:text-theme-600 dark:hover:text-theme-300" :href="uc.termsUrl" target="_blank">Terms of Service</a>
                and
                <a class="underline hover:text-theme-600 dark:hover:text-theme-300" :href="uc.privacyUrl" target="_blank">Privacy Policy</a>
              </div>
            </div>
          </template>
        </EffectTransitionList>
      </ElForm>
    </TransactionWrap>
  </TransactionView>
</template>
