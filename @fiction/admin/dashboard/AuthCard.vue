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
  'sent-verification',
  'confirm-verification',
  'sent-magic-link',
  'request-magic-link',
  'request-password-reset',
  'sent-password-reset',
  'set-new-password',
] as const

type AuthItemId = typeof authItems[number]

const itemId = vue.computed<AuthItemId>(() => {
  const val = (fictionRouter.params.value.itemId as AuthItemId) || 'welcome'

  return authItems.includes(val) ? val : 'welcome'
})

type TransactionProps = InstanceType<typeof TransactionWrap>['$props']

const config = vue.computed<TransactionProps | undefined>(() => {
  const mapping: Record<AuthItemId, TransactionProps> = {
    'register': { title: 'Create your account', subTitle: 'Get started in seconds', icon: 'i-tabler-user-plus' },
    'welcome': { title: 'Welcome back', subTitle: 'Choose how you\'d like to sign in', icon: 'i-tabler-user-share' },
    'sent-verification': { title: 'Check your inbox!', subTitle: 'We sent an email verification link', icon: 'i-tabler-mail', status: 'success' },
    'confirm-verification': { title: 'Verify your email', subTitle: 'Enter the code we sent to your email', icon: 'i-tabler-mail' },
    'sent-magic-link': { title: 'Check your inbox!', subTitle: 'We sent a sign-in link', icon: 'i-tabler-mail', status: 'success' },
    'request-magic-link': { title: 'Sign In Link', subTitle: 'We\'ll email you a sign-in link', icon: 'i-tabler-sparkles' },
    'request-password-reset': { title: 'Reset Password', subTitle: 'Enter your email to reset your password', icon: 'i-tabler-lock' },
    'sent-password-reset': { title: 'Check your inbox!', subTitle: 'We sent a reset link', icon: 'i-tabler-mail', status: 'success' },
    'set-new-password': { title: 'Set New Password', subTitle: 'Enter your new password', icon: 'i-tabler-key' },
  }

  return mapping[itemId.value || 'welcome'] || mapping.welcome
})

const fields = vue.ref({
  email: '',
  fullName: '',
  orgName: '',
  password: '',
  passwordConfirm: '',
  oneTimeCode: '',
})

vue.onMounted(() => {
  vue.watch(() => fictionRouter.query.value, () => {
    const { email, code } = fictionRouter.query.value as { email?: string, code?: string }

    if (email)
      fields.value.email = email || ''

    if (code)
      fields.value.oneTimeCode = code || ''
  }, { immediate: true })
})

const sending = vue.ref<'google' | 'button' | ''>('')
const formError = vue.ref('')
const lastItemId = vue.ref()
const showOneTimeCode = vue.ref(false)

async function updateItemItemId(id: AuthItemId) {
  await fictionRouter.push({ path: props.card.link(`/auth/${id}`), query: fictionRouter.query.value }, { caller: 'authCard' })
}

const title = () => `Login / Register - ${fictionEnv.meta.app?.name}`
unhead.useHead({ title, meta: [{ name: `description`, content: title }] })

async function handleFormSubmit() {
  if (itemId.value === 'welcome' || itemId.value === 'register') {
    await passwordLogin()
  }
  else if (itemId.value === 'request-magic-link') {
    await sendMagicLink()
  }
  else if (itemId.value === 'request-password-reset') {
    await sendPasswordResetEmail()
  }
  else if (itemId.value === 'set-new-password') {
    if (fields.value.password !== fields.value.passwordConfirm) {
      formError.value = 'Passwords do not match'
      return
    }

    await loginWithCode()
  }
  else if (itemId.value === 'sent-magic-link') {
    if (!fields.value.oneTimeCode) {
      formError.value = 'Enter a valid code'
      return
    }

    await loginWithCode()
  }
  else {
    throw new Error('Invalid form submit')
  }
}

async function loginWithCode(args: { newPassword?: string } = {}) {
  const { newPassword } = args

  sending.value = 'button'

  const { email, oneTimeCode } = fields.value

  logger.info('loginWithCode', { data: { email, oneTimeCode } })

  if (oneTimeCode.length !== 6) {
    formError.value = 'Enter a valid code'
    sending.value = ''
    return
  }

  const r = await fictionUser.requests.ManageUser.request({
    _action: 'loginWithCode',
    where: { email },
    code: oneTimeCode,
    newPassword,
  })

  if (r.status === 'success') {
    logger.info('loginWithCode SUCCESS REDIRECT')
    await props.card.goto({ path: '/', query: { } }, { caller: 'authCard-loginWithCode' })
  }

  sending.value = ''
}

async function sendPasswordResetEmail() {
  sending.value = 'button'
  formError.value = ''

  const { email } = fields.value

  const r = await fictionAdmin.emailActions.passwordReset.requestSend({
    to: email,
    queryVars: { },
  })

  if (r?.status === 'error') {
    formError.value = r.message || 'An error occurred'
  }
  else if (r?.status === 'success') {
    lastItemId.value = itemId.value
    updateItemItemId('sent-password-reset')
  }

  sending.value = ''
}

async function sendMagicLink(): Promise<void> {
  sending.value = 'button'
  formError.value = ''

  const { email } = fields.value

  const createUserFields: Partial<User> = {
    ...fields.value,
    email,
    needsOnboarding: true,
  }

  // This will create a user if one doesn't exist (getCreate)
  const r = await fictionAdmin.emailActions.magicLoginEmailAction.requestSend({
    to: email,
    createUserFields,
    baseRoute: '/app',
    queryVars: {},
  })

  if (r?.status === 'error') {
    formError.value = r.message || 'An error occurred'
  }
  else if (r?.status === 'success') {
    lastItemId.value = itemId.value
    updateItemItemId('sent-magic-link')
  }

  sending.value = ''
}

async function passwordLogin() {
  const { email, password } = fields.value
  // do pass
  const r = await fictionUser.requests.ManageUser.request({
    _action: 'login',
    where: { email },
    password,
    createOnEmpty: itemId.value === 'register',
    createUserFields: { needsOnboarding: true },
  })

  if (r?.status === 'error') {
    formError.value = r.message || 'An error occurred'
  }
  else if (r?.status === 'success') {
    if (!r.user?.emailVerified) {
      await sendMagicLink()
    }
    else {
      const query: Record<string, string> = { }
      if (r.isNew) {
        query._isNewUser = '1'
      }
      await props.card.goto({ path: '/', query }, { caller: 'authCard-passwordLogin' })
    }
  }
}

const quotes = [
  { text: 'Yesterday you said tomorrow.', author: 'Nike' },
  { text: 'Become who you are.', author: 'Nietzsche' },
  { text: 'Take massive action now!', author: 'Tony Robbins' },
  { text: 'Change your story, change your life.', author: 'Lori Gottlieb' },
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
          await sendMagicLink()
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
        formError.value = response.message || 'An google auth error occurred'
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
    <TransactionWrap v-bind="config">
      <ElForm class="space-y-5" data-test-id="form" :data-value="JSON.stringify(fields)" :notify="formError" @submit="handleFormSubmit()">
        <EffectTransitionList>
          <div
            v-if="itemId.includes('sent')"
            class="text-center text-balance text-base text-theme-700 dark:text-theme-100 space-y-4"
          >
            <p>
              <XButton
                size="sm"
                design="ghost"
                theme="default"
                icon="i-tabler-arrow-left"
                data-test-id="to-one-time-code"
                @click.prevent="updateItemItemId('welcome')"
              >
                Back to Login
              </XButton>
            </p>
          </div>

          <template v-else>
            <XButton
              v-if="['welcome', 'register'].includes(itemId || '')"
              :key="`googleLogin-${itemId}`"
              data-test-id="google-login-button"
              type="submit"
              format="block"
              theme="primary"
              design="outline"
              size="lg"
              :loading="sending === 'google'"
              icon="i-tabler-brand-google-filled"
              @click.prevent="runGoogleLogin()"
            >
              {{ itemId === 'register' ? 'Sign up' : 'Login' }} With Google
            </XButton>

            <div v-if="['welcome', 'register'].includes(itemId || '')" class="text-center text-theme-500 flex items-center justify-center gap-4">
              <div class="border-b border-theme-200 border-theme-700/60 grow" />
              <span>or</span>
              <div class="border-b border-theme-200 border-theme-700/60 grow" />
            </div>

            <ElInput
              v-if="['welcome', 'register', 'request-magic-link', 'request-password-reset'].includes(itemId || '')"
              :key="`inputEmail-${itemId}`"
              data-test-id="input-email"
              class="w-full"
              label="Email"
              input="InputEmail"
              :input-props="{ autocomplete: 'email', required: true, placeholder: 'Enter your email' }"
              :model-value="fields.email"
              ui-size="lg"
              @update:model-value="fields.email = $event"
            />

            <ElInput
              v-if="itemId === 'welcome'"
              key="inputCurrentPassword"
              data-test-id="input-current-password"
              input="InputPassword"
              label="Password"
              class="w-full"
              :input-props="{ autocomplete: 'current-password', required: true, placeholder: 'Enter your password' }"
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
              :input-props="{ autocomplete: 'new-password', required: true, placeholder: 'Create a password' }"
              ui-size="lg"
              :model-value="fields.password"
              @update:model-value="fields.password = $event"
            />
            <ElInput
              v-if="itemId === 'set-new-password'"
              key="set-new-password"
              v-model="fields.password"
              data-test-id="input-new-password"
              input="InputPassword"
              label="Password"
              class="w-full"
              :input-props="{ autocomplete: 'new-password', required: true, placeholder: 'Create a password' }"
              ui-size="lg"
            />
            <ElInput
              v-if="itemId === 'set-new-password'"
              key="set-new-password-confirm"
              v-model="fields.passwordConfirm"
              data-test-id="input-new-password-confirm"
              input="InputPassword"
              label="Confirm Password"
              class="w-full"
              :input-props="{ autocomplete: 'new-password', required: true, placeholder: 'Confirm your password' }"
              ui-size="lg"
            />

            <XButton
              v-if="itemId === 'set-new-password'"
              data-test-id="code-login-button"
              type="submit"
              format="block"
              theme="primary"
              design="outline"
              size="lg"
              :loading="sending === 'button'"
              icon="i-tabler-lock-open"
            >
              Set New Password
            </XButton>
            <XButton
              v-else-if="itemId === 'welcome'"
              :key="`passwordLogin-${itemId}`"
              data-test-id="submit-button-login"
              type="submit"
              format="block"
              theme="primary"
              design="outline"
              size="lg"
              :loading="sending === 'button'"
              icon="i-tabler-user-check"
            >
              Sign In
            </XButton>
            <XButton
              v-if="itemId === 'register'"
              :key="`passwordRegister-${itemId}`"
              data-test-id="submit-button-register"
              type="submit"
              format="block"
              theme="primary"
              design="outline"
              size="lg"
              :loading="sending === 'button'"
              icon="i-tabler-user-plus"
            >
              Create Account
            </XButton>
            <XButton
              v-if="['request-magic-link', 'request-password-reset'].includes(itemId || '')"
              :key="`submit-send-email-${itemId}`"
              data-test-id="submit-button-send-email"
              type="submit"
              format="block"
              theme="primary"
              design="outline"
              size="lg"
              :loading="sending === 'button'"
              icon-after="i-tabler-arrow-right"
            >
              {{ itemId === 'request-magic-link' ? 'Send Sign In Link' : 'Send Reset Link' }}
            </XButton>

            <div class="text-theme-400 dark:text-theme-500 text-xs font-sans text-balance text-center space-y-8 pt-4">
              <div class="text-center flex gap-4 justify-center flex-wrap items-center">
                <XButton
                  v-if="itemId === 'welcome'"
                  size="xs"
                  design="link"
                  theme="default"
                  icon="i-tabler-rocket"
                  data-test-id="to-register"
                  @click.prevent="updateItemItemId('register')"
                >
                  Create Account
                </XButton>
                <XButton
                  v-if="['register', 'request-magic-link'].includes(itemId || '')"
                  size="xs"
                  design="link"
                  theme="default"
                  icon="i-tabler-arrow-up-right"
                  data-test-id="to-welcome"
                  @click.prevent="updateItemItemId('welcome')"
                >
                  Login instead?
                </XButton>
                <XButton
                  v-if="['welcome', 'register'].includes(itemId || '')"
                  size="xs"
                  design="link"
                  theme="default"
                  icon="i-tabler-wand"
                  data-test-id="to-magic"
                  @click.prevent="updateItemItemId('request-password-reset')"
                >
                  Forgot Password
                </XButton>
              </div>

              <div class=" leading-[1.4]">
                By continuing, you agree to the
                <a class="underline text-theme-500 dark:text-theme-400" :href="uc.termsUrl" target="_blank">Terms of Service</a>
                and
                <a class="underline text-theme-500 dark:text-theme-400" :href="uc.privacyUrl" target="_blank">Privacy Policy</a>
              </div>
            </div>
          </template>
        </EffectTransitionList>
      </ElForm>
    </TransactionWrap>
  </TransactionView>
</template>
