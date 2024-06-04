<script lang="ts" setup>
import type { Card } from '@fiction/site/card'
import type { MediaDisplayObject } from '@fiction/core'
import { unhead, useService, vue } from '@fiction/core'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import ElButton from '@fiction/ui/ElButton.vue'
import TransactionWrap from '@fiction/cards/transactions/TransactionWrap.vue'
import TransactionView from '@fiction/cards/transactions/TransactionView.vue'
import type { FictionAdmin } from '..'
import EffectTransitionList from '../el/EffectTransitionList.vue'

export type UserConfig = { logo?: MediaDisplayObject, termsUrl?: string, privacyUrl?: string }

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value)

const { fictionRouter, fictionAdmin, fictionEnv } = useService<{ fictionAdmin: FictionAdmin }>()

const itemId = vue.computed(() => fictionRouter.params.value.itemId as 'login' | 'register' | 'confirm' | undefined | '')
const fields = vue.ref({ email: '', fullName: '', orgName: '', password: '' })
const sending = vue.ref(false)
const formError = vue.ref('')
const lastItemId = vue.ref()

async function updateItemItemId(id: string) {
  await fictionRouter.push({ path: props.card.link(`/auth/${id}`), query: fictionRouter.query.value }, { caller: 'authCard' })
}

const title = () => `Login / Register - ${fictionEnv.meta.app?.name}`
unhead.useHead({
  title,
  meta: [{ name: `description`, content: title }],
})

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
  { text: 'You were born an original. Don\'t die a copy.', author: 'John Mason' },
  { text: 'Be yourself; everyone else is already taken.', author: 'Oscar Wilde' },
  { text: 'Your brand is what people say about you when you\'re not in the room.', author: 'Jeff Bezos' },
  { text: 'Personal branding is managing your name in a world of misinformation.', author: 'Tim Ferriss' },
  { text: 'The most important brand you will ever build is your own.', author: 'Richie Norton' },
  { text: 'Your personal brand is your unique identifier in a crowded marketplace.', author: 'Tom Peters' },
  { text: 'Be the CEO of your own personal brand.', author: 'Pete Cashmore' },
]

const quote = vue.computed(() => quotes[Math.floor(Math.random() * quotes.length)])
</script>

<template>
  <TransactionView :card="card" :quote>
    <TransactionWrap v-bind="config">
      <template #links>
        <div class="text-sm text-theme-500 dark:text-theme-300 font-sans">
          <template v-if="itemId === 'register'">
            Already have an account? <a data-test-id="to-login" class="text-primary-500 dark:text-primary-400 hover:opacity-80" href="#" @click.prevent="updateItemItemId('login')">Sign in  &rarr;</a>
          </template>
          <template v-else>
            First time here? <a data-test-id="to-register" class="text-primary-500 dark:text-primary-400 hover:opacity-80" href="#" @click.prevent="updateItemItemId('register')">Sign up for free &rarr;</a>
          </template>
        </div>
      </template>
      <ElForm class="space-y-7" data-test-id="form" :data-value="JSON.stringify(fields)" @submit="sendMagicLink()">
        <EffectTransitionList>
          <template v-if="itemId === 'confirm'">
            <div class="text-balance text-center text-lg text-theme-700 dark:text-theme-100">
              We sent a magic link to <span class="font-bold text-theme-700 dark:text-theme-0">{{ fields.email || "unknown" }}</span>. Please click the link to confirm your address.
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
              required
              :value="fields.email"
              placeholder="Enter Your Email"
              size="lg"
              @input="fields.email = $event.target.value"
            />

            <ElInput
              v-if="itemId === 'register'"
              data-test-id="input-name"
              label="Your Name"
              input="InputText"
              required
              placeholder="Full Name"
              autocomplete="name"
              size="lg"
              :value="fields.fullName"
              @input="fields.fullName = $event.target.value"
            />

            <ElInput
              v-if="itemId === 'register'"
              key="inputPassword"
              data-test-id="input-password"
              class="my-6"
              input="InputPassword"
              label="Create Password"
              description="Minimum 6 characters"
              autocomplete="new-password"
              placeholder="Create New Password"
              size="lg"
              required
              :value="fields.password"
              @input="fields.password = $event.target.value"
            />
            <div class="action">
              <ElButton
                data-test-id="email-login-button"
                type="submit"
                format="block"
                btn="primary"
                size="lg"
                :loading="sending"
                icon="i-tabler-sparkles"
              >
                Email Me a Magic Link
              </ElButton>
            </div>

            <div>
              <div class="text-theme-400 dark:text-theme-500 text-xs font-sans text-balance text-center">
                You acknowledge that you read, and agree to the
                <a class="underline text-theme-500 dark:text-theme-400" :href="uc.termsUrl" target="_blank">terms</a>
                and
                <a class="underline text-theme-500 dark:text-theme-400" :href="uc.privacyUrl" target="_blank">privacy policy</a>.
              </div>
            </div>
          </template>
        </EffectTransitionList>
      </ElForm>
    </TransactionWrap>
  </TransactionView>
</template>
