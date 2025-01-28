<script lang="ts" setup>
import type { MediaObject } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import type { FictionAdmin } from '..'
import TransactionView from '@fiction/cards/page-transaction/TransactionView.vue'
import TransactionWrap from '@fiction/cards/page-transaction/TransactionWrap.vue'
import { unhead, useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import EffectTransitionList from '@fiction/ui/effect/EffectTransitionList.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'

export type UserConfig = { logo?: MediaObject, termsUrl?: string, privacyUrl?: string }

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value)

const { fictionRouter, fictionAdmin, fictionEnv, fictionUser } = useService<{ fictionAdmin: FictionAdmin }>()

const itemId = vue.computed(() => fictionRouter.params.value.itemId as 'login' | 'register' | 'confirm' | 'password' | undefined | '')
const fields = vue.ref({ email: '', fullName: '', orgName: '', password: '' })
const sending = vue.ref(false)
const formError = vue.ref('')
const lastItemId = vue.ref()

async function updateItemItemId(id: string) {
  await fictionRouter.push({ path: props.card.link(`/auth/${id}`), query: fictionRouter.query.value }, { caller: 'authCard' })
}

const title = () => `Login / Register - ${fictionEnv.meta.app?.name}`
unhead.useHead({ title, meta: [{ name: `description`, content: title }] })

async function handleFormSubmit() {
  if (itemId.value === 'password') {
    await passwordLogin()
  }
  else {
    await sendMagicLink()
  }
}

async function passwordLogin() {
  const { email, password } = fields.value
  // do pass
  const r = await fictionUser.requests.ManageUser.request({ _action: 'login', where: { email }, password })

  if (r?.status === 'error') {
    formError.value = r.message || 'An error occurred'
  }
  else if (r?.status === 'success') {
    await fictionRouter.replace(props.card.link('/'), { caller: 'password-login' })
  }
}

async function sendMagicLink(): Promise<void> {
  sending.value = true
  formError.value = ''

  const { email } = fields.value

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

  sending.value = false
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
</script>

<template>
  <TransactionView :card :quote>
    <TransactionWrap v-bind="config">
      <template #links>
        <div class="text-sm text-theme-500 dark:text-theme-300 font-sans">
          <template v-if="itemId === 'register'">
            Have an account? <a data-test-id="to-login" class="text-primary-500 dark:text-primary-400 hover:opacity-80" href="#" @click.prevent="updateItemItemId('login')">Sign in &rarr;</a>
          </template>
          <template v-else-if="itemId !== 'confirm'">
            New here? <a data-test-id="to-register" class="text-primary-500 dark:text-primary-400 hover:opacity-80" href="#" @click.prevent="updateItemItemId('register')">Create your account &rarr;</a>
          </template>
        </div>
      </template>
      <ElForm class="space-y-7" data-test-id="form" :data-value="JSON.stringify(fields)" @submit="handleFormSubmit()">
        <EffectTransitionList>
          <template v-if="itemId === 'confirm'">
            <div class="text-balance text-center text-lg text-theme-700 dark:text-theme-100">
              We sent a magic link to <span class="font-bold text-theme-700 dark:text-theme-0">{{ fields.email || "an email" }}</span>. Please click the link to login.
            </div>
            <div>
              <div class="text-theme-400 dark:text-theme-200 text-xs font-sans text-balance text-center leading-relaxed">
                Can't find the email? Check your spam folder or
                <a data-test-id="to-last" class="text-primary-500 dark:text-primary-400 hover:opacity-80" href="#" @click.prevent="updateItemItemId('login')">try a different email &rarr;</a>
              </div>
            </div>
          </template>
          <template v-else>
            <ElInput
              key="inputEmail"
              data-test-id="input-email"
              class="my-6"
              label="Email"
              input="InputEmail"
              :input-props="{ autocomplete: 'email', required: true, placeholder: 'your@email.com' }"
              :value="fields.email"
              ui-size="lg"
              @input="fields.email = $event.target.value"
            />

            <ElInput
              v-if="itemId === 'password'"
              key="inputPassword"
              data-test-id="input-password"
              input="InputPassword"
              label="Password"
              :input-props="{ autocomplete: 'current-password', required: true, placeholder: 'Enter your password' }"
              ui-size="lg"
              :value="fields.password"
              @input="fields.password = $event.target.value"
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
              :value="fields.password"
              @input="fields.password = $event.target.value"
            />
            <div class="action">
              <XButton
                v-if="itemId === 'password'"
                data-test-id="password-login-button"
                type="submit"
                format="block"
                theme="primary"
                size="lg"
                :loading="sending"
                icon="i-tabler-login"
              >
                Login with Password
              </XButton>
              <XButton
                v-else
                data-test-id="email-login-button"
                type="submit"
                format="block"
                theme="primary"
                size="lg"
                :loading="sending"
                icon="i-tabler-sparkles"
              >
                Send Secure Login Link
              </XButton>
            </div>

            <div class="text-theme-400 dark:text-theme-500 text-xs font-sans text-balance text-center space-y-6">
              <div>
                By continuing, you agree to our
                <a class="underline text-theme-500 dark:text-theme-400" :href="uc.termsUrl" target="_blank">Terms of Service</a>
                and
                <a class="underline text-theme-500 dark:text-theme-400" :href="uc.privacyUrl" target="_blank">Privacy Policy</a>
              </div>

              <div class="text-xs cursor-pointer hover:opacity-80">
                <div v-if="itemId === 'login'" class="text-xs cursor-pointer hover:opacity-80" @click="updateItemItemId('password')">
                  Use Password Instead
                </div>
                <div v-else-if="itemId === 'password'" @click="updateItemItemId('login')">
                  Use Magic Link Instead
                </div>
              </div>
            </div>
          </template>
        </EffectTransitionList>
      </ElForm>
    </TransactionWrap>
  </TransactionView>
</template>
