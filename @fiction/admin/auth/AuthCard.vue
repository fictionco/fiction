<script lang="ts" setup>
import type { MediaObject } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import type { FictionAdmin } from '..'
import TransactionView from '@fiction/cards/transactions/TransactionView.vue'
import TransactionWrap from '@fiction/cards/transactions/TransactionWrap.vue'
import { unhead, useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import EffectTransitionList from '../el/EffectTransitionList.vue'

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
    register: { heading: 'Create a New Account', icon: 'i-tabler-user-plus' },
    login: { heading: 'Login', icon: 'i-tabler-login' },
    confirm: { heading: 'Check your inbox!', icon: 'i-tabler-mail', status: 'success' },
  }

  return mapping[itemId.value || 'login'] || mapping.login
})

const quotes = [
  { text: 'Make yourself visible. You can never know where the opportunity can come from.', author: 'Dentes Leo' },
  { text: 'Yesterday you said tomorrow.', author: 'Nike' },
  { text: 'Without marketing yourself, people from your past know a version of you that no longer exists.', author: 'Anonymous' },
]

const quote = vue.computed(() => quotes[Math.floor(Math.random() * quotes.length)])
</script>

<template>
  <TransactionView :card :quote>
    <TransactionWrap v-bind="config">
      <template #links>
        <div class="text-sm text-theme-500 dark:text-theme-300 font-sans">
          <template v-if="itemId === 'register'">
            Already have an account? <a data-test-id="to-login" class="text-primary-500 dark:text-primary-400 hover:opacity-80" href="#" @click.prevent="updateItemItemId('login')">Sign in  &rarr;</a>
          </template>
          <template v-else-if="itemId !== 'confirm'">
            First time here? <a data-test-id="to-register" class="text-primary-500 dark:text-primary-400 hover:opacity-80" href="#" @click.prevent="updateItemItemId('register')">Sign up for free &rarr;</a>
          </template>
        </div>
      </template>
      <ElForm class="space-y-7" data-test-id="form" :data-value="JSON.stringify(fields)" @submit="handleFormSubmit()">
        <EffectTransitionList>
          <template v-if="itemId === 'confirm'">
            <div class="text-balance text-center text-lg text-theme-700 dark:text-theme-100">
              We sent a magic link to <span class="font-bold text-theme-700 dark:text-theme-0">{{ fields.email || "unknown" }}</span>. Please click the link to login.
            </div>
            <div>
              <div class="text-theme-400 dark:text-theme-200 text-xs font-sans text-balance text-center leading-relaxed">
                Can't see the email? Please check the spam folder.
                Wrong email? <a data-test-id="to-last" class="text-primary-500 dark:text-primary-400 hover:opacity-80" href="#" @click.prevent="updateItemItemId('login')">Try Again &rarr;</a>
              </div>
            </div>
          </template>
          <template v-else>
            <ElInput
              key="inputEmail"
              data-test-id="input-email"
              class="my-6"
              label="Email Address"
              input="InputEmail"
              :input-props="{ autocomplete: 'email', required: true, placeholder: 'Enter Your Email' }"
              :value="fields.email"
              ui-size="lg"
              @input="fields.email = $event.target.value"
            />

            <ElInput
              v-if="itemId === 'register'"
              data-test-id="input-name"
              label="Your Name"
              input="InputText"
              :input-props="{ autocomplete: 'name', required: true, placeholder: 'Full Name' }"
              ui-size="lg"
              :value="fields.fullName"
              @input="fields.fullName = $event.target.value"
            />

            <ElInput
              v-if="itemId === 'password'"
              key="inputPassword"
              data-test-id="input-password"
              input="InputPassword"
              label="Password"
              :input-props="{ autocomplete: 'current-password', required: true, placeholder: 'Your Password' }"
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
              label="Create Password"
              description="Minimum 6 characters"
              :input-props="{ autocomplete: 'new-password', required: true, placeholder: 'Create New Password' }"
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
                Email Me a Magic Link
              </XButton>
            </div>

            <div class="text-theme-400 dark:text-theme-500 text-xs font-sans text-balance text-center space-y-6">
              <div>
                You acknowledge that you read, and agree to the
                <a class="underline text-theme-500 dark:text-theme-400" :href="uc.termsUrl" target="_blank">terms</a>
                and
                <a class="underline text-theme-500 dark:text-theme-400" :href="uc.privacyUrl" target="_blank">privacy policy</a>.
              </div>

              <div class="text-xs cursor-pointer hover:opacity-80">
                <div v-if="itemId === 'login'" class="text-xs cursor-pointer hover:opacity-80" @click="updateItemItemId('password')">
                  Login with Password
                </div>
                <div v-else-if="itemId === 'password'" @click="updateItemItemId('login')">
                  Login with Email
                </div>
              </div>
            </div>
          </template>
        </EffectTransitionList>
      </ElForm>
    </TransactionWrap>
  </TransactionView>
</template>
