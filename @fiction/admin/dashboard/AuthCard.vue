<script lang="ts" setup>
import type { MediaObject } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import type { FictionAdmin } from '..'
import TransactionView from '@fiction/cards/page-transaction/TransactionView.vue'
import TransactionWrap from '@fiction/cards/page-transaction/TransactionWrap.vue'
import { localRef, log, unhead, useService, vue } from '@fiction/core'
import { googleAuth } from '@fiction/core/plugin-user/google'
import XButton from '@fiction/ui/buttons/XButton.vue'
import EffectTransitionList from '@fiction/ui/effect/EffectTransitionList.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import { createLogger } from 'vite'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const logger = log.contextLogger('AuthCard')

export type UserConfig = { logo?: MediaObject, termsUrl?: string, privacyUrl?: string }

const uc = vue.computed(() => props.card.userConfig.value)

const { fictionRouter, fictionAdmin, fictionEnv, fictionUser } = useService<{ fictionAdmin: FictionAdmin }>()

type AuthItemId = 'login' | 'register' | 'confirm' | 'magic' | undefined | ''
const itemId = vue.computed(() => {
  return (fictionRouter.params.value.itemId as AuthItemId) || 'login'
})
const fields = localRef({ key: 'fictionAuth', def: { email: '', fullName: '', orgName: '', password: '', oneTimeCode: '' }, lifecycle: 'session' })

const sending = vue.ref<'google' | 'button' | ''>('')
const formError = vue.ref('')
const lastItemId = vue.ref()
const showOneTimeCode = vue.ref(false)

async function updateItemItemId(id: string) {
  await fictionRouter.push({ path: props.card.link(`/auth/${id}`), query: fictionRouter.query.value }, { caller: 'authCard' })
}

const title = () => `Login / Register - ${fictionEnv.meta.app?.name}`
unhead.useHead({ title, meta: [{ name: `description`, content: title }] })

async function handleFormSubmit() {
  if (itemId.value === 'login') {
    await passwordLogin()
  }
  else if (itemId.value === 'magic') {
    await sendMagicLink()
  }
  else if (itemId.value === 'confirm') {
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

async function loginWithCode() {
  sending.value = 'button'

  const { email, oneTimeCode } = fields.value

  logger.info('loginWithCode', { data: { email, oneTimeCode } })

  const r = await fictionUser.requests.ManageUser.request({ _action: 'loginWithCode', where: { email }, code: oneTimeCode })

  if (r.status === 'success') {
    await props.card.goto({ path: '/', query: {} }, { caller: 'authCard-loginWithCode' })
  }

  sending.value = ''
}

async function sendMagicLink(): Promise<void> {
  sending.value = 'button'
  formError.value = ''

  const { email } = fields.value

  // This will create a user if one doesn't exist (getCreate)
  const r = await fictionAdmin.emailActions.magicLoginEmailAction.requestSend({
    to: email,
    fields: fields.value,
    baseRoute: '/app',
    queryVars: {},
  })

  if (r?.status === 'error') {
    formError.value = r.message || 'An error occurred'
  }
  else if (r?.status === 'success') {
    lastItemId.value = itemId.value
    updateItemItemId('confirm')
  }

  sending.value = ''
}

async function passwordLogin() {
  const { email, password } = fields.value
  // do pass
  const r = await fictionUser.requests.ManageUser.request({ _action: 'login', where: { email }, password })

  if (r?.status === 'error') {
    formError.value = r.message || 'An error occurred'
  }
  else if (r?.status === 'success') {
    if (!r.user?.emailVerified) {
      await sendMagicLink()
    }
    else {
      const query: Record<string, string> = {}
      if (r.isNew) {
        query._isNewUser = '1'
      }
      await props.card.goto({ path: '/', query }, { caller: 'authCard-passwordLogin' })
    }
  }
}

type TransactionProps = InstanceType<typeof TransactionWrap>['$props']

const config = vue.computed<TransactionProps | undefined>(() => {
  const mapping: Record<string, TransactionProps> = {
    register: { title: 'Create Account', icon: 'i-tabler-user-plus' },
    login: { title: 'Login', icon: 'i-tabler-login' },
    confirm: { title: 'Check your inbox!', icon: 'i-tabler-mail', status: 'success' },
  }

  return mapping[itemId.value || 'login'] || mapping.login
})

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
  if (itemId.value === 'confirm') {
    showOneTimeCode.value = false
  }

  formError.value = ''
})
</script>

<template>
  <TransactionView :card :quote>
    <TransactionWrap v-bind="config">
      <template #links>
        <div class="text-sm text-theme-500 dark:text-theme-300 font-sans my-3">
          <EffectTransitionList>
            <template v-if="itemId === 'register'">
              <XButton
                size="sm"
                design="ghost"
                theme="primary"
                icon="i-tabler-login"
                data-test-id="to-login"
                @click.prevent="updateItemItemId('login')"
              >
                Login Instead
              </XButton>
            </template>
            <template v-else-if="itemId !== 'confirm'">
              <XButton
                size="sm"
                design="ghost"
                theme="primary"
                icon="i-tabler-plus"
                data-test-id="to-register"
                @click.prevent="updateItemItemId('register')"
              >
                Create Account Instead
              </XButton>
            </template>
          </EffectTransitionList>
        </div>
      </template>
      <ElForm class="space-y-5" data-test-id="form" :data-value="JSON.stringify(fields)" :notify="formError" @submit="handleFormSubmit()">
        <EffectTransitionList>
          <template v-if="itemId === 'confirm'">
            <div v-if="!showOneTimeCode" class="text-center text-balance text-base text-theme-700 dark:text-theme-100 space-y-4">
              <p>We sent a sign-in link to <span class="font-bold text-theme-700 dark:text-theme-0">{{ fields.email || "an email" }}</span>.</p>
              <p v-if="fields.email ">
                <XButton
                  size="sm"
                  design="ghost"
                  theme="default"
                  icon="i-tabler-asterisk"
                  icon-after="i-tabler-arrow-down"
                  data-test-id="to-one-time-code"
                  @click.prevent="showOneTimeCode = !showOneTimeCode"
                >
                  Enter Verification Code
                </XButton>
              </p>
            </div>
            <div v-if="showOneTimeCode && fields.email" class="w-full">
              <ElInput
                key="InputOneTimeCode"
                data-test-id="input-one-time-code"
                class="my-6"
                input="InputOneTimeCode"
                label="One Time Code"
                sub-label="Check your email for the code"
                :input-props="{ autocomplete: 'one-time-code', required: true, placeholder: 'Enter the code from your email' }"
                ui-size="lg"
                :model-value="fields.oneTimeCode"
                @update:model-value="fields.oneTimeCode = $event"
              />
              <XButton
                data-test-id="code-login-button"
                type="submit"
                format="block"
                theme="primary"
                size="lg"
                :loading="sending === 'button'"
                icon-after="i-tabler-arrow-right"
              >
                Login with Code
              </XButton>
            </div>
            <div class="pt-6 text-center">
              <XButton
                size="sm"
                design="link"
                icon="i-tabler-arrow-left"
                data-test-id="to-login"
                @click.prevent="updateItemItemId('login')"
              >
                Back to Login
              </XButton>
            </div>
          </template>
          <template v-else>
            <XButton
              data-test-id="google-login-button"
              type="submit"
              format="block"
              theme="default"
              size="lg"
              :loading="sending === 'google'"
              icon="i-tabler-brand-google-filled"
              @click.prevent="runGoogleLogin()"
            >
              {{ itemId === 'register' ? 'Sign up' : 'Login' }} With Google
            </XButton>
            <div class="absolute ml-[10000px]">
              <div id="google-signin-button" />
            </div>

            <div class="text-center text-theme-500 flex items-center justify-center gap-4">
              <div class="border-b border-theme-200 border-theme-700/60 grow" />
              <span>or</span>
              <div class="border-b border-theme-200 border-theme-700/60 grow" />
            </div>

            <ElInput
              key="inputEmail"
              data-test-id="input-email"
              class="my-6"
              label="Email"
              input="InputEmail"
              :input-props="{ autocomplete: 'email', required: true, placeholder: 'your@email.com' }"
              :model-value="fields.email"
              ui-size="lg"
              @update:model-value="fields.email = $event"
            />

            <ElInput
              v-if="itemId === 'login'"
              key="inputPassword"
              data-test-id="input-password"
              input="InputPassword"
              label="Password"
              :input-props="{ autocomplete: 'current-password', required: true, placeholder: 'Enter your password' }"
              ui-size="lg"
              :model-value="fields.password"
              @update:model-value="fields.password = $event"
            />

            <ElInput
              v-if="itemId === 'register'"
              key="inputPassword"
              data-test-id="input-password"
              class="my-6"
              input="InputPassword"
              label="Password"
              description="Must be at least 6 characters long"
              :input-props="{ autocomplete: 'new-password', required: true, placeholder: 'Create a secure password' }"
              ui-size="lg"
              :model-value="fields.password"
              @update:model-value="fields.password = $event"
            />
            <div class="action">
              <XButton
                v-if="itemId === 'login' || itemId === 'register'"
                data-test-id="password-login-button"
                type="submit"
                format="block"
                theme="primary"
                size="lg"
                :loading="sending === 'button'"
                icon-after="i-tabler-arrow-right"
              >
                {{ itemId === 'login' ? 'Login' : 'Create Account' }}
              </XButton>
              <XButton
                v-else-if="itemId === 'magic'"
                data-test-id="email-login-button"
                type="submit"
                format="block"
                theme="primary"
                size="lg"
                :loading="sending === 'button'"
                icon="i-tabler-sparkles"
              >
                Send Secure Login Link
              </XButton>
            </div>

            <div class="text-theme-400 dark:text-theme-500 text-xs font-sans text-balance text-center space-y-8 pt-4">
              <div>
                By continuing, you agree to our
                <a class="underline text-theme-500 dark:text-theme-400" :href="uc.termsUrl" target="_blank">Terms of Service</a>
                and
                <a class="underline text-theme-500 dark:text-theme-400" :href="uc.privacyUrl" target="_blank">Privacy Policy</a>
              </div>

              <div class="text-center">
                <XButton
                  v-if="itemId === 'magic'"
                  size="sm"
                  design="ghost"
                  theme="default"
                  icon="i-tabler-login"
                  data-test-id="to-password"
                  @click.prevent="updateItemItemId('login')"
                >
                  Login with Password Instead
                </XButton>
                <XButton
                  v-else-if="itemId === 'login'"
                  size="sm"
                  design="ghost"
                  theme="default"
                  icon="i-tabler-wand"
                  data-test-id="to-magic"
                  @click.prevent="updateItemItemId('magic')"
                >
                  Email Me a Secure Login Link
                </XButton>
              </div>
            </div>
          </template>
        </EffectTransitionList>
      </ElForm>
    </TransactionWrap>
  </TransactionView>
</template>
